import type { Example } from '../interpreter/examples'
import { isCommand, type Machine } from '../interpreter/machine'

interface Props {
  machine: Machine
  running: boolean
  editing: boolean
  code: string
  onCode(code: string): void
  examples: Example[]
  activeExample: number
  onPickExample(index: number): void
}

const heading = 'm-0 text-[13px] font-semibold uppercase tracking-[.08em] text-muted'

function status(machine: Machine, running: boolean): { label: string; color: string } {
  if (machine.halt !== null && machine.halt !== 'done') return { label: `error: ${machine.halt.error}`, color: 'text-error border-error' }
  if (machine.halt === 'done') return { label: 'finished', color: 'text-done border-done' }
  if (running) return { label: 'running', color: 'text-accent border-accent' }
  if (machine.steps > 0) return { label: 'paused', color: 'text-muted border-muted' }
  return { label: 'ready', color: 'text-muted border-muted' }
}

function charColor(char: string, isCurrent: boolean) {
  if (isCurrent) return 'bg-accent text-on-accent'
  if (!isCommand(char)) return 'text-muted'
  return char === '[' || char === ']' ? 'text-bracket' : 'text-text'
}

export default function ProgramPanel({
  machine, running, editing, code, onCode, examples, activeExample, onPickExample,
}: Props) {
  const { label, color } = status(machine, running)
  return (
    <section aria-label="Program"
      className="flex min-w-0 flex-[999_1_560px] flex-col gap-3 rounded-[10px] border border-border bg-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={heading}>Program</h2>
        <div className="flex flex-wrap gap-1.5">
          {examples.map((example, index) => {
            const selected = index === activeExample
            return (
              <button key={example.name} aria-pressed={selected} onClick={() => onPickExample(index)}
                className={`h-11 rounded-full border px-3 text-[13px] sm:h-8 ${selected ? 'border-accent bg-accent/12 text-text' : 'border-border text-muted'}`}>
                {example.name}
              </button>
            )
          })}
        </div>
      </div>

      {editing ? (
        <>
          <p className="m-0 text-[13px] text-muted">
            <label htmlFor="code">Code</label> — anything that is not one of the 8 commands is ignored
          </p>
          <textarea id="code" rows={9} spellCheck={false} value={code} onChange={(event) => onCode(event.target.value)}
            className="w-full resize-y rounded-lg border border-border bg-bg p-3 font-mono text-[15px] leading-relaxed text-text" />
        </>
      ) : (
        <>
          <div aria-label="Program trace"
            className="max-h-64 overflow-auto rounded-lg border border-border bg-bg p-3 font-mono text-[15px] leading-relaxed break-all whitespace-pre-wrap">
            {Array.from(machine.code, (char, index) => {
              const isCurrent = index === machine.ip && machine.halt === null
              return (
                <span key={index} className={`rounded-[3px] ${charColor(char, isCurrent)}`}
                  aria-current={isCurrent ? 'step' : undefined}>
                  {char}
                </span>
              )
            })}
          </div>
          <p className="m-0 text-[13px] text-muted">Debug mode. Press Reset to edit the code again.</p>
        </>
      )}

      <div className="flex flex-wrap items-center gap-4 font-mono text-[13px] text-muted">
        <span>steps <b className="font-semibold text-text">{machine.steps}</b></span>
        <span>ip <b className="font-semibold text-text">{Math.min(machine.ip, machine.code.length)}</b>/{machine.code.length}</span>
        <span>ptr <b className="font-semibold text-text">{machine.ptr}</b></span>
        <span role="status" className={`rounded-full border px-2.5 py-0.5 ${color}`}>{label}</span>
      </div>
    </section>
  )
}
