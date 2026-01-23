/**
 * Utility functions to help validate and sanitize inputs to prevent exceeding API limits
 */

const MAX_INPUT_LENGTH = 900000; // Set below the 997952 limit to provide a safety margin

/**
 * Truncates a string to ensure it doesn't exceed the maximum allowed length
 */
export function truncateInput(input: string, maxLength: number = MAX_INPUT_LENGTH): string {
  if (!input) return input;
  
  if (input.length > maxLength) {
    console.warn(`Input exceeds maximum length of ${maxLength} characters. Truncating.`);
    return input.substring(0, maxLength) + '... [TRUNCATED]';
  }
  
  return input;
}

/**
 * Safely serializes an object to JSON, limiting its size
 */
export function safeJsonStringify(obj: any, maxLength: number = MAX_INPUT_LENGTH): string {
  const jsonString = JSON.stringify(obj);
  return truncateInput(jsonString, maxLength);
}

/**
 * Limits the size of arrays to prevent large inputs
 */
export function limitArraySize<T>(arr: T[], maxSize: number = 100): T[] {
  if (!Array.isArray(arr)) return arr;
  
  if (arr.length > maxSize) {
    console.warn(`Array exceeds maximum size of ${maxSize}. Limiting to first ${maxSize} items.`);
    return arr.slice(0, maxSize);
  }
  
  return arr;
}

/**
 * Creates a safe prompt by limiting the size of individual components
 */
export function createSafePrompt(components: Record<string, any>, maxLength: number = MAX_INPUT_LENGTH): string {
  // Process each component to ensure it's within limits
  const processedComponents: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(components)) {
    if (typeof value === 'string') {
      processedComponents[key] = truncateInput(value, Math.floor(maxLength / Object.keys(components).length));
    } else if (Array.isArray(value)) {
      processedComponents[key] = limitArraySize(value, 50); // Reasonable default for arrays
    } else if (typeof value === 'object') {
      processedComponents[key] = safeJsonStringify(value, Math.floor(maxLength / Object.keys(components).length));
    } else {
      processedComponents[key] = value;
    }
  }
  
  // Join components into a single prompt string
  const promptParts = Object.entries(processedComponents).map(([key, value]) => {
    if (typeof value === 'string') {
      return `${key}: ${value}`;
    } else {
      return `${key}: ${JSON.stringify(value)}`;
    }
  });
  
  const fullPrompt = promptParts.join('\n\n');
  
  // Final check to ensure total prompt is within limits
  return truncateInput(fullPrompt, maxLength);
}