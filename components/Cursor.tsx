'use client'

import { useEffect } from 'react'
import { startCursor } from '@/lib/cursor'

/** Mounts the metallic-glass sphere cursor (see lib/cursor.ts). Renders nothing itself. */
export default function Cursor() {
  useEffect(() => startCursor(), [])
  return null
}
