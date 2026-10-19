import { act, renderHook } from '@testing-library/react'
import { useMachine } from './useMachine'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const setup = (code: string, input = '') =>
  renderHook(({ code, input }) => useMachine(code, input), { initialProps: { code, input } })

test('loads code while editing', () => {
  const { result, rerender } = setup('+')
  rerender({ code: '++-', input: '' })
  expect(result.current.machine.code).toBe('++-')
})

test('step advances one instruction', () => {
  const { result } = setup('+++')
  act(() => result.current.step())
  expect(result.current.machine.steps).toBe(1)
  expect(result.current.editing).toBe(false)
})

test('run advances on the timer', () => {
  const { result } = setup('+[]')
  act(() => result.current.run())
  act(() => vi.advanceTimersByTime(70 * 3))
  expect(result.current.machine.steps).toBe(3)
  expect(result.current.running).toBe(true)
})

test('pause stops', () => {
  const { result } = setup('+[]')
  act(() => result.current.run())
  act(() => vi.advanceTimersByTime(70))
  act(() => result.current.pause())
  const steps = result.current.machine.steps
  act(() => vi.advanceTimersByTime(1000))
  expect(result.current.machine.steps).toBe(steps)
  expect(result.current.running).toBe(false)
})

test('stops by itself when done', () => {
  const { result } = setup('++')
  act(() => result.current.run())
  act(() => vi.advanceTimersByTime(1000))
  expect(result.current.running).toBe(false)
  expect(result.current.machine.halt).toBe('done')
  expect(vi.getTimerCount()).toBe(0)
})

test('speed change while running keeps one timer', () => {
  const { result } = setup('+[]')
  act(() => result.current.run())
  act(() => result.current.setSpeed(10))
  expect(vi.getTimerCount()).toBe(1)
  const steps = result.current.machine.steps
  act(() => vi.advanceTimersByTime(16))
  expect(result.current.machine.steps).toBe(steps + 500)
})

test('reset returns to the loaded state', () => {
  const { result } = setup('+++')
  act(() => result.current.step())
  act(() => result.current.step())
  act(() => result.current.reset())
  expect(result.current.machine.steps).toBe(0)
  expect(result.current.editing).toBe(true)
  expect(result.current.running).toBe(false)
})

test('run and step do nothing when halted', () => {
  const { result } = setup('+[')
  act(() => result.current.run())
  expect(result.current.running).toBe(false)
  act(() => result.current.step())
  expect(result.current.machine.steps).toBe(0)
})

test('clears the timer on unmount', () => {
  const { result, unmount } = setup('+[]')
  act(() => result.current.run())
  unmount()
  expect(vi.getTimerCount()).toBe(0)
})

test('editing after a halt at step 0 stays in edit mode', () => {
  for (const code of ['', '<+']) {
    const { result, rerender } = setup(code)
    act(() => result.current.run())
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.machine.halt).not.toBeNull()
    rerender({ code: '+[]', input: '' })
    expect(result.current.running).toBe(false)
    expect(result.current.editing).toBe(true)
  }
})
