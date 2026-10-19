import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem('theme')
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

function trySaveTheme(theme: Theme) {
  try {
    localStorage.setItem('theme', theme)
  } catch {}
}

const systemTheme = (): Theme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => savedTheme() ?? systemTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return {
    theme,
    toggle() {
      const next = theme === 'dark' ? 'light' : 'dark'
      setTheme(next)
      trySaveTheme(next)
    },
  }
}
