import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ConfirmModal } from './ConfirmModal'

const details = [
  { label: 'Token name', value: 'Community Credit' },
  { label: 'Symbol', value: 'CREDIT' },
  { label: 'Initial supply', value: '1000000' },
]

const meta: Meta<typeof ConfirmModal> = {
  title: 'UI/ConfirmModal',
  component: ConfirmModal,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    title: 'Confirm token deployment',
    description: 'Review these details before submitting the transaction.',
    details,
    confirmLabel: 'Deploy token',
    onConfirm: fn(),
    onCancel: fn(),
  },
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof ConfirmModal>

export const Default: Story = {}

export const WithoutDescription: Story = {
  args: { description: undefined },
}

export const LongValues: Story = {
  args: {
    details: [
      { label: 'Contract ID', value: 'CB7QYNF7SOWQ3ZN3PZ2C5D3NOQY7HTYB5RILPZVIZQH4M4QDU2TKNODE' },
      { label: 'Network', value: 'Mainnet' },
    ],
  },
}

export const Closed: Story = {
  args: { isOpen: false },
}
