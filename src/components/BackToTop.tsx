import React, { useEffect, useState } from 'react'

export default function BackToTop() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <a href="#hero" className={'btn back-to-top' + (on ? ' is-on' : '')} aria-label="Back to top">
      ↑ Top
    </a>
  )
}
