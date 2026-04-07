import { useState, useEffect } from 'react'
import type { Activity } from '../components/timeline/TimelineItem'

interface UseActivityTimelineResult {
  activities: Activity[]
  isLoading: boolean
  error: string | null
}

export function useActivityTimeline(groupId: string): UseActivityTimelineResult {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!groupId) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetch(`/api/groups/${groupId}/activities`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch activities')
        return res.json() as Promise<Activity[]>
      })
      .then((data) => {
        if (!cancelled) setActivities(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [groupId])

  return { activities, isLoading, error }
}
