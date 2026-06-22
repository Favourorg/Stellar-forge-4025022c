import { describe, expect, it } from 'vitest'
import { CONTRACT_ERROR_MESSAGES, parseContractError } from '../utils/contractErrors'

describe('parseContractError', () => {
  it('maps contract error codes 1 through 7 to user-friendly messages', () => {
    for (const code of [1, 2, 3, 4, 5, 6, 7]) {
      expect(parseContractError(new Error(`HostError: Error(Contract, ${code})`)).message).toBe(
        CONTRACT_ERROR_MESSAGES[code],
      )
    }
  })

  it('uses a generic fallback for unknown contract error codes', () => {
    expect(parseContractError(new Error('HostError: Error(Contract, 999)')).message).toBe(
      'An unexpected contract error occurred (code 999).',
    )
  })

  it('does not throw on malformed contract error strings', () => {
    expect(() => parseContractError('Error(Contract,)')).not.toThrow()
    expect(() => parseContractError('Error(Contract, nope)')).not.toThrow()
    expect(() => parseContractError('not a contract error')).not.toThrow()
  })
})
