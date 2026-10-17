import React, { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const total = h.scrollHeight - h.clientHeight
      const p = total > 0 ? (h.scrollTop / total) * 100 : 0
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, height: 3, background: 'linear-gradient(90deg, var(--blue), var(--navy))', width: progress + '%', zIndex: 100, transition: 'width 120ms linear' }} />
  )
}
