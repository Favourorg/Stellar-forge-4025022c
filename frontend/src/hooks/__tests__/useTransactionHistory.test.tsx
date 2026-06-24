import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useTransactionHistory } from '../useTransactionHistory'

const PUBLIC_KEY = 'GBQXR7K7KX7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X7'

function paymentOperation(id: string, pagingToken: string) {
  return {
    id,
    paging_token: pagingToken,
    type: 'payment',
    asset_code: 'FORGE',
    amount: '12.5',
    created_at: '2026-06-24T00:00:00Z',
    transaction_successful: true,
    transaction_hash: `hash-${id}`,
  }
}

function horizonResponse(records: ReturnType<typeof paymentOperation>[]) {
  return {
    ok: true,
    json: async () => ({
      _embedded: {
        records,
      },
    }),
  } as Response
}

describe('useTransactionHistory', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses the last operation paging token when loading more transactions', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock
      .mockResolvedValueOnce(
        horizonResponse([paymentOperation('1', 'cursor-1'), paymentOperation('2', 'cursor-2')]),
      )
      .mockResolvedValueOnce(horizonResponse([paymentOperation('3', 'cursor-3')]))

    const { result } = renderHook(() => useTransactionHistory(PUBLIC_KEY, { pageSize: 2 }))

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 450))
    })

    await waitFor(() => expect(result.current.transactions).toHaveLength(2))

    act(() => {
      result.current.loadMore()
    })

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    const secondRequestUrl = new URL(fetchMock.mock.calls[1]?.[0] as string)
    expect(secondRequestUrl.searchParams.get('cursor')).toBe('cursor-2')

    await waitFor(() => expect(result.current.transactions).toHaveLength(3))
  })
})
