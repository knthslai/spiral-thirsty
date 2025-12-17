/**
 * Shared utilities for localStorage operations
 * Provides consistent error handling and SSR safety
 */

/**
 * Check if code is running in browser (client-side)
 * @returns True if running in browser, false if SSR
 */
export function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Safely get an item from localStorage
 * @param key - Storage key
 * @returns Parsed value or null if not found or error
 */
export function getStorageItem<T>(key: string): T | null {
  if (!isClient()) {
    return null;
  }

  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
}

/**
 * Safely set an item in localStorage
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 */
export function setStorageItem<T>(key: string, value: T): void {
  if (!isClient()) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/**
 * Safely remove an item from localStorage
 * @param key - Storage key
 */
export function removeStorageItem(key: string): void {
  if (!isClient()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}
