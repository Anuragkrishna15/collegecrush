import { GoogleGenAI, Type } from "@google/genai";
import { BasicProfile, Message } from '../types.ts';

// As per instructions, API_KEY is assumed to be in the environment.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please set the API_KEY environment variable. This is a critical error for AI features to function.");
}

const ai = new GoogleGenAI({ apiKey });

export const findNearbyCafes = async (latitude: number, longitude: number): Promise<string[]> => {
    try {
        const prompt = `Find 5 popular, safe, and well-rated cafes or coffee shops suitable for a first date near latitude ${latitude} and longitude ${longitude}. Return a JSON object with a key 'cafes' which is an array of 5 strings, where each string is just the cafe name.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        cafes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "The name of a suitable cafe."
                            }
                        }
                    },
                    required: ["cafes"]
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        if (result && result.cafes && Array.isArray(result.cafes)) {
            return result.cafes;
        }
        throw new Error("Could not find cafes in the expected format.");
    } catch (error) {
        console.error("Error finding nearby cafes:", error);
        throw new Error("Couldn't find cafes near you at the moment. Please try again.");
    }
};


export const generateIcebreakers = async (profile: BasicProfile): Promise<string[]> => {
    try {
        const promptsContext = (profile.prompts && profile.prompts.length > 0)
            ? profile.prompts.map(p => `Q: ${p.question}\nA: ${p.answer}`).join('\n\n')
            : 'No prompts provided.';

        const profileContext = `Name: ${profile.name}, Bio: ${profile.bio || 'Not provided'}, Interests: ${profile.tags.join(', ')}.
        
        Their Profile Prompts:
        ${promptsContext}
        `;
        
        const prompt = `Based on the following dating profile, generate 3 short, fun, and creative icebreaker messages to start a conversation. The messages should try to reference their profile, especially their prompts if they exist.
        
        Profile details: ${profileContext}
        
        Return the response as a JSON object with a single key "icebreakers" which is an array of 3 strings.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        icebreakers: {
                            type: Type.ARRAY,
                            items: { 
                                type: Type.STRING,
                                description: "A short, fun, and engaging icebreaker message."
                            },
                            description: "An array of 3 icebreaker messages."
                        }
                    },
                    required: ["icebreakers"]
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && result.icebreakers && Array.isArray(result.icebreakers)) {
            return result.icebreakers.slice(0, 3); // Ensure only 3 are returned
        }

        throw new Error("Received an unexpected format from the AI for icebreakers.");

    } catch (error) {
        console.error("Error generating icebreakers:", error);
        throw new Error("Could not generate icebreakers. Let's try a classic 'Hey!' for now?");
    }
};


export const rateConversation = async (messages: Message[], currentUserId: string): Promise<{score: number, feedback: string}> => {
    try {
        const formattedMessages = messages.map(msg => {
            const author = msg.senderId === currentUserId ? 'Me' : 'Them';
            return `${author}: ${msg.text}`;
        }).join('\n');

        const prompt = `You are a fun and modern dating coach called the "Rizz Meter". The following is the beginning of a conversation on a dating app. The user who is asking for the rating is "Me".
        
        Conversation:
        ${formattedMessages}

        Please analyze my messages and provide a "Rizz Score" from 1 to 100, where 1 is very poor and 100 is excellent charm. Also, provide short, constructive, and encouraging feedback on how I can improve my side of the conversation. Be friendly and use a bit of modern slang.

        Return the response as a JSON object with "score" and "feedback" keys.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.INTEGER,
                            description: "A score from 1-100 representing the user's charm or 'rizz'."
                        },
                        feedback: {
                            type: Type.STRING,
                            description: "Short, constructive, and encouraging feedback for the user."
                        }
                    },
                    required: ["score", "feedback"]
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && typeof result.score === 'number' && typeof result.feedback === 'string') {
            return result;
        }

        throw new Error("Received an unexpected format from the AI.");

    } catch (error) {
        console.error("Error rating conversation:", error);
        throw new Error("The Rizz Meter is sleeping right now. Try again in a bit!");
    }
};