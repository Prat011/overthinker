import { VercelAIToolSet } from "composio-core";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const toolset = new VercelAIToolSet();

console.log(process.env.COMPOSIO_API_KEY);
console.log(process.env.GOOGLE_API_KEY);
const tools = await toolset.getTools({ apps: ["exa"] });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const response = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: message,
      tools: tools,
      system: 'You are a search assistant for Indian Government Websites. You are given a query and you need to search the Indian Government Websites and return the most relevant information. Use the Exa tool and phrase your query in a way that it can be used to search the Indian Government Websites. Return the output in markdown and include links to the relevant pages.'
    });

    // Ensure response is properly formatted before sending
    if (!response || !response.text) {
      throw new Error('Invalid response from AI model');
    }

    return res.status(200).json({ response: response.text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
