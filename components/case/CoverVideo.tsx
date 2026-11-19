'use client'
import { useRef, useState } from 'react'

/** Cover film: autoplays muted and loops (so it works everywhere), with a sound toggle and pause. */
export default function CoverVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)

  const toggleSound = () => {
    const v = ref.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted && v.paused) v.play().catch(() => {})
  }
  const togglePlay = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  return (
    <div className="relative bg-black">
      <video
        ref={ref}
        className="block aspect-video w-full object-cover"
        src={src}
        poster={poster}
        aria-label={label}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="absolute bottom-3 right-3 flex gap-2 md:bottom-5 md:right-5">
        <button type="button" onClick={togglePlay} className="tele rounded-full bg-white/90 px-3.5 py-2 text-bone backdrop-blur" aria-label={playing ? 'Pause film' : 'Play film'}>
          {playing ? 'pause' : 'play'}
        </button>
        <button type="button" onClick={toggleSound} className="tele rounded-full bg-neon px-3.5 py-2 text-bone" aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
          {muted ? 'sound on' : 'sound off'}
        </button>
      </div>
    </div>
  )
}
