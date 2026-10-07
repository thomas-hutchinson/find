# Bois Weekend: reading a receipt photo into Items with the Claude API

Ticket: *How should Claude read a receipt photo into Items?*
Researched 2026-10-07 against Anthropic's own documentation (sources at the
end, all accessed 2026-10-07). Terms (Weekend, Receipt, Item, Member) follow
[CONTEXT.md](../../CONTEXT.md).

## Recommendation in one paragraph

Have the server function send the photo(s) to **Claude Sonnet 5.5
(`claude-sonnet-5-5`) with adaptive thinking at `effort: "low"`** and a
**structured output** (`output_config.format`, a JSON schema) that returns
Items, receipt-level adjustments, subtotal, GST, total, merchant and date, with
**all money in integer cents**. The server, not the model, then checks that
Items + adjustments add up to the printed total. If the check fails, retry once
on **Claude Opus 5.5 (`claude-opus-5-5`) at `effort: "medium"`**; if it still
fails, show the result to the person with the difference highlighted. The
phone downscales each photo to fit the model's native resolution (long edge
≤ 2576 px, ≤ 4784 visual tokens) and encodes it once as JPEG. Expected cost is
**about US$0.03–0.05 per single-photo receipt** on Sonnet 5.5 (estimate,
derivation below). The key lives only in the server function's secret store;
the function must authenticate the caller, check Weekend membership,
rate-limit, cap image size and count, fix the model and prompt server-side,
and run under a dedicated workspace with a spend limit.

---

## 1. Which model, and the accuracy/cost trade-off

### Current models (facts)

| Model | API ID | Input / output per MTok [8] | Batch [8] | Image tier | Latency (Anthropic's relative label) | Notes |
|---|---|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | $10 / $50 | 50% off | High-res | Slower | For demanding reasoning and long-horizon agentic work [1] |
| Claude Opus 5.5 | `claude-opus-5-5` | $4 / $20 | 50% off | High-res | Moderate | Thinking always on; default effort `medium` [1][7] |
| **Claude Sonnet 5.5** | `claude-sonnet-5-5` | **$2 / $10** | 50% off | High-res | **Fast** | Released 2026-09-28; default effort `high`; text and images in [1][2] |
| Claude Haiku 4.5 | `claude-haiku-4-5` | $1 / $5 | 50% off | Standard | Fastest | Retirement **not sooner than 2026-10-15** [1] |

* "High-resolution" tier = Claude 4.7 and later models: images up to 2576 px
  long edge / 4784 visual tokens. "Standard" = all other models: 1568 px /
  1568 visual tokens [3].
* All current models support vision, and all four above support structured
  outputs [1][4].
* Thinking tokens are billed as output tokens even when the thinking text is
  not returned, and count toward `max_tokens` [9].

### What a receipt costs

An image costs `ceil(width/28) × ceil(height/28)` visual tokens, after
Claude downscales anything above its tier's limits [3]. Using Anthropic's
reference resize function [5] on a typical 3:4 phone photo (3024×4032):

| Tier | Resized to | Visual tokens |
|---|---|---|
| High-res (Sonnet 5.5, Opus 5.5, Fable 5.1) | 1659×2212 | 4,740 |
| Standard (Haiku 4.5) | 952×1270 | 1,564 |

Per-receipt cost, one photo. **Assumptions (not from docs, to be measured):**
~1,000 text input tokens (system prompt plus the format instructions the API
injects for structured outputs [4]), ~1,500 output tokens of JSON for a
~25-Item receipt, plus thinking (0–1,500 tokens at low effort, more at
medium).

| Model, effort | Input tokens | Output tokens (JSON + thinking) | Est. cost (USD) |
|---|---|---|---|
| Haiku 4.5 | ~2,600 | ~1,500 | ~$0.010 |
| **Sonnet 5.5, `low`** | ~5,800 | ~2,000–3,000 | **~$0.03–0.04** |
| Opus 5.5, `medium` | ~5,800 | ~2,500–4,000 | ~$0.07–0.10 |
| Fable 5.1, `high` | ~5,800 | ~3,000–5,000 | ~$0.21–0.31 |

Each extra photo of the same receipt adds up to ~4,740 input tokens (~$0.01 on
Sonnet 5.5). A Weekend of 40 receipts is roughly US$1.50 on Sonnet 5.5. Output
dominates the cost, so effort and verbose fields matter more than image size.

Levers that do **not** fit this use case:

* **Batch API** (50% off) completes "most batches within 1 hour", up to 24 h
  [10]. Too slow for someone standing at the till.
* **Prompt caching**: Sonnet 5.5's minimum cacheable prompt is 512 tokens and
  the 5-minute cache only helps repeated requests [11][2]. The system prompt
  and schema could be cached, but the image (most of the input) changes every
  time. Worth adding only if the system prompt grows past ~1,000 tokens.

### Accuracy: why Sonnet 5.5 at low effort, with Opus 5.5 as the retry

Anthropic publishes no receipt-reading benchmark, so this is a judgement to
confirm with an eval (section 9):

* **Haiku 4.5 is ruled out.** It is on the standard image tier, so a long
  receipt photographed in one shot is shrunk to ~392 px wide (section 2),
  which loses small print. Its retirement date is also "not sooner than
  2026-10-15", eight days from this note [1].
* **Sonnet 5.5** is high-res tier and labelled "Fast", at half the Opus price.
  Anthropic's guidance for Sonnet 5.5 is to "start with `medium` or `low`" for
  latency-sensitive work [6]. Some thinking is useful here because the model
  has to reconcile arithmetic (weighed items, multi-buys, discounts), so keep
  adaptive thinking on at `low` rather than turning it off with
  `between_tools` [12].
* **Opus 5.5 at `medium`** is the escalation path when the server's sum check
  fails. Its cost is only paid on hard receipts (crumpled, handwritten, or
  long).
* **Fable 5.1** is for "demanding reasoning and long-horizon agentic work" [1].
  It is not needed for transcription at 5–8× the cost.
* Anthropic's prompting guide reports "consistent uplift on image evaluations"
  when Claude has a crop/zoom tool [13]. That adds a tool round-trip
  (latency), so keep it in reserve for the eval to justify.

---

## 2. Image limits and client-side downscaling

### Limits (facts)

| Limit | Value | Source |
|---|---|---|
| Formats | JPEG, PNG, GIF, WebP (first frame only) | [3] |
| Max per image | 10 MB base64 on the Claude API (5 MB on Bedrock / Google Cloud) | [3] |
| Max request | 32 MB on the Messages API (Bedrock 20 MB, Google Cloud 30 MB); over → `413 request_too_large` | [14][15] |
| Max dimensions | 8000×8000 px | [3] |
| Images per request | 600 (100 on 200k-context models) | [3] |
| More than 20 images in a request | A stricter per-image limit applies: keep each ≤ 2000 px or send ≤ 20 images | [3] |
| Native resolution, high-res tier | 2576 px long edge **and** 4784 visual tokens; anything larger is downscaled server-side | [3][5] |
| Small images | Accuracy drops for low-quality, rotated, or very small (< 200 px) images | [3] |

Anthropic says to pre-resize rather than let the API downscale: it reduces
latency, and "heavy JPEG compression can make text difficult to read", so
compress once and check the result [3]. For most photos the **token limit**,
not the edge limit, decides the final size [5].

### What the App should do on the phone

1. **Decode with EXIF orientation applied.** `createImageBitmap(file, {
   imageOrientation: "from-image" })` gives an upright bitmap. Rotated images
   hurt accuracy [3].
2. **Optional crop to the paper.** Cropping away the table around the receipt
   gives the receipt more of the token budget. Anthropic warns against
   "cropping out key visual context solely to enlarge the text" [3], so crop
   to the paper's edges, not inside them.
3. **Resize to exactly what Claude would see.** Port Anthropic's
   `resizedSize()` reference implementation [5] with `maxEdge = 2576` and
   `maxTokens = 4784`. A 3024×4032 photo becomes 1659×2212 (4,740 tokens). An
   image already inside the limits is returned unchanged, so nothing is
   upscaled.
4. **Encode once as JPEG at quality ≈ 0.85** with `canvas.toBlob(...,
   "image/jpeg", 0.85)` or `OffscreenCanvas.convertToBlob`. Re-encoding drops
   EXIF, which removes GPS location from what is uploaded. A 1659×2212 receipt
   JPEG at that quality is typically well under 1 MB, far inside the 10 MB
   limit. The quality figure is a starting point: inspect real outputs, as the
   docs advise [3].
5. **Upload as binary (`multipart/form-data`) to the server function.** Let the
   function base64-encode it for the API. Base64 from the phone adds ~33% for
   no benefit.

### Long receipts

A long receipt in one portrait photo is the worst case. Cropped to the paper,
it might be 1000×4000 px. The 2576 px edge limit then forces 644×2576 on the
high-res tier (2,116 tokens), or 392×1568 on the standard tier [5]. Narrow
columns of small print get hard to read. Two fixes, both sent as several images
in **one** request:

* **Ask for several photos** ("Add another photo" button), top to bottom with
  some overlap. Each photo gets its own full token budget.
* **Tile a tall crop on the phone** into 3:4 segments with ~10% overlap.
  1000×4000 becomes three ~1000×1450 tiles of ~1,900 tokens each, all at full
  resolution.

Cap a Receipt at **6 images**. That keeps it far below the 20-image threshold
and the 32 MB request limit (6 × ~1 MB × 1.33 base64 ≈ 8 MB). Tell the model
the images are consecutive, overlapping parts of one receipt (section 4).

---

## 3. Structured output vs tool use

Use **JSON outputs (`output_config.format` with `type: "json_schema"`)**, not a
tool:

* Constrained decoding guarantees the reply parses and matches the schema
  ("no more `JSON.parse()` errors", "no retries needed for schema violations")
  [4].
* On Sonnet 5.5 (and Opus 5.5), **forced tool use** (`tool_choice: any` or
  `tool`) **returns a 400** [2][12], so the old "force a `record_receipt`
  tool" pattern no longer works. JSON outputs replace it.
* Thinking is not constrained by the grammar ("Grammar state resets between
  sections, allowing Claude to think freely while still producing structured
  output in the final response") [4]. Low-effort thinking can therefore do the
  arithmetic while the answer stays schema-valid.

Schema constraints that shape the design [4]:

* `additionalProperties: false` on every object; every property is listed in
  `required`.
* **No numeric constraints** (`minimum`, `maximum`, `multipleOf`) and string
  `pattern` support is limited. Range checks therefore happen in the server.
* **Limits per request:** 24 optional parameters and **16 parameters with union
  types** (a nullable `["integer","null"]` counts as a union). The schema below
  has 0 optional parameters and 6 unions.
* Enum capitalisation is not guaranteed, so compare enum values
  case-insensitively.
* The first request with a new schema pays a one-off grammar compilation
  delay. The compiled grammar is then cached for 24 h from last use. Changing
  only `name`/`description` does not invalidate it [4].
* A property that asks for the model's reasoning can trigger a
  `reasoning_extraction` refusal. Ask for short `warnings` instead, not a
  "reasoning" field [4].
* `stop_reason: "max_tokens"` or `"refusal"` can return output that does not
  match the schema, so check `stop_reason` before parsing [4].
* **Never send `temperature`, `top_p` or `top_k`.** Non-default values return
  400 on Sonnet 5.5 [2]. Prefill is also unsupported with JSON outputs [4].

**Integer cents.** Floats like 4.1 + 2.2 drift. Having the model write `410`
and `220` makes the server's sum check exact.

---

## 4. Reading the receipt: prompt content and the sum check

### What the system prompt should tell the model

The system prompt is fixed on the server and never comes from the client.
Domain points for NZ receipts (general knowledge; check against your own
receipts):

* **Prices are GST-inclusive.** The "GST" or "GST included" line (15%, i.e.
  3/23 of the total) is informational. It is **never** an Item or an
  adjustment and never added to the total.
* **Dates are DD/MM/YYYY.** `03/04/26` is 3 April 2026. Output ISO dates.
* **Common adjustments:** card/paywave surcharges, public-holiday surcharges at
  cafés and bars, service charges, tips, whole-receipt discounts, and **cash
  rounding** (NZ has no 5c coin, so cash totals round to 10c).
* **Not Items:** subtotal, GST, total, "EFTPOS", "Change", loyalty and points
  balances, "You saved $x" summaries.
* **Line discounts** printed directly under an Item (e.g. "Club price –$1.00")
  are folded into that Item's `line_total_cents`. Only receipt-wide discounts
  are adjustments.
* **Weighed lines** ("1.234 kg @ $12.99/kg") become `quantity: 1.234`,
  `unit: "kg"`, `unit_price_cents: 1299`, `line_total_cents: 1603`.
* **Multi-photo:** "The images are consecutive, overlapping photos of ONE
  receipt, top to bottom. Each line appears once in `items`, even if it is
  visible in two photos."
* **Handwritten bar tabs:** transcribe what is written. Use `null` for prices
  that are not written, mark `confidence: "low"` on guessed lines, and never
  invent prices. Strike-throughs mean the line was removed.
* **Crumpled or partly unreadable:** prefer `null` plus a warning over a
  guess. Set `image_quality` honestly.
* "Before answering, check that the Items and adjustments add up to the
  printed total. If they don't, re-read the lines. If they still don't, add a
  warning saying by how much." The model does the check while thinking; the
  server checks again.

### The server's sum check (deterministic, never trusted to the model)

```
items_sum   = Σ items[].line_total_cents
adjust_sum  = Σ adjustments[].amount_cents
computed    = items_sum + adjust_sum

ok_total    = total_cents == null || computed == total_cents
ok_subtotal = subtotal_cents == null || items_sum == subtotal_cents   // informational only
ok_lines    = every item with unit_price_cents != null has
              |round(quantity × unit_price_cents) − line_total_cents| ≤ 1
ok_gst      = gst_cents == null || |round(total_cents × 3 / 23) − gst_cents| ≤ 2   // sanity only
```

* **`ok_total` passes:** return the Receipt's Items to the App.
* **`ok_total` fails:** retry once on `claude-opus-5-5`, `effort: "medium"`,
  with the same images. If it passes, use that result.
* **Still failing, or `total_cents == null`** (common on bar tabs): return the
  best result with `reconciled: false` and the cent difference. The App shows
  "Items add up to $X, receipt says $Y" and lets the person fix lines or keep
  the difference as its own Item.
* **`is_receipt == false`:** tell the person, and do not retry.
* Everything a person sees stays editable. The model's output is a draft of the
  Receipt, not the record.

---

## 5. Latency, and whether streaming helps

Facts:

* Anthropic gives relative speeds (Sonnet 5.5 "Fast", Opus 5.5 "Moderate") but
  no seconds. Latency depends on prompt length, output length and effort
  [1][2].
* Output length dominates. Anthropic's latency levers are a faster model,
  shorter prompts and outputs, and streaming for time-to-first-token [16].
* Lower effort "can significantly reduce response times and costs" [6].
* The first request with a new schema adds grammar compilation time, which is
  then cached for 24 h [4].
* Thinking `display` defaults to `"omitted"` on these models, so a streamed
  response is silent while the model thinks [9].

Estimate (not from docs; **measure in the spike**): an upload of ~0.5–1 MB on
mobile data, then Sonnet 5.5 at low effort producing ~2–3K output tokens. That
is probably **~8–20 s end to end** for a typical receipt, and longer for long
or multi-photo receipts and for the Opus retry.

Does streaming help UX?

* **Between the server function and Anthropic: yes, always.** Use the SDK's
  `messages.stream(...)` + `finalMessage()`. It avoids HTTP idle timeouts on
  slow responses, and the SDK requires streaming for large `max_tokens` [17].
* **Between the server function and the phone: optional, second iteration.**
  JSON outputs stream like normal text [4], so the server could relay text
  deltas and the App could parse partial JSON to show Items as they appear.
  The model thinks first, though, so the first Item still arrives after a
  pause. That makes the gain smaller than in chat, and it costs SSE plumbing
  on the edge platform and partial-JSON parsing in the App.
* **For v1, return one JSON response** and give the App honest progress UI:
  the captured photo thumbnail, "Reading receipt…", and a skeleton list. Add
  relay streaming only if measured p50 is above ~10 s.
* **Check the edge platform's wall-clock limit** for a request that waits
  20–40 s (Opus retry included) before choosing Supabase Edge Functions vs
  Cloudflare Workers. That is a platform fact outside Anthropic's docs.

---

## 6. The server function: keeping the key secret and the endpoint safe

### Key handling (facts from Anthropic's authentication docs)

* API keys are static `sk-ant-api…` secrets, intended for "servers where you
  control secret storage" [18]. **Never ship one in the PWA bundle.** Anything
  in a static site is public.
* "Store API keys in a secrets manager, rotate them periodically, and disable
  or delete any key you suspect has leaked." Keys can be created with an
  expiration [18]. Use the platform's secret store (Supabase secrets /
  Cloudflare Worker secrets) and read the key from the environment, as the SDK
  does by default.
* **Use a dedicated workspace for Bois Weekend.** Workspaces let you "control
  spend by use case" [14]. Per-workspace **spend and rate limits** can be set
  below the organisation's [19]. When a spend limit is reached, requests fail
  with 400 `invalid_request_error` ("You have reached your specified workspace
  API usage limits") [19]. Set a small monthly spend limit, which caps the
  damage from any abuse.
* App Attest (device-issued short-lived tokens) exists, but only for iOS and
  macOS apps [18], so it does not fit a PWA.

### Abuse controls the function must apply (recommendations)

1. **Authenticate every call.** Require the App's signed-in session (e.g. a
   Supabase JWT) and reject anonymous calls. Then **authorise**: the caller
   must be a Member of the Weekend the Receipt belongs to.
2. **Rate-limit per user and per Weekend.** Starting points: 30 reads per user
   per hour and 300 per Weekend in total. Return 429 to the App and show a
   friendly message.
3. **Validate input before spending tokens:**
   * at most 6 images
   * each image sniffed as JPEG/WebP by magic bytes, not by its declared type
   * each image ≤ 3 MB
   * long edge ≤ 2576 px, so an unscaled upload is rejected rather than paid
     for
   * total body ≤ 20 MB
4. **Fix everything except the images server-side:** model, effort,
   `max_tokens`, system prompt and schema. The client sends only images, their
   order, and the Receipt/Weekend IDs, never free text that reaches the prompt.
   This keeps the endpoint from becoming a free general-purpose Claude proxy.
5. **Make retries idempotent.** Hash the uploaded bytes (SHA-256). If the same
   images were read for this Receipt in the last day, return the stored
   result. That stops double charges from flaky mobile retries.
6. **Restrict CORS** to the App's origin. This is defence in depth only; it is
   not authentication.
7. **Handle API errors** with the SDK's typed errors. The SDK retries 429, 5xx
   and connection errors twice by default (Anthropic SDK default). Map:
   * `413` → "photo too large"
   * `429` / `529 overloaded_error` → "busy, try again"
   * spend-limit 400 → "reading is paused for now" [15][19]
8. **Don't log images or full responses.** Log the request ID,
   `usage.input_tokens`, `usage.output_tokens`, model, effort and the
   reconciliation outcome. That data is the cost dashboard and the eval
   signal.
9. **Check `stop_reason`** before parsing:
   * `max_tokens` → retry with a larger `max_tokens`
   * `refusal` → treat as unreadable [4]

   Receipts are unlikely to trip safety classifiers. Optionally, add Anthropic's
   server-side fallback (`fallbacks: "default"` with beta header
   `server-side-fallback-2026-07-01`). On a classifier decline it re-runs the
   request on a recommended model, and the refusal stands for categories with
   no recommended fallback [20].

---

## 7. Recommended request shape

### App → server function

`POST /bois-weekend/read-receipt` with `multipart/form-data`:

| Field | Type | Notes |
|---|---|---|
| `weekendId` | string | Membership is checked server-side |
| `receiptId` | string | Idempotency key together with the image hashes |
| `image` (1–6, in order) | `image/jpeg` or `image/webp` | Already resized to ≤ 2576 px / ≤ 4784 visual tokens, encoded once |

The response is the parsed object below plus
`{ "reconciled": boolean, "difference_cents": integer, "model": string }`.

### Server function → Claude API

`POST https://api.anthropic.com/v1/messages`, built with `@anthropic-ai/sdk`
(`client.messages.stream(body).finalMessage()`). A second image block is added
per extra photo, before the text block.

```json
{
  "model": "claude-sonnet-5-5",
  "max_tokens": 16000,
  "thinking": { "type": "adaptive" },
  "output_config": {
    "effort": "low",
    "format": {
      "type": "json_schema",
      "schema": { "$comment": "RECEIPT_SCHEMA below" }
    }
  },
  "system": "You read photos of New Zealand receipts, bills and handwritten bar tabs into structured data for a group expense-splitting app. <rules from section 4>",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "image", "source": { "type": "base64", "media_type": "image/jpeg", "data": "<photo 1>" } },
        { "type": "image", "source": { "type": "base64", "media_type": "image/jpeg", "data": "<photo 2, optional>" } },
        { "type": "text", "text": "Read this receipt. 2 photos, top to bottom, overlapping." }
      ]
    }
  ]
}
```

* `max_tokens` 16000 leaves room for thinking plus a long receipt. Output is
  billed by tokens actually generated, not by the cap.
* No `temperature`/`top_p`/`top_k` and no prefill (section 3).
* **Retry request (sum check failed):** identical, except `"model":
  "claude-opus-5-5"` and `"effort": "medium"`. Thinking stays adaptive; it
  cannot be disabled on Opus 5.5 [7].

### `RECEIPT_SCHEMA`

All properties are required. It has 6 nullable (union) properties, within the
limit of 16, and 0 optional ones [4].

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["is_receipt", "receipt_kind", "image_quality", "merchant", "date", "time", "currency", "items", "adjustments", "subtotal_cents", "gst_cents", "total_cents", "warnings"],
  "properties": {
    "is_receipt": { "type": "boolean", "description": "False if the photos do not show a receipt, bill or bar tab; then return empty items and nulls." },
    "receipt_kind": { "type": "string", "enum": ["printed", "handwritten", "mixed"] },
    "image_quality": { "type": "string", "enum": ["good", "partly_unreadable", "mostly_unreadable"] },
    "merchant": { "type": "string", "description": "Trading name as printed, e.g. 'Four Square Ohakune'. Empty string if unreadable." },
    "date": { "type": ["string", "null"], "format": "date", "description": "ISO 8601 (YYYY-MM-DD). NZ receipts print DD/MM/YYYY: 03/04/2026 is 3 April. Null if absent or unreadable." },
    "time": { "type": ["string", "null"], "description": "24-hour HH:MM, or null." },
    "currency": { "type": "string", "description": "ISO 4217 code. Assume NZD unless the receipt shows otherwise." },
    "items": {
      "type": "array",
      "description": "One entry per purchased line, top to bottom. Do not include subtotal, GST, total, payment, change or loyalty-balance lines.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["description", "quantity", "unit", "unit_price_cents", "line_total_cents", "confidence"],
        "properties": {
          "description": { "type": "string", "description": "Text as printed; expand obvious abbreviations only in brackets, e.g. 'SPEIGHTS 12PK (Speight's 12 pack)'." },
          "quantity": { "type": "number", "description": "Count, or weight/volume for priced-by-measure lines (e.g. 1.234 for 1.234 kg). 1 if not shown." },
          "unit": { "type": "string", "description": "'each', 'kg', 'L', etc." },
          "unit_price_cents": { "type": ["integer", "null"], "description": "GST-inclusive price per unit in cents, or null if not printed." },
          "line_total_cents": { "type": "integer", "description": "GST-inclusive amount charged for this line in cents, after any discount printed directly under it. Negative for a refund or returned item." },
          "confidence": { "type": "string", "enum": ["high", "medium", "low"] }
        }
      }
    },
    "adjustments": {
      "type": "array",
      "description": "Receipt-level amounts that are not Items: whole-receipt discounts, card or public-holiday surcharges, tips, service charges, cash rounding.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["kind", "description", "amount_cents"],
        "properties": {
          "kind": { "type": "string", "enum": ["discount", "surcharge", "tip", "service_charge", "rounding", "other"] },
          "description": { "type": "string" },
          "amount_cents": { "type": "integer", "description": "Signed: negative for discounts, positive for surcharges, tips and charges." }
        }
      }
    },
    "subtotal_cents": { "type": ["integer", "null"], "description": "Printed subtotal, or null if none is printed." },
    "gst_cents": { "type": ["integer", "null"], "description": "Printed 'GST included' amount, or null. Prices are already GST-inclusive; never add this to the total." },
    "total_cents": { "type": ["integer", "null"], "description": "Printed amount due/paid (incl. GST, surcharges and tip), or null if none is printed." },
    "warnings": { "type": "array", "items": { "type": "string" }, "description": "Short notes for the person checking the result, e.g. 'Line 4 price smudged', 'Items do not add up to total by $2.00'." }
  }
}
```

Mapping to the domain:

* Each `items[]` entry becomes an **Item** on the **Receipt**, unassigned to
  Members until someone assigns it.
* How `adjustments` split across Members is an App rule, not a model question.
  The obvious default is proportional to each Member's share of the Items.
  A tip or rounding split evenly is the alternative; this needs deciding in the
  domain model.

Things to verify in the spike, since the docs don't settle them:

* that `"format": "date"` combined with a `["string","null"]` type compiles
  (both are listed as supported [4])
* the real output token counts behind the cost table

---

## 8. Open questions for the team

1. Which edge platform? This decides the wall-clock limit (section 5) and
   where the image hashes and rate-limit counters live.
2. How should receipt-level adjustments split across Members? (Proportional
   vs even.)
3. Are the original photos kept, so a Member can check a line later? If so,
   the stored copy is the downscaled JPEG, not the original.

## 9. How to confirm the recommendation (cheap eval)

Collect ~30 real receipts from past trips:

* supermarket (including weighed produce)
* café with public-holiday surcharge
* bottle store
* fuel
* a long Countdown/Woolworths docket
* 3–4 handwritten bar tabs
* a few crumpled ones

Hand-label the totals and line totals. Run each through Sonnet 5.5 `low`,
Sonnet 5.5 `medium` and Opus 5.5 `medium`, and compare:

* sum-check pass rate
* exact-match rate on `total_cents` and per-Item `line_total_cents`
* p50/p95 latency
* `usage`-derived cost

At ~$0.04–0.10 per call that is under US$10. Choose the cheapest
configuration whose pass rate the team accepts.

---

## Sources (all accessed 2026-10-07)

1. Anthropic, *Models overview*. <https://platform.claude.com/docs/en/about-claude/models/overview>
2. Anthropic, *Claude Sonnet 5.5* (model page). <https://platform.claude.com/docs/en/models/sonnet-5-5/overview>
3. Anthropic, *Vision*: image limits, formats, resolution tiers, token cost, quality guidance, limitations. <https://platform.claude.com/docs/en/build-with-claude/vision>
4. Anthropic, *Structured outputs*: supported models, JSON Schema limitations, complexity limits, grammar caching, invalid outputs, feature compatibility. <https://platform.claude.com/docs/en/build-with-claude/structured-outputs>
5. Anthropic, *Coordinates and bounding boxes*: "How Claude resizes and pads images" and the `resizedSize` reference implementation. <https://platform.claude.com/docs/en/build-with-claude/vision-coordinates>
6. Anthropic, *Effort*: recommended effort levels for Claude Sonnet 5.5 and Claude Opus 5.5; best practices. <https://platform.claude.com/docs/en/build-with-claude/effort>
7. Anthropic, *Claude Opus 5.5* (model page). <https://platform.claude.com/docs/en/models/opus-5-5/overview>
8. Anthropic, *Pricing*: model, batch and cache pricing. <https://platform.claude.com/docs/en/about-claude/pricing>
9. Anthropic, *Thinking*: billing of thinking tokens, `display` defaults. <https://platform.claude.com/docs/en/build-with-claude/thinking>
10. Anthropic, *Batch processing*. <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
11. Anthropic, *Prompt caching*: minimum cacheable prompt lengths. <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
12. Anthropic, *What's new in Claude Sonnet 5.5*: `between_tools`, forced tool use, effort recalibration. <https://platform.claude.com/docs/en/models/sonnet-5-5/whats-new-sonnet-5-5>
13. Anthropic, *Prompting best practices*: "Improved vision capabilities" and the crop tool. <https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices>
14. Anthropic, *API overview*: authentication headers, request size limits, workspaces. <https://platform.claude.com/docs/en/api/overview>
15. Anthropic, *Claude API errors*: 400, 413, 429, 529. <https://platform.claude.com/docs/en/api/errors>
16. Anthropic, *Reducing latency*. <https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency>
17. Anthropic, *Streaming messages*. <https://platform.claude.com/docs/en/build-with-claude/streaming>
18. Anthropic, *Authentication*: API keys, key hygiene, expiration, App Attest. <https://platform.claude.com/docs/en/manage-claude/authentication>
19. Anthropic, *Rate limits*: spend limits, workspace limits. <https://platform.claude.com/docs/en/api/rate-limits>
20. Anthropic, *Refusals and fallback*. <https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback>

Non-Anthropic facts are labelled where used and should be checked separately:

* NZ GST and receipt conventions
* browser APIs (`createImageBitmap`, `canvas.toBlob`)
* edge-platform limits

Cost and latency figures marked "estimate" are derived from the sourced prices
and token formulas plus the stated assumptions. They are not measured.
