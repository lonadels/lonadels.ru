"use client"

import {useEffect} from "react"
import {useTheme} from "next-themes"

export function ThemeColorMeta() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const id = "dynamic-theme-color"

    document.head
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((el) => {
        if (el.id !== id) {
          el.parentElement?.removeChild(el)
        }
      })

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const currentTheme = resolvedTheme ?? (prefersDark ? 'dark' : 'light')
    const color = currentTheme === 'dark' ? '#0a0a0a' : '#ffffff'

    let meta = document.head.querySelector<HTMLMetaElement>(`meta#${id}[name="theme-color"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.id = id
      document.head.appendChild(meta)
    }

    meta.setAttribute('content', color)
  }, [resolvedTheme])

  return null
}
