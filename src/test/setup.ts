import '@testing-library/jest-dom/vitest'

window.matchMedia ??= ((query: string) => ({ matches: false, media: query })) as unknown as typeof window.matchMedia
