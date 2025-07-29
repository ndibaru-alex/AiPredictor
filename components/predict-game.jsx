'use client'

import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { predictMatchOutcomes } from '@/actions/gamePredictor'
import { toast } from 'sonner'

// Accept a multiline or semicolon-separated list of matches
const formSchema = z.object({
  descriptions: z.string().min(1, 'Enter at least one match description.'),
})

export default function MatchPredictor() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(formSchema) })

  const [rawInput, setRawInput] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const watched = watch('descriptions')
  useEffect(() => {
    setRawInput(watched || '')
  }, [watched])

  const onSubmit = async () => {
    // Split by newline or semicolon
    const matches = rawInput
      .split(/(?:\r?\n|;)+/)
      .map((s) => s.trim())
      .filter(Boolean)

    if (matches.length === 0) {
      toast.error('Please enter at least one match.')
      return
    }
    if (matches.length > 10) {
      toast.error('You can predict at most 10 matches at a time.')
      return
    }

    setLoading(true)
    try {
      const res = await predictMatchOutcomes(matches)
      if (!res.success) {
        throw new Error(res.error || 'Unknown error')
      }
      setResults(res.data)
    } catch (err) {
      console.error('Prediction failed:', err)
      toast.error('Failed to get predictions: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-amber-100">
      <h2 className="text-xl font-semibold mb-4">Predict Match Outcomes</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <textarea
          {...register('descriptions')}
          placeholder="Enter matches, e.g. 'Arsenal vs Man City on 20 July 2025; Chelsea vs Liverpool on 21 July 2025', !!!one per line "
          className="border p-2 rounded shadow w-4xl"
          rows={4}
        />
        {errors.descriptions && (
          <p className="text-red-500 text-sm">{errors.descriptions.message}</p>
        )}

        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? 'Predicting...' : 'Predict Matches'}
        </Button>
      </form>

      {results && (
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium mb-2">Prediction Results</h3>
            <Button
              onClick={() => {
                setResults(null)
                reset()
              }}
              className="cursor-pointer"
            >
              Clear
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Confidence (%)</TableHead>
                <TableHead>Rationale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.predictions.map((entry, i) =>
                entry.match.predictions.map((p, j) => (
                  <TableRow key={`${i}-${j}`}>
                    <TableCell>{entry.match.teams}</TableCell>
                    <TableCell>{p.outcome}</TableCell>
                    <TableCell>{p.confidence}%</TableCell>
                    <TableCell>{p.rationale}</TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
