"use client"

import {useEffect} from "react"
import {useTheme} from "next-themes"

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    let raf = 0
    const id = "dynamic-theme-color"

    const run = () => {
      const head = document.head
      if (!head || !head.isConnected) return

      // Remove any pre-existing theme-color meta tags (including media variants) except our managed one.
      head.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((el) => {
        if (el.id !== id && el.parentNode && (el as HTMLMetaElement).isConnected) {
          el.parentNode.removeChild(el)
        }
      })

      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const currentTheme = resolvedTheme ?? (prefersDark ? 'dark' : 'light')
      const color = currentTheme === 'dark' ? '#0a0a0a' : '#ffffff'

      let meta = head.querySelector<HTMLMetaElement>(`meta#${id}[name="theme-color"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'theme-color'
        meta.id = id
        head.appendChild(meta)
      } else if (!meta.isConnected) {
        head.appendChild(meta)
      } else if (meta.nextSibling) {
        // Ensure our meta is the last in head to avoid being overridden by later tags.
        head.appendChild(meta)
      }

      meta.setAttribute('content', color)
      // Ensure our managed tag has no media attribute so it always applies.
      meta.removeAttribute('media')
    }

    raf = window.requestAnimationFrame(run)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [resolvedTheme])

  return null
}
