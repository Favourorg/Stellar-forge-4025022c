import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTransactionHistory } from './useTransactionHistory'

// vi.mock is hoisted, so mockConfig must use vi.hoisted() to be available inside the factory
const mockConfig = vi.hoisted(() => ({
  network: 'testnet' as 'testnet' | 'mainnet',
  testnet: { horizonUrl: 'https://horizon-testnet.stellar.org' },
  mainnet: { horizonUrl: 'https://horizon.stellar.org' },
}))

vi.mock('../config/stellar', () => ({ STELLAR_CONFIG: mockConfig }))

// ─── fixtures ────────────────────────────────────────────────────────────────

const PUB = 'GABC1234567890'

function paymentOp(overrides: Record<string, unknown> = {}) {
  return {
    id: 'op1',
    type: 'payment',
    asset_code: 'TKA',
    asset_issuer: 'GISSUER',
    amount: '100',
    created_at: '2024-01-01T00:00:00Z',
    transaction_successful: true,
    transaction_hash: 'txhash1',
    paging_token: 'cursor1',
    ...overrides,
  }
}

function page(records: unknown[]) {
  return { _embedded: { records } }
}

function mockOk(body: unknown) {
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(body),
  } as Response)
}

/** Fire the 400 ms debounce and await the resulting fetch chain. */
async function fireDebounce() {
  await act(async () => {
    vi.advanceTimersByTime(400)
    await Promise.resolve()
    await Promise.resolve()
  })
}

// ─── setup / teardown ────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('fetch', vi.fn())
  mockConfig.network = 'testnet'
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

// ─── tests ───────────────────────────────────────────────────────────────────

describe('useTransactionHistory — cursor-based pagination', () => {
  it('first-page request always uses an empty cursor', async () => {
    mockOk(page([paymentOp()]))
    renderHook(() => useTransactionHistory(PUB))
    await fireDebounce()
    const firstUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
    expect(firstUrl).toMatch(/cursor=$/)
  })

  it('passes paging_token of last page-1 record as cursor for page-2 request', async () => {
    const p1 = [
      paymentOp({ id: 'op1', paging_token: 'tok_first' }),
      paymentOp({ id: 'op2', paging_token: 'tok_last' }),
    ]
    mockOk(page(p1))
    mockOk(page([]))

    const { result } = renderHook(() =>
      useTransactionHistory(PUB, { pageSize: 2 }),
    )
    await fireDebounce()

    await act(async () => {
      result.current.loadMore()
      await Promise.resolve()
      await Promise.resolve()
    })

    const secondUrl = vi.mocked(global.fetch).mock.calls[1][0] as string
    expect(secondUrl).toContain('cursor=tok_last')
  })

  it('appends page-2 results to the existing list', async () => {
    const p1 = Array.from({ length: 2 }, (_, i) =>
      paymentOp({ id: `p1_${i}`, paging_token: `pt_p1_${i}` }),
    )
    const p2 = [paymentOp({ id: 'p2_0', paging_token: 'pt_p2_0' })]
    mockOk(page(p1))
    mockOk(page(p2))

    const { result } = renderHook(() =>
      useTransactionHistory(PUB, { pageSize: 2 }),
    )
    await fireDebounce()
    expect(result.current.transactions).toHaveLength(2)
    expect(result.current.hasMore).toBe(true)

    await act(async () => {
      result.current.loadMore()
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(result.current.transactions).toHaveLength(3)
  })

  it('resets cursor when publicKey changes so page-1 is always fresh', async () => {
    const p1 = [
      paymentOp({ id: 'op1', paging_token: 'OLD_CURSOR' }),
      paymentOp({ id: 'op2', paging_token: 'OLD_CURSOR_2' }),
    ]
    mockOk(page(p1))
    mockOk(page([paymentOp({ id: 'new_op', paging_token: 'NEW_CURSOR' })]))

    const { rerender } = renderHook(
      ({ k }: { k: string }) => useTransactionHistory(k, { pageSize: 2 }),
      { initialProps: { k: PUB } },
    )
    await fireDebounce() // fetches PUB, cursor becomes OLD_CURSOR_2

    rerender({ k: 'GNEWKEY' })
    await fireDebounce() // publicKey changed → cursor must reset → cursor= empty

    const secondFetchUrl = vi.mocked(global.fetch).mock.calls[1][0] as string
    expect(secondFetchUrl).toContain('GNEWKEY')
    expect(secondFetchUrl).toMatch(/cursor=$/)
  })

  it('ignores loadMore calls while a fetch is already loading', async () => {
    const p1 = Array.from({ length: 2 }, (_, i) =>
      paymentOp({ id: `op${i}`, paging_token: `c${i}` }),
    )
    mockOk(page(p1))
    const { result } = renderHook(() =>
      useTransactionHistory(PUB, { pageSize: 2 }),
    )
    act(() => { vi.advanceTimersByTime(400) })
    act(() => { result.current.loadMore() })
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
})
