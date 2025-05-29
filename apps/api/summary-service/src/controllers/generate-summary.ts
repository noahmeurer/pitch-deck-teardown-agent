import { Request, Response, NextFunction } from 'express';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { unlink } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from '@google/genai';
import config from '../config';

const GEMINI_API_KEY = config.geminiApiKey;

const generateSummaryFromPDF = async (fileName: string) => {
    const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
      });
      const config = {
        responseMimeType: 'text/plain',
        systemInstruction: [
            {
              text: `You are a senior VC analyst. When given a PDF pitch deck, you will generate an executive summary an investor needs. Produce a structured executive summary that is under 300 words with these five headings: 
    1. Vertical & Target Customer
    2. Core Problem & Solution
    3. Business Model & Revenue Approach
    4. Traction & Validation
    5. Fundraising Ask
    Only report details that are found in the deck. Do not hallucinate.`,
            }
        ],
      };
      const model = 'gemini-2.5-flash-preview-05-20';
      const contents = [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                  data: fs.readFileSync(fileName, 'base64'),
                  mimeType: `application/pdf`,
              },
            },
            {
              text: `Generate an executive summary of the pitch deck, following the five headings. Be concise but specific—include any important numbers or milestones found in the deck. (e.g., $100k MRR)`,
            },
          ],
        },
      ];
    
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });
      let summary = '';
      for await (const chunk of response) {
        summary += chunk.text;
      }
      return summary;
}

export const generateSummary = async (req: Request, res: Response, next: NextFunction) => {
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