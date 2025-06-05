# OpenAI GPT-image-1 API Integration Guide

This guide provides specific instructions for integrating the OpenAI GPT-image-1 API into the MemeMaker application for meme generation.

## API Overview

The GPT-image-1 model is a multimodal model that can generate and edit images based on text prompts. It's particularly well-suited for meme generation due to its:

- Ability to render text directly on images
- Understanding of meme formats and styles
- High-quality image generation capabilities
- Support for editing existing images

## Authentication

```javascript
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
```

## Basic Image Generation

### Generate a Meme from Text Prompt

```javascript
async function generateMemeImage(prompt) {
  try {
    const response = await openai.createImage({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024",
      response_format: "b64_json"
    });
    
    return response.data.data[0].b64_json;
  } catch (error) {
    console.error('Error generating meme image:', error);
    throw error;
  }
}

// Example usage:
const memePrompt = "Generate a meme with a surprised cat wearing sunglasses with the text 'WHEN THE WIFI FINALLY CONNECTS' at the top and 'AFTER 10 ATTEMPTS' at the bottom in classic meme font";
const imageBase64 = await generateMemeImage(memePrompt);
```

## Editing Existing Images

### Add Meme Text to an Existing Image

```javascript
async function addMemeTextToImage(imageBase64, topText, bottomText) {
  try {
    // Convert base64 to blob for API
    const imageBlob = base64ToBlob(imageBase64, 'image/jpeg');
    
    const prompt = `Add meme text to this image with "${topText}" at the top and "${bottomText}" at the bottom in classic white meme font with black outline`;
    
    const response = await openai.createImageEdit({
      model: "gpt-image-1",
      image: imageBlob,
      prompt: prompt,
      size: "1024x1024",
      response_format: "b64_json"
    });
    
    return response.data.data[0].b64_json;
  } catch (error) {
    console.error('Error adding meme text:', error);
    throw error;
  }
}
```

## Prompt Engineering for Memes

For best results with meme generation, structure your prompts with these components:

1. **Meme style specification**: Classic meme, modern meme, specific template name
2. **Image description**: What should appear in the image
3. **Text placement**: Top text, bottom text, or custom positioning
4. **Font style**: Classic meme font, minimalist, etc.

### Example Prompt Templates

```javascript
const memePromptTemplates = {
  classic: (imageDesc, topText, bottomText) => 
    `Generate a classic meme with ${imageDesc} as the background image. Add the text "${topText}" at the top and "${bottomText}" at the bottom in the classic Impact font with black outline.`,
  
  modern: (imageDesc, caption) => 
    `Create a modern social media meme showing ${imageDesc} with the caption "${caption}" in a clean sans-serif font at the bottom of the image.`,
  
  twitter: (imageDesc, caption) => 
    `Generate a Twitter/X style meme with ${imageDesc} and the caption "${caption}" in a modern font below the image, as if it were a tweet.`,
  
  tiktok: (imageDesc, caption) => 
    `Create a TikTok-style meme with ${imageDesc} and overlay the text "${caption}" in the center with the TikTok-style bold font.`
};
```

## Error Handling

Implement robust error handling for API calls:

```javascript
async function safeImageGeneration(prompt, retries = 3) {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      const response = await openai.createImage({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024",
        response_format: "b64_json"
      });
      
      return response.data.data[0].b64_json;
    } catch (error) {
      attempt++;
      
      // Check for specific error types
      if (error.response && error.response.status === 429) {
        // Rate limit error - wait longer before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      } else if (attempt >= retries) {
        throw error; // Give up after max retries
      } else {
        // Other errors - wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}
```

## Optimization Strategies

### Caching

Implement caching for generated images to reduce API calls:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getCachedOrGenerateImage(prompt) {
  const cacheKey = `meme_cache_${hashString(prompt)}`;
  
  try {
    // Check cache first
    const cachedImage = await AsyncStorage.getItem(cacheKey);
    if (cachedImage) {
      return cachedImage;
    }
    
    // Generate new image
    const newImage = await generateMemeImage(prompt);
    
    // Cache the result
    await AsyncStorage.setItem(cacheKey, newImage);
    
    return newImage;
  } catch (error) {
    console.error('Cache or generate error:', error);
    // Fall back to direct generation on cache error
    return generateMemeImage(prompt);
  }
}

// Simple string hashing function
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}
```

### Rate Limiting

Implement client-side rate limiting to manage API usage:

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests; // e.g., 10 requests
    this.timeWindow = timeWindow;   // e.g., 60000 ms (1 minute)
    this.timestamps = [];
  }

  async throttle() {
    const now = Date.now();
    
    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter(time => now - time < this.timeWindow);
    
    if (this.timestamps.length >= this.maxRequests) {
      // Need to wait
      const oldestTimestamp = this.timestamps[0];
      const waitTime = this.timeWindow - (now - oldestTimestamp);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle(); // Check again after waiting
    }
    
    // Add current timestamp and proceed
    this.timestamps.push(now);
    return true;
  }
}

// Usage
const apiLimiter = new RateLimiter(10, 60000); // 10 requests per minute

async function rateLimitedMemeGeneration(prompt) {
  await apiLimiter.throttle();
  return generateMemeImage(prompt);
}
```

## Best Practices

1. **Prompt Clarity**: Be specific about meme style, text placement, and font choice
2. **Image Size**: Use appropriate sizes for different platforms (1:1 for Instagram, 16:9 for TikTok)
3. **Error Handling**: Implement robust error handling with user-friendly fallbacks
4. **Caching**: Cache generated images to reduce API calls and improve performance
5. **Rate Limiting**: Implement client-side rate limiting to manage API usage
6. **User Guidance**: Provide templates and examples to help users create effective prompts
7. **Content Moderation**: Implement content filtering to prevent inappropriate content

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs/guides/image-generation)
- [GPT-image-1 Model Information](https://platform.openai.com/docs/models/gpt-image-1)
- [OpenAI Cookbook Examples](https://cookbook.openai.com/examples/generate_images_with_gpt_image)
