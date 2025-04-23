import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_AI_API_KEY || '');

type SummaryStyle = 'professional' | 'casual' | 'technical' | 'creative';

const stylePrompts = {
  professional: 'Provide a concise, business-oriented summary focusing on key points and actionable insights.',
  casual: 'Create a friendly, conversational summary that captures the main ideas in an approachable way.',
  technical: 'Generate a detailed, technical summary emphasizing specific details and technical concepts.',
  creative: 'Create an engaging, narrative-style summary that captures the essence of the content in a creative way.',
};

export async function generateSummary(content: string, style: SummaryStyle = 'professional'): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
      ${stylePrompts[style]}
      
      Text to summarize:
      ${content}
      
      Keep the summary concise and focused.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Unable to generate summary at this time.';
  }
}