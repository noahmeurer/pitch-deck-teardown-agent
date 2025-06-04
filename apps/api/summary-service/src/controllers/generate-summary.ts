import { Request, Response, NextFunction } from 'express';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { unlink } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore: TS1479
import { GoogleGenAI } from '@google/genai';
import config from '../config';

const GEMINI_API_KEY = config.geminiApiKey;

const generateSummaryFromPDF = async (fileName: string) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })

  const config = {
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: `
You are a senior VC analyst. You will be provided a PDF that should represent a pitch deck. Your task is to generate a structured summary under these five headings:

1. Vertical & Target Customer  
2. Core Problem & Solution  
3. Business Model & Revenue Approach  
4. Traction & Validation  
5. Fundraising Ask  

**Guidelines:**  
- If the PDF is not actually a pitch deck (e.g., it's unrelated or unreadable), respond with: "The provided document does not appear to be a pitch deck. Please upload a valid deck.”  
- Otherwise, for each heading, extract, summarize, and report exactly what details exist.  
- If a heading is only partially covered, summarize the available information and explicitly note any missing specifics. If a heading is completely missing, state: "The deck does not provide information on [heading]." 
- Do **not** invent or hallucinate details to fill a heading.  
- Be as detailed and specific as possible, including any numbers or milestones from the deck (e.g., "$100k MRR"), but only if they appear.
- Where relevant, note any geographic signals such as the location of teams, customers, pilot partners, or target go-to-market regions if they can be reasonably inferred or are stated.
- Only report current facts; do not extrapolate or add future projections.
        `.trim(),
      },
    ],
  }

  const model = 'gemini-2.5-flash-preview-05-20'
  const contents = [
    {
      role: 'user',
      parts: [
        {
          inlineData: {
            data: fs.readFileSync(fileName, 'base64'),
            mimeType: 'application/pdf',
          },
        },
        {
          text: `
Generate a structured summary of the pitch deck, following the five headings. Be as detailed as the deck allows, and include any important numbers or milestones found.`,
        },
      ],
    },
  ]

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  })

  let summary = ''
  for await (const chunk of response) {
    summary += chunk.text
  }
  return summary
}

export const generateMultiHeadingSummary = async (req: Request, res: Response, next: NextFunction) => {
    let tempFilePath: string | undefined;
    
    try {
        // Get the full Supabase URL from request body
        const { documentUrl } = req.body;
        
        if (!documentUrl) {
            throw new Error('Document URL is required');
        }

        // Download the PDF
        const response = await fetch(documentUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to download PDF: ${response.status}`);
        }

        if (!response.body) {
            throw new Error('No response body received');
        }

        // Create temp file with a unique name
        const fileName = `${uuidv4()}.pdf`;
        tempFilePath = path.join(os.tmpdir(), fileName);
        const fileStream = fs.createWriteStream(tempFilePath);
        
        await pipeline(
            Readable.fromWeb(response.body as any),
            fileStream
        );

        // Generate summary using Gemini API
        const summary = await generateSummaryFromPDF(tempFilePath);

        res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {
        next(error);
    } finally {
        // Clean up temp file if it was created
        if (tempFilePath) {
            try {
                await unlink(tempFilePath);
            } catch (error) {
                console.error('Failed to clean up temporary file:', error);
            }
        }
    }
}