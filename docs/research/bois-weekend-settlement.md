# Bois Weekend: computing the fewest Transfers, to the cent

Research for the ticket *"How do we compute the fewest Transfers, to the cent?"*
Terms (Weekend, Receipt, Item, Member, Settlement, Transfer) are as defined in
[CONTEXT.md](../../CONTEXT.md). All sources were accessed **2026-10-07**.

## TL;DR

- **Algorithm:** keep every balance in integer cents. Split the Members with
  non-zero balances into the largest possible number of groups that each sum to
  zero, using an exact subset DP. For up to 12 Members that is 4,096 states and
  about 0.3 ms. Within each group, pair creditors and debtors with Spliit's
  walk, which is stable and ordered by Member id. The result is always the true
  minimum, and it is deterministic. If the unpaid Transfers already shown still
  settle the current balances in the minimum count, **keep them** rather than
  recomputing.
- **Rounding:** use integer-cent **largest-remainder (Hamilton)** apportionment
  for every split, both Item → Members by share weight and a Receipt adjustment
  → Members by Item subtotal. The leftover cents go to the largest remainders.
  Ties rotate by a hash of the Item or Receipt id. Totals always add up exactly.
- **Paid Transfers** are entries in the ledger, the same as an Item. They move
  balances and are never re-planned. Only unpaid Transfers may change after a
  late edit.

## 1. What is known about "fewest Transfers"

### Theory

- Netting first is standard and loses nothing. Each Member's balance (paid minus
  consumed) is all that matters. Any set of *n* non-zero balances can be settled
  in at most *n − 1* Transfers.
- The minimum is *n − k*, where *k* is the largest number of **disjoint zero-sum
  subsets** the balances can be split into. A zero-sum subset of size *s* settles
  in *s − 1* Transfers. Finding *k* is NP-hard, in the strong sense.
  - Pătcaş, *The debts' clearing problem: a new approach*, Acta Univ. Sapientiae
    Informatica (2011), arXiv:1111.3663 — <https://arxiv.org/abs/1111.3663>.
    The abstract says earlier work gave a dynamic-programming solution and proved
    the problem NP-hard.
  - Verhoeff, *Settling Multiple Debts Efficiently: An Invitation to Computing
    Science*, Informatics in Education 3(1), 2004 —
    <https://infedu.vu.lt/journal/INFEDU/article/612>. It relates the problem
    to Subset Sum and 3-Partition.
  - Yao, *Settling Debts Efficiently: Zero-Sum Set Packing*, Harvard senior
    thesis, 2017 — <https://dash.harvard.edu/handle/1/38811480>. It reduces the
    problem to a special case of set packing that is as hard to approximate as
    the general case.
  - *Caveat:* this environment's egress proxy blocked arxiv.org, infedu.vu.lt
    and dash.harvard.edu. The claims above come from the papers' indexed
    abstracts, not from a first-hand read. They agree with each other and with
    the textbook result.
- "NP-hard" does not matter at our size. The exact DP is
  `dp[mask] = max_j dp[mask \ j] + (sum(mask) == 0 ? 1 : 0)` over 2^n masks, so
  it is O(n·2^n). At n = 12 that is 4,096 masks × 12, and it measured **0.34 ms
  per run** in Node 22 (see §5).

### What real splitters do

| Splitter | Settlement algorithm (from source) | Arithmetic | Paid Transfers |
|---|---|---|---|
| **Spliit** (TS, Next.js) | Greedy, but **ordered by sign and then participant id, not by amount**. It always pairs the lowest-id creditor with the highest-id debtor. The comparator's doc comment says it is "stable across reimbursements … executing a suggested reimbursement does not result in completely new repayment suggestions." [`src/lib/balances.ts` L79–126](https://github.com/spliit-app/spliit/blob/b73d551a6dea3a27f3d5d42a805b86edcb1ee651/src/lib/balances.ts#L79-L126) | Integer minor units. Shares use **Hamilton apportionment**, with ties rotated by an FNV-1a hash of the expense id. [`src/lib/shares.ts`](https://github.com/spliit-app/spliit/blob/b73d551a6dea3a27f3d5d42a805b86edcb1ee651/src/lib/shares.ts#L41-L93) | Recorded as expenses (reimbursements) that flow through `getBalances`. Suggestions are recomputed each time. |
| **IHateMoney** (Python/Flask) | Calls `settle()` from the [`debts` 0.5](https://pypi.org/project/debts/0.5/) package ([`models.py` L9, L209–233](https://github.com/spiral-project/ihatemoney/blob/e66a7672e8e5c41549bf53c4a824c72c43ab9079/ihatemoney/models.py#L209-L233)). In `debts/solver.py`, the arguments to `reduce_balance(crediters, debiters)` are swapped by name, so each step pops the **smallest** debtor and the **smallest** creditor (checked empirically, §5). | `float` balances. `debts` quantises each Transfer `ROUND_HALF_DOWN` to 0.01, drops Transfers under 0.01, and allows a 0.01 imbalance. | `BillType.REIMBURSEMENT` bills move balances ([`models.py` L113–160](https://github.com/spiral-project/ihatemoney/blob/e66a7672e8e5c41549bf53c4a824c72c43ab9079/ihatemoney/models.py#L113-L160)). Recomputed each time. |
| **Cospend** (Nextcloud, PHP) | A port of the same recursion, but with the sort fixed: it pops the **largest** creditor and the **largest** debtor. [`LocalProjectService.php` L1239–1345](https://github.com/julien-nc/cospend-nc/blob/402e7f774cbb4600b1e70a3e18a668c7907cee9c/lib/Service/LocalProjectService.php#L1239-L1345). It also offers a "centred" settlement where everyone pays one hub person. | `float`, rounded only when the "auto settlement" bills are created (`round($amount, $precision)`, L1165). | "Auto settlement" writes each Transfer as a reimbursement bill. |
| **Splitwise** (closed) | Its "Debts made simple" post (R. Laughlin, 2012, <https://blog.splitwise.com/2012/09/14/debts-made-simple/>) gives three rules: everyone's net amount is unchanged; no one owes someone they did not owe before; no one owes more in total than before. The KB (<https://kb.splitwise.com/balances-and-expenses/what-is-simplify-debts>) says simplification is re-run **automatically whenever an expense or payment is added**, and advises users to watch their total rather than pairwise balances. | Unknown. | Payments are ledger entries; pairs reshuffle freely. |
| **Settle Up** (closed) | Its tips page (<https://settleup.io/tips>) describes debt minimisation as transferring debts, "so you might end up paying somebody you don't directly owe", and says it can be switched off per group. No algorithm is published. | Unknown. | — |

*Caveat:* the proxy blocked splitwise.com and settleup.io, so the Splitwise and
Settle Up rows come from indexed snippets of those pages. Spliit, IHateMoney,
`debts` and Cospend were read in full from source at the pinned commits.

No open-source splitter we found computes the true minimum. All of them use a
one-pass greedy that is at most *n − 1*.

### How close is greedy for 2–12 people?

This is a Monte Carlo of 2,000 trials per *n*, with the exact DP as the
reference. The script is in §5. Two kinds of balance were tested:

- **Weekend-like:** 3–25 Receipts, each with 1–6 Items of $1.50–$200.00, split
  among a random subset of Members with occasional 2:1 or 3:1 weights. Balances
  come out in odd cents.
- **Round-dollar:** balances that are multiples of $5. This is the worst case for
  greedy, because zero-sum pairs and triples become common.

| n | weekend: largest-first = optimum | weekend: worst excess | round-$: largest-first = opt | round-$: smallest-first (`debts`) = opt | round-$: Spliit id-order = opt | round-$: worst excess |
|---|---|---|---|---|---|---|
| 2–7 | 100% | 0 | 93–100% | 65–100% | — | ≤ 2 |
| 8 | 100% | 1 | 70.7% | 43.1% | 37.1% | 2 |
| 10 | 99.8% | 1 | 55.5% | 15.8% | — | 3 |
| 12 | 99.2% | 1 | 42.4% | 6.5% | 4.3% | 3 |

Reading the table:

- **Realistic cent-level balances almost never contain a zero-sum subset.** Any
  greedy gives *n − 1* there, and that *is* the optimum about 99% of the time at
  n = 12.
- Greedy misses when amounts are round, for example after placeholder Items
  such as "petrol $50 each", or once Members have marked round Transfers paid.
  At n = 12 it can then be up to **3 Transfers** worse than the optimum.
- Pairing exact matches first and then running largest-first gets 58% optimal at
  n = 12 on round balances. That is better, but still not exact.
- Because the exact DP costs well under a millisecond at n = 12, **computing the
  true minimum costs nothing in practice.**

## 2. Splitting an Item, or a Receipt adjustment, into cents

### Rule: largest remainder (Hamilton), in integer cents

To split `amount` cents across weights `w_i` with total `W`:

1. Give each Member `floor(amount·w_i / W)` cents.
2. Hand out the `amount − Σ floor` cents that are left, one each, to the largest
   remainders `amount·w_i mod W`.

All of this is integer arithmetic, so no floats are involved. Properties:

- **Nothing is lost or invented.** The shares always sum to `amount`.
- Each share is within 1 cent of its exact rational value. This was checked over
  20,000 random cases.
- Weights cover both cases in the ticket. An even split is `w = 1` for each
  assigned Member; a custom split such as 2:1 is `w = [2, 1]`.

Spliit's [`apportion`](https://github.com/spliit-app/spliit/blob/b73d551a6dea3a27f3d5d42a805b86edcb1ee651/src/lib/shares.ts#L41-L93)
does exactly this. Its comment on `getBalances` records why it moved to this
rule: per-participant rounding of float totals "does not preserve a sum, and the
residue ended up in the group's total balance."

### Who absorbs the leftover cent

| Approach | Example | Effect |
|---|---|---|
| Largest remainder, ties by fixed list order | Dinero.js `allocate` gives leftovers to the largest *ratio* first, then by index ([`distribute.ts`](https://github.com/dinerojs/dinero.js/blob/76b969e519dc44675d4af898d25629995d0b16f2/packages/dinero.js/src/core/utils/distribute.ts)) | On an even split the same Member (index 0) pays the extra cent on every Item. |
| Largest remainder, ties **rotated by a hash of the Item id** | Spliit (FNV-1a of expense id, mod count) | Deterministic and a pure function of the Item. The extra cents spread across Members over many Items. **Recommended.** |
| Random | — | Not reproducible, and a preview can differ from the saved result. Avoid. |

**Determinism:**

- Sort Members by id before apportioning, as Spliit does, because database or
  object order is not guaranteed.
- Seed the tie rotation from the Item's own stable id. Mint that id before the
  first preview so the preview matches what is saved.

### Receipt-level discounts and surcharges

Use two stages. Each stage conserves its total exactly.

1. Split every Item among its Members as above. This gives each Member a
   subtotal in cents for the Receipt.
2. Split the Receipt adjustment (negative for a discount, positive for a
   surcharge) **by those subtotals as weights**, using the same apportionment
   with the tie seed set to the Receipt id.

For a negative amount, apportion the absolute value and negate the result, so a
discount's extra cent goes to the largest remainder. Spliit instead uses `floor`
on the signed value. Either approach conserves the total; pick one and test it.

The result: `Σ Member shares = Σ Items + adjustment`, which equals the Receipt
total, exactly.

The alternative is to apportion the whole Receipt total once, by exact rational
weights. That saves one rounding step, but the weights are fractions
(`price·w/W` summed over Items), so it needs a common denominator or BigInt. It
also means per-Item amounts shown in the UI no longer add up to a Member's line.
Two-stage is simpler, and the error is at most one cent per stage.

## 3. Integer cents or a decimal library in TypeScript?

**Use integer cents in `number`, and assert `Number.isSafeInteger` at the
boundaries.**

- NZD has 2 minor units, and one currency is fixed per Weekend, so there is
  nothing to scale.
- The largest intermediate value is `amount × weight`. A $100,000 Receipt
  (10^7 cents) times a subtotal weight of 10^7 cents is 10^14, well under
  2^53 ≈ 9×10^15.
- Every operation needed is integer add, subtract, multiply, floor-divide and
  compare. No decimal fractions appear anywhere.
- The parse and format boundary is the only risky place. Parse `"12.30"` by
  splitting the string, never with `Math.round(parseFloat(s) * 100)` on
  user-facing paths. Format with `Intl.NumberFormat('en-NZ', { style:
  'currency', currency: 'NZD' })` on `cents / 100`.
- Spliit made exactly this move: minor units plus apportionment. IHateMoney and
  Cospend still use floats and paper over the result with ±0.01 tolerances and
  rounding at display time.

Libraries:

- **Dinero.js** gives you `allocate`. It adds a dependency, and its default tie
  order is index-based (see above), so you would still want your own rotation.
- **decimal.js** and **big.js** solve a problem we do not have (arbitrary decimal
  scale), and they still need an apportionment step on top.
- If weights could ever exceed 10^7 (they should not), switch the inner multiply
  to `BigInt`.

## 4. Churn after a late edit, and marked-paid Transfers

How the others handle it:

- **Everyone records a paid Transfer as a ledger entry** (Spliit
  reimbursements, IHateMoney `REIMBURSEMENT` bills, Cospend auto-settlement
  bills, Splitwise payments). Balances include it, and the plan is recomputed
  from the remaining balances. A paid Transfer is never re-planned; it is simply
  history. Do the same.
- **Splitwise** recomputes on every new expense or payment and tells users to
  watch their total, accepting that pairs reshuffle.
- **Spliit** designed its id-ordered walk so that paying one suggested
  reimbursement leaves the rest unchanged. We confirmed this: **100%** of 3,000
  trials at n = 6 and n = 12, paying a random suggested Transfer. The price is
  optimality. On round-dollar balances it was optimal only 4–37% of the time at
  n = 8–12.

Measured churn after a late edit (largest-first greedy, one Item changed by
$3.40 after the Settlement was computed):

| n | Settlement changes any from→to pair | share of Transfers re-paired | Transfers identical including amount |
|---|---|---|---|
| 4 | 3% | 1% | ~60% |
| 8 | 30% | 6% | ~63% |
| 12 | 66% | 14% | ~61% |

So any late edit changes the amounts on roughly 40% of Transfers, whatever the
algorithm, because balances move. Who pays whom changes less often, but at
n = 12 it is common.

Exact DP plus Spliit's walk was optimal 100% of the time. When one suggested
Transfer was paid, the rest stayed unchanged 91–100% of the time. The misses
happen because the DP can pick a different but equally small grouping. A
**sticky rule** closes that gap. It also shows that most churn can be made
visible rather than prevented:

1. Paid Transfers stay in the ledger and are never edited by the algorithm.
2. On recompute, if the previous *unpaid* Transfers still settle the current
   balances exactly, and their count equals the new optimum, keep them unchanged.
   This always holds when someone paid exactly what was suggested.
3. Otherwise compute a fresh optimal plan and **show a diff** ("Sam now pays
   Alex $12.40, not $9.00"). Do not swap the list silently. If a paid Transfer
   turns out to be an over-payment after an edit, the new plan simply contains a
   Transfer back.

## 5. Evidence and scripts

The scratch scripts were run with Node 22.22. They are not committed:

- `sim.mjs`: greedy variants against the exact DP. The table in §1 comes from
  it. The DP at n = 12 took 0.34 ms per run.
- `ref.mjs`: the reference implementation below. Tests:
  - apportionment conserves the total, and each share is within one cent
    (20,000 cases);
  - Settlement zeroes every balance, and its Transfer count equals the
    independent DP optimum (5,000 cases, n = 2–12, mixing round and odd-cent
    balances).
- `stable.mjs` and `combo.mjs`: stability when one suggested Transfer is paid,
  and optimality, for Spliit's walk, largest-first, and exact DP plus walk.
- `debts` 0.5 probe: `settle([a+50, b+10, c−45, d−15])` gives
  `d→b 10, d→a 5, c→a 45`, which is smallest-first.

## 6. Recommendation

**Settlement:**

- Put balances in integer cents, with paid Transfers counted as ledger entries.
- Run an exact max-zero-sum-partition DP when there are 16 or fewer non-zero
  Members. Fall back to the walk alone above that.
- Run Spliit's id-ordered creditor/debtor walk inside each group.
- Keep the previous unpaid Transfers when they are still a valid minimal plan.

**Rounding:** largest-remainder apportionment in integer cents, ties rotated by
a hash of the Item or Receipt id, Members sorted by id first. Apply it once per
Item (weights = shares) and once per Receipt adjustment (weights = Item
subtotals).

```ts
type Cents = number // always a safe integer

/** Largest-remainder split. Σ result === amount, each part within 1¢ of exact. */
function apportion(amount: Cents, weights: number[], seed: string): Cents[] {
  const W = weights.reduce((a, b) => a + b, 0)
  const sign = amount < 0 ? -1 : 1, abs = Math.abs(amount), n = weights.length
  const parts = weights.map(w => Math.floor((abs * w) / W))
  let left = abs - parts.reduce((a, b) => a + b, 0)
  const off = fnv1a(seed) % n // rotate ties so even splits don't always hit index 0
  const order = weights
    .map((w, i) => ({ i, r: abs * w - parts[i] * W }))
    .sort((a, b) => b.r - a.r || (a.i - off + n) % n - (b.i - off + n) % n)
  for (let k = 0; left > 0; k++, left--) parts[order[k].i]++
  return parts.map(p => p * sign + 0) // +0 avoids -0
}

/** Member → cents owed for one Receipt (Members pre-sorted by id). */
function receiptShares(r: Receipt): Map<MemberId, Cents> {
  const sub = new Map<MemberId, Cents>()
  for (const item of r.items) {
    const ms = [...item.shares.keys()].sort()
    apportion(item.cents, ms.map(m => item.shares.get(m)!), item.id)
      .forEach((c, k) => sub.set(ms[k], (sub.get(ms[k]) ?? 0) + c))
  }
  if (r.adjustmentCents !== 0) {
    const ms = [...sub.keys()].sort()
    apportion(r.adjustmentCents, ms.map(m => sub.get(m)!), r.id)
      .forEach((c, k) => sub.set(ms[k], sub.get(ms[k])! + c))
  }
  return sub // Σ === Σ items + adjustment === receipt total
}

/** Fewest Transfers. balances: paid − consumed ± paid Transfers; Σ === 0. */
function settle(balances: Map<MemberId, Cents>, previousUnpaid: Transfer[] = []): Transfer[] {
  const ids = [...balances.keys()].filter(id => balances.get(id) !== 0).sort()
  const v = ids.map(id => balances.get(id)!), n = v.length, N = 1 << n
  // dp[mask] = max number of disjoint zero-sum groups inside mask
  const sum = new Array<number>(N).fill(0), dp = new Int8Array(N)
  for (let m = 1; m < N; m++) {
    const low = m & -m
    sum[m] = sum[m ^ low] + v[31 - Math.clz32(low)]
    let best = 0
    for (let j = 0; j < n; j++) if (m >> j & 1) best = Math.max(best, dp[m ^ (1 << j)])
    dp[m] = best + (sum[m] === 0 ? 1 : 0)
  }
  const optimum = n - dp[N - 1]
  // sticky: keep last plan if it still settles exactly and is still minimal
  if (previousUnpaid.length === optimum && settlesExactly(previousUnpaid, balances)) return previousUnpaid
  // walk back through dp, cutting a group at each zero-sum mask (lowest index wins ties)
  const groups: [MemberId, Cents][][] = []
  let m = N - 1, g: [MemberId, Cents][] = []
  while (m) {
    let j = 0
    while (!((m >> j & 1) && dp[m ^ (1 << j)] + (sum[m] === 0 ? 1 : 0) === dp[m])) j++
    g.push([ids[j], v[j]]); m ^= 1 << j
    if (sum[m] === 0) { groups.push(g); g = [] }
  }
  return groups.flatMap(walk) // optimum transfers total
}

/** Spliit's walk: creditors then debtors, each by id; lowest creditor ↔ highest debtor. */
function walk(group: [MemberId, Cents][]): Transfer[] {
  const a = group.map(([id, c]) => ({ id, c }))
    .sort((x, y) => (x.c > 0) !== (y.c > 0) ? (x.c > 0 ? -1 : 1) : x.id < y.id ? -1 : 1)
  const out: Transfer[] = []
  while (a.length > 1) {
    const cr = a[0], db = a[a.length - 1]
    if (cr.c > -db.c) { out.push({ from: db.id, to: cr.id, cents: -db.c }); cr.c += db.c; a.pop() }
    else { out.push({ from: db.id, to: cr.id, cents: cr.c }); db.c += cr.c; a.shift() }
  }
  return out.filter(t => t.cents !== 0)
}
```

Test cases for the implementing PR:

- 1000¢ split three ways gives `[334, 333, 333]` in some rotation.
- A 2:1 split of 1000¢ gives `[667, 333]`.
- A −500¢ discount over subtotals 3000/1500/1500 gives `[−250, −125, −125]`.
- Σ shares === Receipt total for random cases.
- Settlement zeroes all balances and its count equals `n − dp[full]`.
- Paying a suggested Transfer leaves the others byte-identical.
- The same input always gives the same output, whatever the order of Members or
  Items.
