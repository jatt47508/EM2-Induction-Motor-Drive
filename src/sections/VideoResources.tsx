import React from 'react'
import { CONFIG } from '../config'

export default function VideoResources() {
  const v = CONFIG.video
  return (
    <div>
      <h2>Learning resources</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '900px' }}>
        An optional video explaining the operating principle of a three-phase induction motor. Audio is never
        autoplayed — press play when you want it.
      </p>

      <div className="grid-2" style={{ marginTop: '1rem', alignItems: 'stretch' }}>
        <div className="video-frame">
          {v.embedUrl ? (
            <iframe
              src={v.embedUrl}
              title={v.title}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="video-fallback">
              <div>
                <h3 style={{ marginBottom: '0.4rem' }}>{v.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                  No video is embedded by default. Open a curated search on {v.source} to choose a suitable video, or add
                  an embed URL in <code>src/config.ts</code>.
                </p>
                <a className="btn" href={v.fallbackUrl} target="_blank" rel="noopener">Search on {v.source}</a>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.1rem' }}>{v.title}</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
            Source: {v.source}. Playback controls, captions, and full-screen are provided by the player. If the embed is
            blocked by your network or privacy settings, use the fallback link.
          </p>
          <a className="btn" href={v.fallbackUrl} target="_blank" rel="noopener">Open fallback link</a>
        </div>
      </div>
    </div>
  )
}
