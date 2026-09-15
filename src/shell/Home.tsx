import { registry } from './registry'
import { navigate } from './router'

/**
 * Home — the App picker. A tile per Registry entry, tinted with that App's
 * accent so the grid previews each App's identity rather than flattening them.
 */
export default function Home() {
  return (
    <div className="shell-home">
      <header className="shell-home__head">
        <h1 className="shell-home__title">Find</h1>
        <p className="shell-home__tagline">
          {registry.length} {registry.length === 1 ? 'app' : 'apps'} on this
          workbench
        </p>
      </header>

      <div className="shell-grid">
        {registry.map((app) => (
          <button
            key={app.id}
            type="button"
            className="shell-tile"
            style={{ '--tile-accent': app.accent } as React.CSSProperties}
            onClick={() => navigate(app.id)}
          >
            <span className="shell-tile__icon">
              <app.icon />
            </span>
            <span className="shell-tile__name">{app.name}</span>
            <span className="shell-tile__desc">{app.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
