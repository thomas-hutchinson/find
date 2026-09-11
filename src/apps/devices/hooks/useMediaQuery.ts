import { useEffect, useState } from 'react'

/** Reactive matchMedia hook so JS knows the current layout posture. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True on tablet-and-up, where the side-rail master/detail layout is used. */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 880px)')
}
