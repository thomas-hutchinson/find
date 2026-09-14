import { useState } from 'react'
import type { Site, StorageMode } from '../store'

/*
 * The Site list: everything you can do without opening a Site.
 *
 * Deletion gets a confirm that names the Site, because this is user-authored
 * content with no backup and no undo — "Are you sure?" is a prompt people tap
 * through reflexively, "Delete Untitled site?" is one they actually read.
 */

interface Props {
  sites: Site[]
  storage: StorageMode
  onOpen: (id: string) => void
  onCreate: () => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

function when(ts: number): string {
  const mins = Math.round((Date.now() - ts) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(ts).toLocaleDateString()
}

export function SiteList({ sites, storage, onOpen, onCreate, onRename, onDelete }: Props) {
  const [confirming, setConfirming] = useState<Site | null>(null)
  const [renaming, setRenaming] = useState<Site | null>(null)
  const [draft, setDraft] = useState('')

  const startRename = (site: Site) => {
    setRenaming(site)
    setDraft(site.name)
  }

  const commitRename = () => {
    if (renaming) onRename(renaming.id, draft.trim() || 'Untitled site')
    setRenaming(null)
  }

  return (
    <div className="st-list">
      <header className="st-list__head">
        <h1 className="st-list__title">Sites</h1>
        <p className="st-list__sub">
          Write a small web page, run it, keep it on this device.
        </p>
      </header>

      {storage === 'memory' && (
        <p className="st-warn" role="alert">
          Your browser is blocking storage, so nothing here will be saved. Copy
          anything you want to keep, or download it before you leave.
        </p>
      )}

      <button type="button" className="st-new" onClick={onCreate}>
        + New site
      </button>

      {sites.length === 0 && storage !== 'loading' && (
        <p className="st-list__empty">
          No sites yet. Make one — it starts with a working page you can edit.
        </p>
      )}

      <ul className="st-cards">
        {sites.map((site) => (
          <li key={site.id} className="st-card">
            <button type="button" className="st-card__open" onClick={() => onOpen(site.id)}>
              <span className="st-card__name">{site.name}</span>
              <span className="st-card__meta">Edited {when(site.updatedAt)}</span>
            </button>
            <div className="st-card__actions">
              <button type="button" onClick={() => startRename(site)} aria-label={`Rename ${site.name}`}>
                Rename
              </button>
              <button
                type="button"
                className="st-card__danger"
                onClick={() => setConfirming(site)}
                aria-label={`Delete ${site.name}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {renaming && (
        <div className="st-modal" role="dialog" aria-label="Rename site">
          <div className="st-modal__panel">
            <h2>Rename site</h2>
            <input
              className="st-modal__input"
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') setRenaming(null)
              }}
              aria-label="Site name"
            />
            <div className="st-modal__row">
              <button type="button" onClick={() => setRenaming(null)}>
                Cancel
              </button>
              <button type="button" className="st-modal__go" onClick={commitRename}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {confirming && (
        <div className="st-modal" role="dialog" aria-label="Confirm delete">
          <div className="st-modal__panel">
            <h2>Delete “{confirming.name}”?</h2>
            <p className="st-modal__note">
              This site is only on this device. Deleting it cannot be undone.
            </p>
            <div className="st-modal__row">
              <button type="button" onClick={() => setConfirming(null)}>
                Keep it
              </button>
              <button
                type="button"
                className="st-modal__danger"
                onClick={() => {
                  onDelete(confirming.id)
                  setConfirming(null)
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
