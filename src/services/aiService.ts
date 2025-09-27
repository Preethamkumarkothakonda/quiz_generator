import axios from 'axios';
import { Question, AIQuizResponse } from '../types';

// Debug environment variables
console.log('=== GEMINI API DEBUG ===');
console.log('REACT_APP_GEMINI_API_KEY exists:', !!process.env.REACT_APP_GEMINI_API_KEY);
console.log('API Key length:', process.env.REACT_APP_GEMINI_API_KEY?.length);
console.log('===============================');

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

class AIService {
  private cache = new Map<string, Question[]>(); 
  private timeoutDuration = 20000;

  private getCacheKey(topic: string): string {
    return `quiz_${topic.toLowerCase().replace(/\s+/g, '_')}`;
  }

  private isValidQuizResponse(data: any): data is AIQuizResponse {
    return (
      data &&
      Array.isArray(data.questions) &&
      data.questions.length === 5 &&
      data.questions.every((q: any) => 
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctIndex === 'number' &&
        q.correctIndex >= 0 &&
        q.correctIndex <= 3
      )
    );
  }

  async generateQuizQuestions(topic: string): Promise<Question[]> {
    // Check cache first
    const cacheKey = this.getCacheKey(topic);
    if (this.cache.has(cacheKey)) {
      console.log('📋 Using cached AI questions for:', topic);
      return this.cache.get(cacheKey)!;
    }

    // Validate configuration
    if (!GEMINI_API_KEY) {
      throw new Error('❌ Missing API configuration. Please check your .env file.');
    }

    console.log(`🤖 Generating AI questions for: ${topic}`);
    
    try {
      const questions = await this.makeGeminiAPICall(topic);
      this.cache.set(cacheKey, questions);
      console.log('✅ Successfully generated AI questions for:', topic);
      return questions;
      
    } catch (error: any) {
      console.error('❌ Gemini AI generation failed:', error);
      throw new Error(`Failed to generate AI questions for "${topic}": ${error.message}`);
    }
  }

  private async makeGeminiAPICall(topic: string): Promise<Question[]> {
    // Use the CORRECT model names from your available models list
    const endpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${GEMINI_API_KEY}`
    ];
    
    const prompt = `You are an expert quiz generator. Create exactly 5 multiple-choice questions about "${topic}".

STRICT REQUIREMENTS:
- Generate educational, accurate questions about ${topic}
- Each question must have exactly 4 unique options
- Only one option should be correct
- Make questions challenging but fair
- Vary the correct answer positions across questions
- Return ONLY valid JSON, no markdown, no extra text

EXACT JSON FORMAT REQUIRED:
{
  "questions": [
    {
      "question": "Your question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    },
    {
      "question": "Another question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1
    },
    {
      "question": "Third question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2
    },
    {
      "question": "Fourth question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 3
    },
    {
      "question": "Fifth question about ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1
    }
  ]
}

Generate questions about: ${topic}`;

    const requestData = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    };

    // Try each endpoint until one works
    for (let i = 0; i < endpoints.length; i++) {
      const endpoint = endpoints[i];
      console.log(`📡 Trying endpoint ${i + 1}/${endpoints.length}:`, endpoint.replace(GEMINI_API_KEY || '', 'API_KEY_HIDDEN'));
      
      try {
        const response = await axios.post(endpoint, requestData, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeoutDuration
        });

        console.log('✅ API Response Status:', response.status);
        console.log('📋 API Response Data:', JSON.stringify(response.data, null, 2));

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('Invalid response structure from Gemini AI');
        }

        let responseText = response.data.candidates[0].content.parts[0].text;
        console.log('📄 Raw AI Response:', responseText);
        
        // Clean the response
        responseText = responseText
          // .replace(/```
          .replace(/```\n?/g, '')
          .replace(/`/g, '')
          .trim();
        
        console.log('🧹 Cleaned Response:', responseText);
        
        // Extract JSON
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}') + 1;
        
        if (jsonStart === -1 || jsonEnd === 0) {
          throw new Error('No valid JSON found in AI response');
        }
        
        const jsonString = responseText.substring(jsonStart, jsonEnd);
        console.log('🔍 Extracted JSON:', jsonString);
        
        const parsedResponse = JSON.parse(jsonString);
        
        if (!this.isValidQuizResponse(parsedResponse)) {
          console.error('❌ Invalid quiz format:', parsedResponse);
          throw new Error('AI returned invalid quiz format');
        }

        const questions = parsedResponse.questions.map((q: any, index: number) => ({
          id: `${index + 1}`,
          question: q.question.trim(),
          options: q.options.map((opt: string) => opt.trim()),
          correctIndex: q.correctIndex
        }));

        console.log('✨ AI quiz generation completed successfully!');
        console.log('📝 Generated questions:', questions);
        return questions;
        
      } catch (error: any) {
        console.warn(`⚠️ Endpoint ${i + 1} failed:`, error.message);
        
        if (error.response) {
          console.error('API Error Status:', error.response.status);
          console.error('API Error Data:', error.response.data);
        }
        
        // If this is the last endpoint, throw the error
        if (i === endpoints.length - 1) {
          if (error.response?.status === 404) {
            throw new Error('Gemini model not found. Please check the model name.');
          } else if (error.response?.status === 403) {
            throw new Error('API access denied. Please verify your API key permissions.');
          } else {
            throw new Error(`All API endpoints failed. Last error: ${error.message}`);
          }
        }
      }
    }

    throw new Error('Failed to connect to any Gemini API endpoint');
  }

  async generateFeedback(score: number, total: number, topic: string): Promise<string> {
    const percentage = Math.round((score / total) * 100);
    
    if (percentage >= 80) {
      return `🎉 Excellent! You scored ${score}/${total} (${percentage}%) on ${topic}. Outstanding knowledge!`;
    } else if (percentage >= 60) {
      return `👍 Good job! You scored ${score}/${total} (${percentage}%) on ${topic}. Keep it up!`;
    } else if (percentage >= 40) {
      return `📚 Keep learning! You scored ${score}/${total} (${percentage}%) on ${topic}. Practice more!`;
    } else {
      return `💪 Don't give up! You scored ${score}/${total} (${percentage}%) on ${topic}. Try again!`;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Debug method to test API connectivity
  async testAPIConnection(): Promise<void> {
    try {
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
      );
      console.log('✅ API Connection Test Success');
      console.log('📋 Available models:', response.data.models?.map((m: any) => m.name));
    } catch (error: any) {
      console.error('❌ API Connection Test Failed:', error);
    }
  }
}

export const aiService = new AIService();

// Test API connection on load (only in development)
if (process.env.NODE_ENV === 'development') {
  aiService.testAPIConnection();
}