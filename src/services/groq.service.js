const Groq = require('groq-sdk');
const config = require('../utils/env');
const logger = require('../utils/logger');

const apiKeys = config.GROQ_API_KEYS;
let currentKeyIndex = 0;

if (apiKeys.length === 0) {
  logger.warn('⚠️ No GROQ_API_KEYS are set in .env. AI features will fail.');
}

/**
 * Core wrapper to handle API Key rotation when quotas are exceeded
 * @param {Object} requestPayload - The Groq chat completions request payload
 * @returns {Promise<Object>} The API response
 */
async function callGroqWithRotation(requestPayload) {
  if (apiKeys.length === 0) {
    throw new Error('No Groq API keys available.');
  }

  let attempt = 0;
  
  while (attempt < apiKeys.length) {
    const currentKey = apiKeys[currentKeyIndex];
    const groq = new Groq({ apiKey: currentKey });

    try {
      logger.info(`[Groq] Calling API with key at index ${currentKeyIndex}...`);
      const response = await groq.chat.completions.create(requestPayload);
      logger.info(`[Groq] API call successful.`);
      return response;
    } catch (error) {
      // Check if the error is due to Rate Limit (429), Insufficient Quota (402/403), or Invalid Key (401)
      const status = error.status;
      const msg = error.error?.error?.message?.toLowerCase() || '';
      const isRotatableError = status === 429 || status === 402 || status === 403 || status === 401 || msg.includes('quota') || msg.includes('rate limit') || msg.includes('api key');

      if (isRotatableError) {
        logger.warn(`[Groq] Key at index ${currentKeyIndex} failed (Status: ${status}). Rotating to next key...`);
        // Move to the next key circularly
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        attempt++;
      } else {
        logger.error(`[Groq] Non-rotatable error (Status: ${status}): ${error.message}`);
        // If it's a completely different error (e.g. bad request, network issue), throw it
        throw error;
      }
    }

  }

  // If the loop finishes, all keys are exhausted
  throw new Error('All provided Groq API keys are exhausted, invalid, or rate-limited.');
}

/**
 * Generates a viral content idea using Groq API
 * @param {string} [category] - Optional specific category for the idea
 * @returns {Promise<string>} The generated idea
 */
async function generateViralIdea(category) {
  let prompt = '';
  
  if (category) {
    prompt = `Generate ONE highly engaging and viral content idea specifically for the category: "${category}".
Return ONLY the idea itself, formatted elegantly with markdown (e.g., use bold text and bullet points where appropriate). 
Do not include any intro, outro, or conversational text. Keep it concise, punchy, and highly valuable.`;
  } else {
    prompt = `Generate ONE random, highly engaging and viral content idea. 
Choose exactly one category from a wide range of digital platforms (SaaS, Social Media, Programming, etc.).
Return ONLY the idea itself, formatted elegantly with markdown. Do not include any intro, outro, or conversational text. Keep it concise, punchy, and highly valuable.`;
  }

  try {
    const response = await callGroqWithRotation({
      messages: [
        { role: 'system', content: 'You are a master content strategist and viral marketer.' },
        { role: 'user', content: prompt },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.8,
      max_tokens: 250, 
    });


    return response.choices[0]?.message?.content?.trim() || 'Oops, failed to generate an idea.';
  } catch (error) {
    logger.error('Groq API Error in generateViralIdea:', error.message);
    throw new Error(`Groq API Error: ${error.message}`);
  }
}


/**
 * Generates a general conversational response using Groq API
 * @param {string} prompt - The user's input message
 * @param {string|number} [userId] - Optional user ID for context tracking
 * @returns {Promise<string>} The generated response
 */
async function generateChatResponse(prompt, userId) {
  try {
    const response = await callGroqWithRotation({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful, smart, and concise AI assistant integrated into a Telegram bot. Keep your answers formatting clean and user-friendly using Markdown.',
        },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.1-8b-instant', // Newer, more stable model on Groq
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content?.trim() || 'Sorry, I could not think of a response right now.';
  } catch (error) {
    logger.error(`Groq API Error for user ${userId}:`, error.message);
    throw new Error('Could not generate chat response using Groq.');
  }
}

module.exports = {
  generateViralIdea,
  generateChatResponse,
};
