import { Request, Response, NextFunction } from 'express';
// @ts-ignore: TS1479
import { GoogleGenAI, Type } from "@google/genai";
import config from '../config';

interface Thesis {
    stage: string;
    check: string;
    verticals: string[];
    criteria: string[];
}

interface POSTBody {
    thesis: Thesis;
    multiHeadingSummary: string;
}

const GEMINI_API_KEY = config.geminiApiKey;

const generateStructuredFitAssessment = async (thesis: Thesis, multiHeadingSummary: string) => {
    const ai = new GoogleGenAI({ 
        apiKey: GEMINI_API_KEY,
     });
    const config = {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    fitScore: {
                        type: Type.NUMBER,
                    },
                    fitJustification: {
                        type: Type.STRING,
                    },
                },
                propertyOrdering: ["fitScore", "fitJustification"],
            },
        },
        systemInstruction: [
            {
                text: `
                You are a senior VC analyst assessing whether a startup aligns with a firm's investment thesis. You will receive:
                1. A five-heading summary of a pitch deck.
                2. An investment thesis object with the following fields:
                
                • stage: Expected company stage (e.g., "Pre-Seed / Seed")
                • check: Typical check size range (e.g., "$250K - $1.5M")
                • verticals: List of target sectors the firm invests in
                • criteria: A list of key qualitative requirements (e.g., US focus, technical team, etc.)
                
                Your task is to:
                - Review the startup summary.
                - Compare it to the thesis across all four areas (stage, check, verticals, and criteria).
                - Return a JSON object with:
                  • fitScore: A number (1 = poor fit, 2 = moderate fit, 3 = strong fit)
                  • fitJustification: A concise paragraph (≤100 words) explaining the alignment or misalignment across the thesis dimensions.
                
                **Scoring Guide:**
                - **Score 3 (Strong Fit):** Aligned on all thesis elements; no gaps.
                - **Score 2 (Moderate Fit):** Some alignment, but with gaps or missing information.
                - **Score 1 (Poor Fit):** Clear misalignment with the firm's thesis or missing key elements entirely.
                
                Only use evidence from the five-heading summary. Do NOT hallucinate or assume details not explicitly stated. If information is missing (e.g., no stage or unclear geography), acknowledge that in your justification.
                `.trim()
            }
        ],
    };
    const model = 'gemini-2.5-flash-preview-05-20';
    const contents = [
        {
          role: "user",
          parts: [
            {
              text: `Here is the firm's investment thesis:\n${JSON.stringify(thesis)}`
            }
          ]
        },
        {
          role: "user",
          parts: [
            {
              text: `Here is the five-heading summary of the pitch deck:\n${multiHeadingSummary}`
            }
          ]
        },
        {
          role: "user",
          parts: [
            {
              text: `Please assess how well this pitch aligns with the investment thesis. Return a fitScore (1-3) and a fitJustification (≤100 words) in JSON format.`
            }
          ]
        }
      ]

    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    });

    return response.text;
}

export const assessFit = async (req: Request, res: Response, next: NextFunction) => {
    const { thesis, multiHeadingSummary} = req.body as POSTBody;

    if (!thesis || !multiHeadingSummary) {
        throw new Error('Thesis and multi-heading summary are required');
    }

    try {
        let response = await generateStructuredFitAssessment(thesis, multiHeadingSummary);

        // Parse the response to JSON
        if (!response) {
            throw new Error('No response from AI service');
        }
        response = JSON.parse(response);
        
        res.status(200).json({
            success: true,
            data: response,
        });
    } catch (error) {
        next(error);
    }
}