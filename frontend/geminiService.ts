import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile, OutageSlot } from './types';

let ai: GoogleGenAI | null = null;
try {
    // @ts-ignore
    if (process.env.API_KEY) {
        // @ts-ignore
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
    }
} catch (e) {
    console.warn("Failed to initialize GoogleGenAI. Ensure process.env.API_KEY is set.", e);
}

const MODEL_NAME = 'gemini-2.5-flash';

const formatSchedule = (schedule: OutageSlot[]) => {
    return schedule.map(s => `${s.startTime} to ${s.endTime}`).join(', ');
};

export const fetchRealtimeSchedule = async (city: string, area: string, provider: string): Promise<OutageSlot[]> => {
    if (!ai) return [];
    
    const prompt = `You are a real-time data provider for Pakistan's electricity load shedding. 
    Generate today's realistic load shedding schedule for ${area}, ${city} under the provider ${provider}. 
    Return exactly 3 outage slots. Ensure the times are realistic for this region.`;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "Unique ID like '1', '2'" },
                            startTime: { type: Type.STRING, description: "Start time in HH:MM format" },
                            endTime: { type: Type.STRING, description: "End time in HH:MM format" },
                            type: { type: Type.STRING, description: "Must be exactly 'Predicted' or 'Confirmed'" },
                            confidence: { type: Type.INTEGER, description: "Confidence percentage between 70 and 99" }
                        },
                        required: ["id", "startTime", "endTime", "type", "confidence"]
                    }
                }
            }
        });
        
        const data = JSON.parse(response.text || '[]');
        // Ensure type safety
        return data.map((slot: any) => ({
            ...slot,
            type: slot.type === 'Confirmed' ? 'Confirmed' : 'Predicted'
        }));
    } catch (error) {
        console.error("Error fetching real-time schedule:", error);
        return [];
    }
};

export const fetchActiveOutages = async (city: string): Promise<string[]> => {
    if (!ai) return [];

    const prompt = `List 3 to 4 specific areas or neighborhoods in ${city}, Pakistan that are highly likely to be experiencing an active power outage right now. Return ONLY a JSON array of strings representing the area names.`;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return JSON.parse(response.text || '[]');
    } catch (error) {
        console.error("Error fetching active outages:", error);
        return [];
    }
};

export const generatePlannerAdvice = async (profile: UserProfile, schedule: OutageSlot[]): Promise<string> => {
    if (!ai) return "AI service is currently unavailable. Please check your API key configuration.";

    const scheduleStr = formatSchedule(schedule);
    const appliancesStr = profile.appliances.join(', ');

    const prompt = `
    You are an AI assistant for an app called VoltWatch in Pakistan.
    The user lives in ${profile.area}, ${profile.city} and uses ${profile.provider}.
    Today's load shedding schedule is: ${scheduleStr}.
    The user has these major appliances: ${appliancesStr}.
    
    Write a direct, personalized action plan advising them on when to use their appliances to minimize disruption.
    CRITICAL: DO NOT use any formal greetings like "Assalam-o-Alaikum", "Hello", or "Hi". Get straight to the point.
    
    Structure your response exactly like this:
    1. First, clearly state the load shedding times.
    2. Then, provide actionable advice on what to do right now and when to use specific appliances.
    
    Write the response in a mix of Roman Urdu and English.
    Format with clear headings (e.g., "**Aaj ka Schedule:**", "**Abhi kya karein:**", "**Appliances ka optimal timing:**") and bullet points. Keep it highly practical and concise.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text || "Could not generate plan.";
    } catch (error) {
        console.error("Error generating plan:", error);
        return "Sorry, I encountered an error while generating your plan. Please try again later.";
    }
};

export const generateWeeklyReport = async (profile: UserProfile): Promise<string> => {
    if (!ai) return "AI service is currently unavailable.";

    const prompt = `
    You are an AI assistant for VoltWatch. Generate a realistic weekly load shedding insight report for a user in ${profile.area}, ${profile.city}.
    Write it in a mix of Roman Urdu and English.
    Include:
    - Total hours of load shedding in the past 7 days (make up a realistic number based on typical Pakistan load shedding, e.g., 14.5 hours).
    - Peak Outage Time (e.g., mostly between 12 PM and 5 PM).
    - Best Productive Windows (when power was most stable).
    
    Style example: "Assalam-o-Alaikum! Umeed hai aap ka pichla hafta behtar guzra hoga... Aapke pichle 7 dinon ke load shedding data ka mukammal jaiza yahan pesh hai:"
    Use markdown for bolding important numbers.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text || "Could not generate report.";
    } catch (error) {
        console.error("Error generating report:", error);
        return "Failed to load weekly insights.";
    }
};

export const sendChatMessage = async (message: string, history: {role: string, text: string}[], profile: UserProfile, schedule: OutageSlot[]): Promise<string> => {
     if (!ai) return "AI service is currently unavailable.";

     const scheduleStr = formatSchedule(schedule);
     
     const systemInstruction = `You are VoltWatch AI, a helpful assistant for load shedding in Pakistan. 
     The user is in ${profile.area}, ${profile.city}. Today's schedule: ${scheduleStr}.
     Answer their questions about power outages, appliance management, or schedules.
     ALWAYS respond in a natural mix of Roman Urdu and English. Be concise and helpful.`;

     let fullPrompt = `System: ${systemInstruction}\n\n`;
     history.forEach(msg => {
         fullPrompt += `${msg.role === 'user' ? 'User' : 'VoltWatch AI'}: ${msg.text}\n`;
     });
     fullPrompt += `User: ${message}\nVoltWatch AI:`;

     try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: fullPrompt,
        });
        return response.text || "Sorry, I didn't understand that.";
    } catch (error) {
        console.error("Error in chat:", error);
        return "Network error. Please try again.";
    }
}
