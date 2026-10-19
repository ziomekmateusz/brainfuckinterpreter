import { act, fireEvent, render, screen } from '@testing-library/react'
import App from './App'

afterEach(() => vi.useRealTimers())

test('renders the title', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('brainfuck_debugger')
})

test('runs Hello World', () => {
  vi.useFakeTimers()
  render(<App />)
  fireEvent.change(screen.getByLabelText('Speed'), { target: { value: '10' } })
  fireEvent.click(screen.getByRole('button', { name: 'Run' }))
  act(() => vi.advanceTimersByTime(1000))
  expect(screen.getByLabelText('Output')).toHaveTextContent('Hello World!')
  expect(screen.getByText('finished')).toBeInTheDocument()
})

test('step enters debug mode', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: 'Step' }))
  expect(screen.queryByLabelText('Code')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Program trace')).toBeInTheDocument()
  expect(screen.getByText('paused')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
  expect(screen.getByLabelText('Code')).toBeInTheDocument()
})

test('stays editable on bracket error', () => {
  render(<App />)
  fireEvent.change(screen.getByLabelText('Code'), { target: { value: '[' } })
  expect(screen.getByText(/unmatched \[/)).toBeInTheDocument()
  expect(screen.getByLabelText('Code')).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()
})

test('theme toggle', () => {
  render(<App />)
  const before = document.documentElement.dataset.theme
  fireEvent.click(screen.getByRole('button', { name: /switch to (light|dark) theme/i }))
  expect(document.documentElement.dataset.theme).not.toBe(before)
})

test('editing the input deselects the example', () => {
  render(<App />)
  const reverse = screen.getByRole('button', { name: 'Reverse input' })
  fireEvent.click(reverse)
  expect(reverse).toHaveAttribute('aria-pressed', 'true')
  fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'hello' } })
  expect(reverse).toHaveAttribute('aria-pressed', 'false')
})
