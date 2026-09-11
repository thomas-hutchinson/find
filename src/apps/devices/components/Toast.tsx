import { useEffect } from 'react'

interface ToastProps {
  message: string | null
  onDone: () => void
}

export function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const id = setTimeout(onDone, 2200)
    return () => clearTimeout(id)
  }, [message, onDone])

  if (!message) return null
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}
