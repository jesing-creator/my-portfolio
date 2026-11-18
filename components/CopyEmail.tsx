'use client'

import { useState } from 'react'

/** Copies the address; falls back to selecting it when the clipboard is unavailable. */
export default function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email)
          setDone(true)
          setTimeout(() => setDone(false), 1800)
        } catch {
          window.prompt?.('Copy email', email)
        }
      }}
      className="tele rounded-full border border-bone/40 px-5 py-3 text-bone transition-colors duration-300 hover:bg-[#0a0e14] hover:text-[#e4ff1a]"
    >
      {done ? 'copied ✓' : 'copy address'}
    </button>
  )
}
