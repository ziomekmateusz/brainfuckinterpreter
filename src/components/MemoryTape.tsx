import { TAPE_SIZE, type Machine } from '../interpreter/machine'
import { visibleRange } from './visibleRange'

const SPACE = 32
const LAST_PRINTABLE = 126

const cellChar = (value: number) =>
  value === SPACE ? '␠' : value > SPACE && value <= LAST_PRINTABLE ? String.fromCharCode(value) : '·'

export default function MemoryTape({ machine }: { machine: Machine }) {
  const { from, to } = visibleRange(machine.ptr)
  const cellIndexes = Array.from({ length: to - from + 1 }, (_, offset) => from + offset)
  return (
    <section aria-label="Memory" className="flex flex-col gap-3 rounded-[10px] border border-border bg-panel p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-[13px] font-semibold uppercase tracking-[.08em] text-muted">Memory</h2>
        <span className="text-[13px] text-muted">
          cells {from}–{to} of {TAPE_SIZE.toLocaleString('en')} · 8-bit, wraps at 255
        </span>
      </div>
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2 p-0">
        {cellIndexes.map((cellIndex) => {
          const value = machine.tape[cellIndex]
          const isPointer = cellIndex === machine.ptr
          const isLastWritten = cellIndex === machine.lastWrite && !isPointer
          const frame = isPointer ? 'border-accent bg-accent/12' : isLastWritten ? 'border-written bg-cell' : 'border-border bg-cell'
          return (
            <li key={cellIndex} aria-current={isPointer ? 'true' : undefined}
              className={`flex flex-col items-center gap-0.5 rounded-lg border px-1.5 pt-2 pb-1.5 font-mono ${frame}`}>
              <span className="text-[11px] text-muted">#{cellIndex}</span>
              <span className={`text-xl font-semibold ${value ? 'text-text' : 'text-muted'}`}>{value}</span>
              <span className="h-4 text-xs text-muted">{cellChar(value)}</span>
              <span className="h-1 w-full overflow-hidden rounded-sm bg-border" aria-hidden="true">
                <span className={`block h-1 ${isPointer ? 'bg-accent' : 'bg-muted'}`} style={{ width: `${(value / 255) * 100}%` }} />
              </span>
              {isPointer && <span className="text-[11px] font-semibold text-accent">▲ ptr</span>}
            </li>
          )
        })}
      </ol>
      <div className="flex flex-wrap gap-4 text-[13px] text-muted">
        <span><span className="mr-1 inline-block size-2.5 rounded-sm border-2 border-accent align-[-1px]" aria-hidden="true" />current cell</span>
        <span><span className="mr-1 inline-block size-2.5 rounded-sm border-2 border-written align-[-1px]" aria-hidden="true" />last written</span>
      </div>
    </section>
  )
}
