import { act, renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'

const systemPrefers = (dark: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: dark }) as unknown as typeof window.matchMedia
}

beforeEach(() => localStorage.clear())
afterEach(() => vi.restoreAllMocks())

test('defaults to system preference', () => {
  systemPrefers(true)
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('dark')
  expect(document.documentElement.dataset.theme).toBe('dark')
})

test('stored choice wins', () => {
  systemPrefers(true)
  localStorage.setItem('theme', 'light')
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('light')
})

test('toggle flips and saves', () => {
  systemPrefers(true)
  const { result } = renderHook(() => useTheme())
  act(() => result.current.toggle())
  expect(result.current.theme).toBe('light')
  expect(localStorage.getItem('theme')).toBe('light')
  expect(document.documentElement.dataset.theme).toBe('light')
})

test('works when localStorage throws', () => {
  systemPrefers(false)
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('light')
  expect(() => act(() => result.current.toggle())).not.toThrow()
  expect(result.current.theme).toBe('dark')
})
