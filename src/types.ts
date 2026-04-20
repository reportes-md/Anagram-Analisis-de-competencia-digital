// FIX: Define types for the competitive analysis data.
export interface MediaScores {
  google: number;
  meta: number;
  tiktok: number;
  x: number;
  programmatic: number;
}

export interface SocialMediaPresence {
  platform: string;
  followers: string;
  engagement: string;
}

export interface GeographicCoverage {
  location: string;
  influence: string;
}

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  mediaScores: MediaScores;
  socialMediaPresence: SocialMediaPresence[];
  geographicCoverage: GeographicCoverage[];
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DigitalPresence {
  websiteSEO: string;
  socialMedia: string;
  contentStrategy: string;
}

export interface MarketComparison {
  entityName: string;
  pricingStrategy: string;
  estimatedAdSpend: string;
  spendScore: number;
}

export interface AnalysisData {
  brand: string;
  category: string;
  country: string;
  summary: string;
  swot: SwotAnalysis;
  digitalPresence: DigitalPresence;
  marketComparisons: MarketComparison[];
  competitors: Competitor[];
  recommendations: string[];
}

export interface AnalysisRecord {
  id: string;
  timestamp: number;
  data: AnalysisData;
}