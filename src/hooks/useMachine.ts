import { useEffect, useRef, useState } from 'react'
import { load, run as runMachine, type Machine } from '../interpreter/machine'

export const SPEEDS: ReadonlyArray<{ interval: number; perTick: number }> = [
  { interval: 600, perTick: 1 },
  { interval: 350, perTick: 1 },
  { interval: 200, perTick: 1 },
  { interval: 120, perTick: 1 },
  { interval: 70, perTick: 1 },
  { interval: 40, perTick: 1 },
  { interval: 16, perTick: 1 },
  { interval: 16, perTick: 5 },
  { interval: 16, perTick: 40 },
  { interval: 16, perTick: 500 },
]

export function useMachine(code: string, input: string) {
  const [machine, setMachine] = useState<Machine>(() => load(code, input))
  const [loaded, setLoaded] = useState({ code, input })
  const [started, setRunning] = useState(false)
  const [speed, setSpeedState] = useState(5)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const running = started && machine.halt === null
  const editing = !running && machine.steps === 0

  if (editing && (loaded.code !== code || loaded.input !== input)) {
    setLoaded({ code, input })
    setMachine(load(code, input))
    setRunning(false)
  }

  const stop = () => {
    if (timer.current !== null) clearInterval(timer.current)
    timer.current = null
  }

  const start = (selectedSpeed: number) => {
    stop()
    const { interval, perTick } = SPEEDS[selectedSpeed - 1]
    timer.current = setInterval(() => setMachine((current) => runMachine(current, perTick)), interval)
  }

  useEffect(() => {
    if (machine.halt !== null) stop()
  }, [machine.halt])

  useEffect(() => stop, [])

  return {
    machine,
    running,
    editing,
    speed,
    setSpeed(selectedSpeed: number) {
      setSpeedState(selectedSpeed)
      if (running) start(selectedSpeed)
    },
    run() {
      if (machine.halt !== null || running) return
      start(speed)
      setRunning(true)
    },
    pause() {
      stop()
      setRunning(false)
    },
    step() {
      if (!running && machine.halt === null) setMachine((current) => runMachine(current, 1))
    },
    reset() {
      stop()
      setRunning(false)
      setLoaded({ code, input })
      setMachine(load(code, input))
    },
  }
}
