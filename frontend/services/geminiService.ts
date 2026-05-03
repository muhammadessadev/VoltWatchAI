import { GoogleGenAI } from '@google/genai';
import { UserProfile, ScheduleSlot } from '../types';

// Initialize the SDK. Assumes process.env.API_KEY is available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
const MODEL_NAME = 'gemini-2.5-flash';

export const getSmartAdvice = async (
  profile: UserProfile,
  schedule: ScheduleSlot[]
): Promise<string> => {
  const prompt = `
System: You are a load shedding advisor for Pakistani households. 
User is in ${profile.city}, Area: ${profile.area}, DISCO: ${profile.disco}. 
Their appliances: ${profile.appliances.join(', ')}. 
Current predicted schedule: ${JSON.stringify(schedule)}.

Give specific advice: which appliances to run now, what to delay, 
and optimal timing for high-power appliances. 
Reply in conversational Roman Urdu. Be practical, not preachy. Keep it under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Sorry, I couldn't generate advice right now.";
  } catch (error) {
    console.error("Error getting smart advice:", error);
    return "Error connecting to AI. Please try again later.";
  }
};

export const sendChatMessage = async (
  message: string,
  profile: UserProfile,
  schedule: ScheduleSlot[],
  upsHours: number
): Promise<string> => {
  const time = new Date().toLocaleTimeString();
  const prompt = `
System: You are VoltWatch, a helpful Pakistani electricity assistant.
User location: ${profile.area}, ${profile.city}, ${profile.disco}. Current time: ${time}. 
Today's schedule: ${JSON.stringify(schedule)}. UPS status: ${upsHours} hours remaining.
Answer the user's question about electricity, load shedding, or appliance usage.
Be direct. Use Roman Urdu naturally. Keep answers under 3 sentences.

User: ${message}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "I didn't understand that.";
  } catch (error) {
    console.error("Error in chat:", error);
    return "Network error. Please check your connection.";
  }
};

export const generateWeeklyReport = async (weeklyData: any): Promise<string> => {
  const prompt = `
System: Analyze this user's load shedding data for the past 7 days:
${JSON.stringify(weeklyData)}

Generate: 
1) Total hours lost
2) Peak outage time of day
3) Best productive windows
4) One actionable tip for next week.

Format as a friendly weekly report in Roman Urdu. Add an encouraging tone. Use markdown for formatting (bolding, lists).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text || "Could not generate report.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Failed to generate weekly insights.";
  }
};
