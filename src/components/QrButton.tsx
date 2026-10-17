import React, { useEffect, useRef, useState } from 'react'
import { toDataURL } from 'qrcode'

export default function QrButton({ url, label = 'QR', caption = 'Scan to open in phone' }: { url: string; label?: string; caption?: string }) {
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState('')
  const [failed, setFailed] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let cancelled = false
    if (open && !src && !failed) {
      toDataURL(url, { margin: 1, width: 296, color: { dark: '#0b1d3a', light: '#ffffff' } })
        .then(d => { if (!cancelled) setSrc(d) })
        .catch(() => { if (!cancelled) setFailed(true) })
    }
    return () => { cancelled = true }
  }, [open, src, failed, url])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span className="qr-wrap" ref={wrap}>
      <button
        className="btn"
        aria-expanded={open}
        aria-label="Show QR code to open this reference on your phone"
        onClick={() => setOpen(o => !o)}
      >
        {label}
      </button>
      {open && (
        <span className="qr-pop" role="dialog" aria-label="Scan this QR code with your phone">
          <small>{caption}</small>
          {src && !failed && <img src={src} alt="QR code link" />}
          {failed && <span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.8rem', maxWidth: 148 }}>Could not generate QR code.</span>}
          {!src && !failed && <span style={{ display: 'block', width: 148, height: 148, background: 'var(--surface-2)', borderRadius: 6 }} />}
        </span>
      )}
    </span>
  )
}
