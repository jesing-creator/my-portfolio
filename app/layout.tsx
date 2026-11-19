import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource/dm-mono/300.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './globals.css'
import MotionRoot from '@/components/MotionRoot'
import Nav from '@/components/Nav'
import Cursor from '@/components/Cursor'
import GlassLayer from '@/components/glass/GlassLayer'
import { site } from '@/lib/site'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} (JC), design for a more connected world`, template: `%s, ${site.name}` },
  description: `${site.role}. ${site.intro.join(' ')}`,
}

export const viewport: Viewport = {
  themeColor: '#9db7d5',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionRoot>
          <GlassLayer />
          <Nav />
          <Cursor />
          <div className="relative z-10">{children}</div>
        </MotionRoot>
      </body>
    </html>
  )
}
