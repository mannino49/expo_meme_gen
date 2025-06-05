import { Platform } from 'react-native';
import { apiConfig, isProduction } from './envConfig';

/**
 * Configuration for different environments
 */
const environmentConfig = {
  development: {
    apiBaseUrl: apiConfig.baseUrl,
    apiVersion: apiConfig.version,
    imageQuality: 0.8, // Lower quality for faster development
    maxImageSize: 1024, // Maximum image size in pixels
    debugMode: true,
    logLevel: 'debug',
  },
  production: {
    apiBaseUrl: apiConfig.baseUrl,
    apiVersion: apiConfig.version,
    imageQuality: 1.0, // Higher quality for production
    maxImageSize: 2048, // Maximum image size in pixels
    debugMode: false,
    logLevel: 'error',
  },
};

/**
 * Get the current environment configuration
 * @returns {Object} The environment configuration
 */
export const getEnvironmentConfig = () => {
  const environment = isProduction() ? 'production' : 'development';
  return {
    ...environmentConfig[environment],
    platform: Platform.OS,
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
  };
};

export default getEnvironmentConfig;
