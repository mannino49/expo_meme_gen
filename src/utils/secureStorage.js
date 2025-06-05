import * as SecureStore from 'expo-secure-store';

// Key constants
const KEYS = {
  API_KEY: 'openai_api_key',
};

/**
 * Save a value securely
 * @param {string} key - The key to store the value under
 * @param {string} value - The value to store
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveSecurely = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
    return true;
  } catch (error) {
    console.error('Error saving to secure storage:', error);
    return false;
  }
};

/**
 * Retrieve a value from secure storage
 * @param {string} key - The key to retrieve
 * @returns {Promise<string|null>} - The retrieved value or null if not found
 */
export const getSecurely = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Error retrieving from secure storage:', error);
    return null;
  }
};

/**
 * Delete a value from secure storage
 * @param {string} key - The key to delete
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const deleteSecurely = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
    return true;
  } catch (error) {
    console.error('Error deleting from secure storage:', error);
    return false;
  }
};

/**
 * Save the OpenAI API key securely
 * @param {string} apiKey - The API key to save
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const saveApiKey = (apiKey) => saveSecurely(KEYS.API_KEY, apiKey);

/**
 * Get the OpenAI API key from secure storage
 * @returns {Promise<string|null>} - The API key or null if not found
 */
export const getApiKey = () => getSecurely(KEYS.API_KEY);

/**
 * Delete the OpenAI API key from secure storage
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const deleteApiKey = () => deleteSecurely(KEYS.API_KEY);

export default {
  KEYS,
  saveSecurely,
  getSecurely,
  deleteSecurely,
  saveApiKey,
  getApiKey,
  deleteApiKey,
};
