import { useState } from 'react'
import CommandsTable from './components/CommandsTable'
import IoPanel from './components/IoPanel'
import MemoryTape from './components/MemoryTape'
import ProgramPanel from './components/ProgramPanel'
import Toolbar from './components/Toolbar'
import { useMachine } from './hooks/useMachine'
import { useTheme } from './hooks/useTheme'
import { EXAMPLES } from './interpreter/examples'

export default function App() {
  const [code, setCode] = useState(EXAMPLES[0].code)
  const [input, setInput] = useState(EXAMPLES[0].input)
  const example = EXAMPLES.findIndex((candidate) => candidate.code === code && candidate.input === input)
  const engine = useMachine(code, input)
  const { theme, toggle } = useTheme()
  const halted = engine.machine.halt !== null

  const pickExample = (index: number) => {
    engine.reset()
    setCode(EXAMPLES[index].code)
    setInput(EXAMPLES[index].input)
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 font-mono text-[22px] font-semibold">
              brainfuck<span className="text-accent">_</span>debugger
            </h1>
            <p className="mt-1 mb-0 text-sm text-muted">Step through a program and watch the memory tape change.</p>
          </div>
          <Toolbar running={engine.running} canRun={!halted} canStep={!halted && !engine.running} speed={engine.speed}
            theme={theme} onRun={engine.run} onPause={engine.pause} onStep={engine.step} onReset={engine.reset}
            onSpeed={engine.setSpeed} onToggleTheme={toggle} />
        </header>
        <main className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <ProgramPanel machine={engine.machine} running={engine.running} editing={engine.editing} code={code}
              onCode={setCode} examples={EXAMPLES} activeExample={example}
              onPickExample={pickExample} />
            <IoPanel machine={engine.machine} editing={engine.editing} input={input} onInput={setInput} />
          </div>
          <MemoryTape machine={engine.machine} />
          <CommandsTable />
        </main>
      </div>
    </div>
  )
}
