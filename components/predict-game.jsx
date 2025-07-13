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
import { predictMatchOutcome } from '@/actions/gamePredictor'
import { toast } from 'sonner'

const formSchema = z.object({
  description: z.string().min(20, 'Please describe at least two matches.'),
})

export default function MatchPredictor() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(formSchema) })

  const [matchDescription, setMatchDescription] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const watchedDescription = watch('description')

  useEffect(() => {
    setMatchDescription(watchedDescription)
  }, [watchedDescription])

  const onSubmit = async () => {
    if (!matchDescription.trim()) return
    setLoading(true)
    try {
      const result = await predictMatchOutcome(matchDescription)
      setData(result)
    } catch (error) {
      console.error('Prediction failed:', error)
      toast.error(
        'Failed to get predictions. Please try again.' + error.message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-amber-100">
      <h2 className="text-xl font-semibold mb-4">Predict Match Outcome</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <textarea
          {...register('description')}
          placeholder="e.g. Arsenal vs Man City on 20 July 2025; Chelsea vs Liverpool on 21 July 2025"
          className="w-full border p-2 rounded shadow"
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Match Outcome'}
        </Button>
      </form>

      {data?.success && (
        <div className="mt-8">
          <div className="flex justify-between text-center">
            <h3 className="text-lg font-medium mb-2">Prediction Results</h3>
            <Button
              onClick={() => {
                setData(null)
                reset()
              }}
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
              {data.data.match.predictions.map((p, i) => (
                <TableRow key={i}>
                  <TableCell>{data.data.match.teams}</TableCell>
                  <TableCell>{p.outcome}</TableCell>
                  <TableCell>{p.confidence}%</TableCell>
                  <TableCell>{p.rationale}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
