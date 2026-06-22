import type { Meta, StoryObj } from '@storybook/react'
import { ProgressIndicator } from './ProgressIndicator'

const meta: Meta<typeof ProgressIndicator> = {
  title: 'UI/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProgressIndicator>

export const Pending: Story = {
  args: {
    steps: [
      { label: 'Prepare transaction', status: 'pending' },
      { label: 'Sign with wallet', status: 'pending' },
      { label: 'Submit to network', status: 'pending' },
    ],
  },
}

export const InProgress: Story = {
  args: {
    steps: [
      { label: 'Prepare transaction', status: 'completed' },
      { label: 'Sign with wallet', status: 'in-progress' },
      { label: 'Submit to network', status: 'pending' },
    ],
  },
}

export const Completed: Story = {
  args: {
    steps: [
      { label: 'Prepare transaction', status: 'completed' },
      { label: 'Sign with wallet', status: 'completed' },
      { label: 'Submit to network', status: 'completed' },
    ],
  },
}

export const WithError: Story = {
  args: {
    steps: [
      { label: 'Prepare transaction', status: 'completed' },
      { label: 'Sign with wallet', status: 'completed' },
      { label: 'Submit to network', status: 'error' },
    ],
  },
}
