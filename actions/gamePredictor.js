'use server'

import { GoogleGenAI } from '@google/genai'

export async function predictMatchOutcome(matchDescription) {
  try {
    if (!process.env.PREDICTOR_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not set in environment variables.')
    }

    const ai = new GoogleGenAI({ apiKey: process.env.PREDICTOR_GEMINI_API_KEY })

    const prompt = `
      You are a sports‑analytics engine. Using historical head‑to‑head and season results,
      current team rosters and formations, sentiment analysis of recent social‑media posts by players and coaches,
      and any well‑known open‑source prediction algorithms (e.g. ELO, Poisson regression), predict the outcome of this fixture:

      • Match: ${matchDescription}

      For this match, provide:
      1. At least two distinct possible results (e.g. “Home win”, “Draw”, “Away win” or explicit scorelines).
      2. A confidence level percentage for each outcome that sums (approximately) to 100%.
      3. A brief rationale (1–2 sentences) explaining the key factors influencing each prediction, citing data sources.

      Return your answer as a JSON object with this structure:

      {
        "match": {
          "teams": "[Home Team] vs [Away Team]",
          "predictions": [
            {
              "outcome": "Home win 2-1",
              "confidence": 62,
              "rationale": "..."
            },
            {
              "outcome": "Draw 1-1",
              "confidence": 38,
              "rationale": "..."
            }
          ]
        }
      }

      Only return the JSON object. Do not include any explanations or formatting.`

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    const text = await result.text
    const cleanedText = text.replace(/```(?:json)?\n?|```/g, '').trim()

    try {
      const prediction = JSON.parse(cleanedText)
      if (!prediction.match || !Array.isArray(prediction.match.predictions)) {
        throw new Error('Missing match or predictions in response')
      }
      return {
        success: true,
        data: prediction,
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.log('Raw response:', text)
      return {
        success: false,
        error: 'Failed to parse AI response',
      }
    }
  } catch (error) {
    throw new Error('Gemini API Error: ' + error.message)
  }
}
