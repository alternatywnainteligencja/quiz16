// src/calculations/weightsManager.ts

import { fetchWeightsWithCache, type WeightsData } from '../services/googleSheetsService';

let weightsDataCache: WeightsData | null = null;

export async function getWeightsData(): Promise<WeightsData> {
  if (!weightsDataCache) {
    try {
      weightsDataCache = await fetchWeightsWithCache();
      console.log('✅ Loaded weights from API:', weightsDataCache.weights?.length || 0);
    } catch (error) {
      console.error('❌ Failed to load weights:', error);
      weightsDataCache = { weights: [], lastUpdated: new Date().toISOString() };
    }
  }
  return weightsDataCache;
}

export function clearWeightsCache(): void {
  weightsDataCache = null;
}
