import { visibleRange } from './visibleRange'

test('visibleRange keeps 24 cells inside the tape', () => {
  expect(visibleRange(0)).toEqual({ from: 0, to: 23 })
  expect(visibleRange(20)).toEqual({ from: 9, to: 32 })
  expect(visibleRange(29999)).toEqual({ from: 29976, to: 29999 })
  expect(visibleRange(29990)).toEqual({ from: 29976, to: 29999 })
})
