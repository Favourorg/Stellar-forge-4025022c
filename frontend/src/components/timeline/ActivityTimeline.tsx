import React from 'react'
import { TimelineItem, type Activity } from './TimelineItem'

interface ActivityTimelineProps {
  activities: Activity[]
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
        No activity yet.
      </p>
    )
  }

  return (
    <ol className="space-y-0" aria-label="Activity timeline">
      {activities.map((activity) => (
        <TimelineItem key={activity.id} activity={activity} />
      ))}
    </ol>
  )
}
