import React from 'react'
import { TimelineIcon, type ActivityType } from './TimelineIcon'
import { formatTimestamp } from '../../utils/formatting'

export interface Activity {
  id: string
  type: ActivityType
  description: string
  timestamp: number // unix seconds
}

interface TimelineItemProps {
  activity: Activity
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ activity }) => (
  <li className="flex gap-4">
    <div className="flex flex-col items-center">
      <TimelineIcon type={activity.type} />
      <div className="flex-1 w-px bg-gray-200 dark:bg-gray-700 mt-2" aria-hidden="true" />
    </div>
    <div className="pb-6 min-w-0">
      <p className="text-sm text-gray-900 dark:text-white">{activity.description}</p>
      <time
        dateTime={new Date(activity.timestamp * 1000).toISOString()}
        className="text-xs text-gray-500 dark:text-gray-400"
      >
        {formatTimestamp(activity.timestamp)}
      </time>
    </div>
  </li>
)
