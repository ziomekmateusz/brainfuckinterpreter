import { TAPE_SIZE } from '../interpreter/machine'

export function visibleRange(pointer: number, size = 24, tapeSize = TAPE_SIZE) {
  const cellsBeforePointer = size / 2 - 1
  const from = Math.min(Math.max(pointer - cellsBeforePointer, 0), tapeSize - size)
  return { from, to: from + size - 1 }
}
