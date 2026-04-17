// FIX: Implement Gemini service to fetch competitive analysis data.
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisData } from '../types';

const ai = new GoogleGenAI({ apiKey: Import.meta.env.VITE_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    brand: { type: Type.STRING },
    category: { type: Type.STRING },
    country: { type: Type.STRING },
    summary: { type: Type.STRING, description: 'Un resumen ejecutivo del análisis competitivo.' },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
    },
    digitalPresence: {
      type: Type.OBJECT,
      properties: {
        websiteSEO: { type: Type.STRING, description: "Análisis del sitio web y SEO de la marca." },
        socialMedia: { type: Type.STRING, description: "Análisis de la presencia en redes sociales." },
        contentStrategy: { type: Type.STRING, description: "Análisis de la estrategia de contenido." },
      },
      required: ['websiteSEO', 'socialMedia', 'contentStrategy'],
    },
    competitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          mediaScores: {
            type: Type.OBJECT,
            description: "Puntuaciones de presencia en medios para cada plataforma.",
            properties: {
              google: { type: Type.NUMBER, description: "Score del 1 al 10 para Google Ads y presencia SEO." },
              meta: { type: Type.NUMBER, description: "Score del 1 al 10 para presencia en Meta (Facebook, Instagram)." },
              tiktok: { type: Type.NUMBER, description: "Score del 1 al 10 para presencia en TikTok." },
              x: { type: Type.NUMBER, description: "Score del 1 al 10 para presencia en X (Twitter)." },
              programmatic: { type: Type.NUMBER, description: "Score del 1 al 10 para inversión en programática y display." },
            },
            required: ['google', 'meta', 'tiktok', 'x', 'programmatic'],
          },
          socialMediaPresence: {
            type: Type.ARRAY,
            description: "Presencia en 1-2 redes sociales principales para cada competidor.",
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING, description: "Nombre de la plataforma (ej. Instagram, TikTok)." },
                followers: { type: Type.STRING, description: "Número de seguidores (ej. '1.5M', '250k')." },
                engagement: { type: Type.STRING, description: "Nivel de engagement o métrica (ej. 'Alto', '2.5%')." },
              },
              required: ['platform', 'followers', 'engagement'],
            },
          },
          geographicCoverage: {
            type: Type.ARRAY,
            description: "Cobertura geográfica clave para cada competidor.",
            items: {
              type: Type.OBJECT,
              properties: {
                location: { type: Type.STRING, description: "Ciudad o región clave." },
                influence: { type: Type.STRING, description: "Descripción cualitativa de su influencia en dicha ubicación." },
              },
              required: ['location', 'influence'],
            },
          },
        },
        required: ['name', 'strengths', 'weaknesses', 'mediaScores', 'socialMediaPresence', 'geographicCoverage'],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Recomendaciones estratégicas accionables para la marca.',
    },
    marketComparisons: {
      type: Type.ARRAY,
      description: "Comparativa de estrategias de precios y estimación de inversión publicitaria entre la marca principal y sus competidores.",
      items: {
        type: Type.OBJECT,
        properties: {
          entityName: { type: Type.STRING, description: "Nombre de la marca principal o del competidor." },
          pricingStrategy: { type: Type.STRING, description: "Estrategia de precios (ej. Premium, Low-cost, Mid-range)." },
          estimatedAdSpend: { type: Type.STRING, description: "Estimación cualitativa o cuantitativa de inversión publicitaria (ej. Alta, Media, $50k/mes)." },
          spendScore: { type: Type.NUMBER, description: "Puntuación del 1 al 10 que representa el nivel de inversión publicitaria para poder graficarlo." }
        },
        required: ['entityName', 'pricingStrategy', 'estimatedAdSpend', 'spendScore']
      }
    },
  },
  required: ['brand', 'category', 'country', 'summary', 'swot', 'digitalPresence', 'competitors', 'recommendations', 'marketComparisons'],
};

export const getCompetitiveAnalysis = async (
  brand: string,
  category: string,
  country: string,
  competitors?: string
): Promise<AnalysisData> => {
  const competitorsPrompt = competitors 
    ? `Considera específicamente a los siguientes competidores: ${competitors}.` 
    : `Identifica independientemente de 2 a 3 competidores principales.`;

  const prompt = `
    Realiza un análisis competitivo digital exhaustivo para la marca "${brand}" en la categoría de "${category}" enfocándote en el mercado de "${country}".
    
    ${competitorsPrompt}
    
    Para la marca principal (${brand}) y cada competidor (sea provisto o identificado), analiza brevemente sus fortalezas (strengths) y debilidades (weaknesses).
    
    Realiza un análisis FODA completo (Fortalezas, Oportunidades, Debilidades, Amenazas) para la marca "${brand}".
    
    Evalúa la presencia digital de "${brand}" en términos de SEO del sitio web, redes sociales y estrategia de contenido.
    
    Para cada competidor, otorga una puntuación del 1 al 10 para su presencia en las siguientes plataformas de medios: Google (SEO y Ads), Meta (Facebook, Instagram), TikTok, X (anteriormente Twitter) y Compra Programática (Display, Video).
    
    Además, para cada competidor detalla su presencia en 1 o 2 redes sociales principales, incluyendo la plataforma, número aproximado de seguidores (ej. 1.5M, 250k), y una estimación de su nivel de engagement (ej. Alto, Medio, Bajo, o un porcentaje como '2.1%').
    
    Para cada competidor, identifica 1-2 ciudades o regiones clave en "${country}" donde tienen la mayor influencia y describe brevemente su nivel de cobertura o popularidad en esas áreas (ej. "Alta presencia en la Ciudad de México", "Fuerte en el norte del país").
    
    Añade un análisis de las estrategias de fijación de precios y estimaciones de gasto publicitario de la marca principal y cada competidor en 'marketComparisons'. Incluye descripciones y un 'spendScore' (de 1 a 10) para dimensionar comparativamente la inversión en pauta de cada entidad.

    Finalmente, provee una lista de recomendaciones estratégicas claras y accionables para que "${brand}" mejore su posición en el mercado.

    IMPORTANTE: TODA LA SALIDA, TEXTOS, DESCRIPCIONES Y RESULTADOS DEBEN ESTAR EXCLUSIVAMENTE EN ESPAÑOL. Los datos deben parecer reales y pueden ser simulados o inferidos con conocimiento general para propósitos de demostración. La estructura de tu respuesta DEBE coincidir con el esquema JSON provisto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("API response was empty.");
    }
    const data: AnalysisData = JSON.parse(jsonText);
    return data;
  } catch (error) {
    console.error('Error fetching competitive analysis:', error);
    throw new Error('No se pudo generar el análisis. Por favor intenta de nuevo.');
  }
};
