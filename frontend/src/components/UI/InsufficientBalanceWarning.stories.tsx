import type { Meta, StoryObj } from '@storybook/react'
import { InsufficientBalanceWarning } from './InsufficientBalanceWarning'
import { ToastContext } from '../../context/ToastContext'
import { WalletContext } from '../../context/WalletContext'

const walletContext = {
  wallet: {
    address: 'GCBGQ4DMKDGW6ZAX2Z7V4XQJDKFS7KJ7T6QX6K4AHZ4V2QZQXLMTEST',
    isConnected: true,
    balance: '0.2',
  },
  isConnecting: false,
  error: null,
  isInstalled: true,
  connect: async () => {},
  disconnect: () => {},
  refreshBalance: async () => {},
}

const toastContext = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
}

const meta: Meta<typeof InsufficientBalanceWarning> = {
  title: 'UI/InsufficientBalanceWarning',
  component: InsufficientBalanceWarning,
  tags: ['autodocs'],
  args: {
    shortfall: '1.25',
    isTestnet: true,
  },
  decorators: [
    (Story) => (
      <WalletContext.Provider value={walletContext}>
        <ToastContext.Provider value={toastContext}>
          <Story />
        </ToastContext.Provider>
      </WalletContext.Provider>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof InsufficientBalanceWarning>

export const Testnet: Story = {}

export const Mainnet: Story = {
  args: {
    shortfall: '3.50',
    isTestnet: false,
  },
}
