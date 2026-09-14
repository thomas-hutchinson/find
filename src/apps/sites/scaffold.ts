/*
 * What a brand-new Site starts as.
 *
 * Not empty. Sites is reachable by anyone who opens the public URL, and a blank
 * editor next to a blank preview is the worst possible first screen for someone
 * who does not already know what the app is. This scaffold is deliberately
 * small enough to read in one screen, and every part of it visibly does
 * something the moment you press Run — so the relationship between the three
 * tabs and the output is obvious without explanation.
 */

export const SCAFFOLD = {
  html: `<h1>Hello</h1>
<p>Edit the markup, styles and script, then press Run.</p>
<button id="go">Count me</button>
<p class="count">Clicks: <span id="n">0</span></p>
`,
  css: `body {
  margin: 0;
  padding: 2rem 1.25rem;
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  color: #16202b;
  background: #f6f8fa;
}

h1 {
  margin: 0 0 0.25rem;
  font-size: 2rem;
  letter-spacing: -0.02em;
}

button {
  margin-top: 0.5rem;
  padding: 0.6rem 1.1rem;
  font: inherit;
  color: #fff;
  background: #2f6f4f;
  border: none;
  border-radius: 8px;
}

.count {
  color: #5a6b7b;
}
`,
  js: `let n = 0
document.getElementById('go').addEventListener('click', () => {
  n += 1
  document.getElementById('n').textContent = String(n)
})
`,
}
