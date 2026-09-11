/** Default snippet loaded into the editor so the app has something to visualize on first open. */
export const SAMPLE_CODE = `// A tiny order-processing pipeline. Try tracing "cart".
const taxRate = 0.08
const shippingThreshold = 50
const promo = "SAVE10"

const cart = [
  { id: 1, name: "Notebook", price: 12, qty: 2 },
  { id: 2, name: "Pen", price: 3, qty: 5 },
]

cart.push({ id: 3, name: "Sticker", price: 4, qty: 1 })

let subtotal = 0
for (const item of cart) {
  subtotal += item.price * item.qty
}

if (promo === "SAVE10") {
  subtotal = subtotal * 0.9
}

const shipping = subtotal >= shippingThreshold ? 0 : 8
const tax = subtotal * taxRate
const total = subtotal + shipping + tax

const expensive = cart.filter((i) => i.price > 5)
const names = cart.map((i) => i.name)

cart[0].qty = 3

console.log("total", total, "expensive", expensive.length, "names", names)
`
