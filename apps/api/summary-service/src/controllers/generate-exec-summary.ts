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

const generateSingleParagraphSummary = async(multiHeadingSummary: string) => {
    const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
      });
      const config = {
        responseMimeType: 'text/plain',
        systemInstruction: [
            {
            text: `
You are a senior VC analyst. I will provide you a structured summary of a pitch deck broken into five headings:
1. Vertical & Target Customer
2. Core Problem & Solution
3. Business Model & Revenue Approach
4. Traction & Validation
5. Fundraising Ask

Based solely on that five-heading summary, generate a single concise paragraph executive summary suitable for a senior VC manager. 
Do NOT ask for or expect the original PDF. Use only the information in the five headings provided in the user message. 
Write fluent prose (no bullet points), highlighting key value proposition, market context, business model, traction, and funding request. 

**Guidelines:**
- Limit your output to one paragraph under 150 words.
- If a heading contains no detail or is missing, briefly acknowledge that the deck does not provide information on that topic instead of guessing.
- Do not hallucinate details.
- Be objective and strictly informative. Do not express opinions or make subjective judgments. Focus on describing the deck's contents as-is.
            `.trim(),
            }
        ],
      };
      const model = 'gemini-2.5-flash-preview-05-20';
      const contents = [
        {
            role: 'user',
            parts: [
                {
                text: `Generate an executive summary of the pitch deck, following the five headings. Be concise but specific—include any important numbers or milestones found in the deck. Remain strictly objective and informative: avoid offering opinions, subjective language, or inferred conclusions.`,
                },
            ],
        },
        {
            role: 'model',
            parts: [
                {
                text: `${multiHeadingSummary}`,
                },
            ],
        },
        {
            role: 'user',
            parts: [
                {
                text: `
Based on the information in the five-heading summary, generate a concise single-paragraph executive summary. Emphasize value proposition, market context, business model, traction, and funding request in fluent prose.
Limit to one paragraph under 150 words.
                `.trim(),
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

export const generateExecSummary = async (req: Request, res: Response, next: NextFunction) => {
    let tempSummary: string | undefined;

    try {
        const { multiHeadingSummary } = req.body;

        if (!multiHeadingSummary) {
            throw new Error('Five-heading summary is required');
        }

        // Generate exec summary using Gemini API
        const summary = await generateSingleParagraphSummary(multiHeadingSummary);

        res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        next(error);
    }
}