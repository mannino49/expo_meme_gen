import { OPENAI_API_KEY, API_URL, API_VERSION, APP_ENV } from '@env';

// Safely access environment variables with fallbacks
export const getEnvVariable = (key, fallback = '') => {
  const variables = {
    OPENAI_API_KEY,
    API_URL,
    API_VERSION,
    APP_ENV,
  };
  
  return variables[key] || fallback;
};

// Environment specific configurations
export const isProduction = () => getEnvVariable('APP_ENV') === 'production';
export const isDevelopment = () => getEnvVariable('APP_ENV') === 'development';

// API configuration
export const apiConfig = {
  baseUrl: getEnvVariable('API_URL', 'https://api.openai.com/v1'),
  version: getEnvVariable('API_VERSION', 'v1'),
  apiKey: getEnvVariable('OPENAI_API_KEY', ''),
};

// Validate required environment variables
export const validateEnv = () => {
  const requiredVars = ['OPENAI_API_KEY'];
  const missingVars = requiredVars.filter(key => !getEnvVariable(key));
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};
