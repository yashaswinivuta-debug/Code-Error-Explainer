
import { GoogleGenAI } from "@google/genai";
import type { Explanation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT_TEMPLATE = `
You are Code Error Explainer 🤖, an expert programming assistant.
Your job is to analyze programming error messages (from Python, C++, Java, JavaScript, etc.) and help the user understand what went wrong and how to fix it.

Follow these rules carefully:

1. Detect the language automatically from the error message.
2. Explain the error in simple, human terms — describe what it means.
3. Identify the root cause — why it happened.
4. Suggest a fix or solution, including a short code example if helpful. Format code blocks with markdown backticks.
5. Give a tip to help the user avoid the same issue in the future.
6. Respond in this exact structured format, using the specified prefixes. Do not add any other text, greetings, or explanations.

Here is the error message:
---
{{ERROR_MESSAGE}}
---

Your required response format:
🔍 Language: <detected language>
❌ Error Meaning: <clear explanation of what the error message means>
🧠 Root Cause: <reason behind the error>
✅ Fix Suggestion: <concise fix or example>
💡 Tip: <simple advice or best practice>
`;

// A more robust parser to handle multi-line fields
const parseExplanation = (text: string): Explanation => {
    const lines = text.split('\n');
    const explanation: Partial<Explanation> & { [key: string]: string } = {};
    let currentKey: keyof Explanation | null = null;
    
    const keyMap: { [key: string]: keyof Explanation } = {
        '🔍 Language:': 'language',
        '❌ Error Meaning:': 'meaning',
        '🧠 Root Cause:': 'cause',
        '✅ Fix Suggestion:': 'fix',
        '💡 Tip:': 'tip',
    };

    for (const line of lines) {
        let isNewKey = false;
        for (const prefix in keyMap) {
            if (line.startsWith(prefix)) {
                currentKey = keyMap[prefix];
                explanation[currentKey] = line.substring(prefix.length).trim();
                isNewKey = true;
                break;
            }
        }

        if (!isNewKey && currentKey && line.trim() !== '') {
            explanation[currentKey] += '\n' + line;
        }
    }

    if (!explanation.language || !explanation.meaning || !explanation.cause || !explanation.fix || !explanation.tip) {
        throw new Error("Failed to parse the explanation from AI response. The format might be incorrect.");
    }

    return explanation as Explanation;
};


export const explainError = async (errorMessage: string): Promise<Explanation> => {
  const prompt = PROMPT_TEMPLATE.replace('{{ERROR_MESSAGE}}', errorMessage);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const rawText = response.text;
    if (!rawText) {
      throw new Error("Received an empty response from the AI.");
    }
    
    return parseExplanation(rawText);

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not get an explanation from the AI. Please check your connection or API key.");
  }
};
