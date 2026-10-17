import { useEffect, useRef, useState } from 'react'

/**
 * Tracks scroll progress through a tall element and returns:
 *  - progressRef: mutable 0..1 value (updated on every scroll, no re-render)
 *  - index: current segment index (re-renders only when it changes)
 */
export function useElementProgress(segments: number) {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let raf = 0
    const compute = () => {
      const el = targetRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0
      progressRef.current = p
      const idx = Math.min(segments - 1, Math.floor(p * segments))
      setIndex(prev => (prev === idx ? prev : idx))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [segments])

  return { targetRef, progressRef, index }
}
