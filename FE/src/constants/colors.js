/**
 * Color constants used across Wrapped Slides
 */

// Color palette for keyword visualization
export const KEYWORD_COLORS = [
  '#1DB954', 
  '#8C52FF', 
  '#FF6B6B', 
  '#4ECDC4', 
  '#FDCB6E', 
  '#FF52A8', 
  '#667eea', 
  '#00b894'
];

// Color palette for fun stats bubbles
export const FUN_STATS_COLORS = [
  '#FF6B6B', 
  '#FDCB6E', 
  '#8C52FF', 
  '#4ECDC4', 
  '#1DB954'
];

// Mood timeline colors
export const MOOD_COLORS = {
  PEAK: '#ffffff',
  HIGH: '#80CBC4',
  MEDIUM: '#4DB6AC',
  LOW: 'rgba(255, 255, 255, 0.35)',
  BACKGROUND: '#00897B'
};

/**
 * Get bar color based on value ratio and peak status
 * @param {number} value - The value of the bar
 * @param {number} maxValue - The maximum value
 * @param {number} index - Index of the bar
 * @param {number} peakIndex - Index of the peak bar
 * @returns {string} Color hex code or rgba
 */
export const getBarColor = (value, maxValue, index, peakIndex) => {
  if (index === peakIndex) return MOOD_COLORS.PEAK;
  const ratio = value / maxValue;
  if (ratio > 0.7) return MOOD_COLORS.HIGH;
  if (ratio > 0.4) return MOOD_COLORS.MEDIUM;
  return MOOD_COLORS.LOW;
};
