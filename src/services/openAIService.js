import OpenAI from 'openai';
import { apiConfig } from '../utils/envConfig';
import { getApiKey } from '../utils/secureStorage';
import { getEnvironmentConfig } from '../utils/environmentConfig';

/**
 * OpenAI API Service
 * Handles interactions with the OpenAI API for image generation
 */
class OpenAIService {
  constructor() {
    this.client = null;
    this.initialized = false;
    this.config = getEnvironmentConfig();
  }

  /**
   * Initialize the OpenAI client
   * @param {string} apiKey - Optional API key to use instead of stored key
   * @returns {Promise<boolean>} - Whether initialization was successful
   */
  async initialize(apiKey = null) {
    try {
      // Use provided API key or get from secure storage
      const key = apiKey || await getApiKey() || apiConfig.apiKey;
      
      if (!key) {
        console.error('No API key available for OpenAI client');
        return false;
      }

      this.client = new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true, // Required for React Native
      });
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing OpenAI client:', error);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Ensure the client is initialized before making API calls
   * @returns {Promise<boolean>} - Whether the client is initialized
   */
  async ensureInitialized() {
    if (!this.initialized) {
      return await this.initialize();
    }
    return true;
  }

  /**
   * Generate an image using the OpenAI GPT-image-1 model
   * @param {string} prompt - The text prompt for image generation
   * @param {string} size - The size of the image to generate (default: "1024x1024")
   * @returns {Promise<string|null>} - Base64 encoded image or null on error
   */
  async generateImage(prompt, size = "1024x1024") {
    try {
      if (!await this.ensureInitialized()) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.client.images.generate({
        model: "gpt-image-1",
        prompt,
        size,
        response_format: "b64_json",
      });

      return response.data[0].b64_json;
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  }

  /**
   * Edit an existing image using the OpenAI GPT-image-1 model
   * @param {string} imageBase64 - Base64 encoded image to edit
   * @param {string} prompt - The text prompt for image editing
   * @param {string} size - The size of the image to generate (default: "1024x1024")
   * @returns {Promise<string|null>} - Base64 encoded edited image or null on error
   */
  async editImage(imageBase64, prompt, size = "1024x1024") {
    try {
      if (!await this.ensureInitialized()) {
        throw new Error('OpenAI client not initialized');
      }

      // Convert base64 to Blob for API
      const imageBlob = this._base64ToBlob(imageBase64, 'image/png');

      const response = await this.client.images.edit({
        model: "gpt-image-1",
        image: imageBlob,
        prompt,
        size,
        response_format: "b64_json",
      });

      return response.data[0].b64_json;
    } catch (error) {
      console.error('Error editing image:', error);
      return null;
    }
  }

  /**
   * Create a meme by adding text to an image
   * @param {string} imageBase64 - Base64 encoded image to use as meme background
   * @param {string} topText - Text to display at the top of the meme
   * @param {string} bottomText - Text to display at the bottom of the meme
   * @param {string} style - Meme text style (classic, modern, etc.)
   * @returns {Promise<string|null>} - Base64 encoded meme image or null on error
   */
  async createMeme(imageBase64, topText, bottomText, style = 'classic') {
    const stylePrompts = {
      classic: 'in classic meme font with black outline',
      modern: 'in a clean sans-serif font',
      handwritten: 'in a handwritten style',
      retro: 'in a retro pixel font style',
    };
    
    const styleText = stylePrompts[style] || stylePrompts.classic;
    
    let prompt = `Add meme text to this image`;
    
    if (topText) {
      prompt += ` with "${topText}" at the top`;
    }
    
    if (bottomText) {
      prompt += topText ? ` and "${bottomText}" at the bottom` : ` with "${bottomText}" at the bottom`;
    }
    
    prompt += ` ${styleText}`;
    
    return this.editImage(imageBase64, prompt);
  }

  /**
   * Convert base64 to Blob for API requests
   * @private
   * @param {string} base64 - Base64 encoded data
   * @param {string} type - MIME type
   * @returns {Blob} - Blob representation of the data
   */
  _base64ToBlob(base64, type) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type });
  }
}

// Export a singleton instance
export default new OpenAIService();
