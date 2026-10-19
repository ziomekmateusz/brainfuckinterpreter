import type { Machine } from '../interpreter/machine'

interface Props {
  machine: Machine
  editing: boolean
  input: string
  onInput(input: string): void
}

const heading = 'm-0 text-[13px] font-semibold uppercase tracking-[.08em] text-muted'

export default function IoPanel({ machine, editing, input, onInput }: Props) {
  return (
    <section aria-label="Input and output"
      className="flex min-w-0 flex-[1_1_300px] flex-col gap-3 rounded-[10px] border border-border bg-panel p-4">
      <label htmlFor="input" className={heading}>Input</label>
      <input id="input" type="text" value={input} disabled={!editing} onChange={(event) => onInput(event.target.value)}
        className="h-11 rounded-lg border border-border bg-bg px-3 font-mono text-[15px] text-text disabled:opacity-70" />
      <span className="text-[13px] text-muted">
        Read by <code className="font-mono text-text">,</code> one character at a time
        — {Math.max(0, machine.input.length - machine.inPtr)} left
      </span>
      <h2 id="output-label" className={`${heading} mt-2`}>Output</h2>
      <pre aria-labelledby="output-label" aria-live="polite"
        className="m-0 min-h-36 flex-1 rounded-lg border border-border bg-bg p-3 font-mono text-[15px] break-all whitespace-pre-wrap">
        {machine.out}
      </pre>
    </section>
  )
}
