'use server'

import { GoogleGenAI } from '@google/genai'

export async function predictMatchOutcomes(matchDescriptions = []) {
  if (!Array.isArray(matchDescriptions)) {
    throw new Error('Input must be an array of match description strings.')
  }
  if (matchDescriptions.length === 0 || matchDescriptions.length > 10) {
    throw new Error('Provide between 1 and 10 match descriptions.')
  }
  if (!process.env.PREDICTOR_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not set in environment variables.')
  }

  const ai = new GoogleGenAI({ apiKey: process.env.PREDICTOR_GEMINI_API_KEY })

  // Build a list of matches in the prompt
  const matchesList = matchDescriptions
    .map((desc, i) => `\u2022 Match ${i + 1}: ${desc}`)
    .join('\n')

  const prompt = `
You are a sports‑analytics engine. Using historical head‑to‑head and season results,
current team rosters and formations, sentiment analysis of recent social‑media posts by players and coaches,
and any well‑known open‑source prediction algorithms (e.g. ELO, Poisson regression), predict the outcome for the following fixtures:

${matchesList}

For each match, provide:
1. At least two distinct possible results (e.g. “Home win”, “Draw”, “Away win” or explicit scorelines).
2. A confidence level percentage for each outcome that sums (approximately) to 100%.
3. A brief rationale (1–2 sentences) explaining the key factors influencing each prediction, citing data sources.

Return your answer as a JSON object with this structure:
{
  "predictions": [
    {
      "match": {
        "teams": "[Home Team] vs [Away Team]",
        "predictions": [
          { "outcome": "Home win 2-1", "confidence": 62, "rationale": "..." },
          { "outcome": "Draw 1-1", "confidence": 38, "rationale": "..." }
        ]
      }
    }
    // ...one entry per input match
  ]
}

Only return the JSON object. Do not include any explanations or formatting.`

  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    const text = await result.text
    const cleaned = text.replace(/```(?:json)?\n?|```/g, '').trim()

    try {
      const parsed = JSON.parse(cleaned)
      if (!parsed.predictions || !Array.isArray(parsed.predictions)) {
        throw new Error('Missing predictions array in response')
      }
      return { success: true, data: parsed }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.log('Raw response:', text)
      return { success: false, error: 'Failed to parse AI response' }
    }
  } catch (error) {
    throw new Error('Gemini API Error: ' + error.message)
  }
}
