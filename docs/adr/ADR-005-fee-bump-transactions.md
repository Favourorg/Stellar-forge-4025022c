# ADR-005: Fee-Bump Transactions for Sponsored Network Fees

## Status

Accepted

## Context

StellarForge lets users create and manage token-factory transactions from the frontend. Some users may have enough token balance or application intent to submit an action, but not enough XLM to pay the network base fee. Requiring every user to pre-fund an account with XLM adds friction to onboarding and creates failed transactions that are difficult to explain in the UI.

Stellar supports fee-bump transactions, where an already-signed inner transaction keeps its original source account and signatures, while a separate fee-source account wraps that envelope and pays the network fee. This lets StellarForge sponsor network fees without taking control of the user's source account or changing the transaction semantics.

## Decision

StellarForge will use Stellar fee-bump transactions for sponsored network-fee flows.

The user signs the inner transaction as usual. A fee-source account then wraps the signed XDR in a fee-bump envelope, signs only the outer fee-bump transaction, and submits it to the network. The fee source must hold enough XLM to cover the selected fee, but it does not re-sign or replace the user's inner transaction.

## Alternatives Considered

### Require users to pre-fund XLM

This is the simplest operational model, but it pushes network-fee education onto new users and increases failed first-run transactions. It also makes sponsored or promotional flows harder to support.

### Sponsored reserves

Sponsored reserves help another account hold ledger entries, but they do not directly pay the transaction fee for an already-signed operation. They are useful for account and data-reserve sponsorship, not for wrapping a user transaction at submission time.

### Pre-funded custodial or relay accounts

A backend-controlled account could submit transactions on behalf of users, but that changes trust assumptions and may require custody, delegation, or server-side signing. StellarForge should keep user authorization in the user's wallet wherever possible.

### Ask users to re-sign with a higher fee

Re-signing can solve underpriced transactions, but it adds another wallet prompt and does not help users with insufficient XLM. Fee bumps let the original inner transaction remain intact.

## Consequences

- Users can complete supported actions even when their account cannot cover the network base fee.
- The fee-source account needs monitoring, funding, and operational controls.
- The UI and support docs must explain that the user's inner transaction is unchanged and the fee source only signs the outer envelope.
- Failed fee-bump submissions should clearly distinguish insufficient fee-source balance from inner transaction failures.
- Sponsored fees should be rate-limited or policy-gated so the fee source is not drained by abusive requests.
