import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function Documentation() {
  const prompt = `
You are a sports‑analytics engine. Using historical head‑to‑head and season results,
current team rosters and formations, sentiment analysis of recent social‑media posts by players and coaches,
and any well‑known open‑source prediction algorithms (e.g. ELO, Poisson regression), predict the outcome for the following fixtures:

"matchesList"

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

Only return the JSON object. Do not include any explanations or formatting.
`

  return (
    <Card className="mt-6">
      <CardContent>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className="mx-5">
            <h1 className="text-2xl font-semibold">Prompt used</h1>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {prompt}
            </p>
          </div>
          <div>
            <h3 className="mt-6 mb-2 text-lg font-semibold">
              Requirements &amp; Packages
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <code>@clerk/nextjs</code> for authentication
              </li>
              <li>
                <code>@google/genai</code> to instantiate the GenAI instance
              </li>
              <li>
                <code>npx shadcn@latest init</code> to set up shadcn/ui
                components
              </li>
            </ul>
            <h1 className="text-2xl font-semibold py-5">UI frontend</h1>
            <div className="mt-6 flex flex-col gap-4">
              <Image
                src="/front1.png"
                alt="UI Example 1"
                width={500}
                height={500}
                className="rounded-lg shadow"
              />
              <Image
                src="/front2.png"
                alt="UI Example 2"
                width={500}
                height={500}
                className="rounded-lg shadow"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
