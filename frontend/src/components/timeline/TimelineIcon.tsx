import React from 'react'

export type ActivityType = 'join' | 'contribution' | 'payout'

interface TimelineIconProps {
  type: ActivityType
}

const ICONS: Record<ActivityType, React.ReactNode> = {
  join: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  contribution: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  payout: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
}

const COLOR: Record<ActivityType, string> = {
  join: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
  contribution: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  payout: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
}

export const TimelineIcon: React.FC<TimelineIconProps> = ({ type }) => (
  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${COLOR[type]}`}>
    {ICONS[type]}
  </span>
)
