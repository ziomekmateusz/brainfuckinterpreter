export const TAPE_SIZE = 30000
const COMMANDS = '<>+-.,[]'

export const isCommand = (char: string) => COMMANDS.includes(char)

export type Halt = null | 'done' | { error: string }

export interface Machine {
  code: string
  jumps: Int32Array
  tape: Uint8Array
  ptr: number
  ip: number
  input: string
  inPtr: number
  out: string
  steps: number
  lastWrite: number
  halt: Halt
}

function nextCommand(code: string, from: number) {
  let index = from
  while (index < code.length && !isCommand(code[index])) index++
  return index
}

export function load(code: string, input: string): Machine {
  const jumps = new Int32Array(code.length)
  const openBrackets: number[] = []
  let halt: Halt = null
  for (let index = 0; index < code.length && !halt; index++) {
    if (code[index] === '[') openBrackets.push(index)
    else if (code[index] === ']') {
      const open = openBrackets.pop()
      if (open === undefined) halt = { error: `unmatched ] at ${index}` }
      else {
        jumps[open] = index
        jumps[index] = open
      }
    }
  }
  const unclosed = openBrackets.pop()
  if (!halt && unclosed !== undefined) halt = { error: `unmatched [ at ${unclosed}` }
  return {
    code, jumps, tape: new Uint8Array(TAPE_SIZE), ptr: 0, ip: nextCommand(code, 0),
    input, inPtr: 0, out: '', steps: 0, lastWrite: -1, halt,
  }
}

export function run(machine: Machine, maxSteps: number): Machine {
  if (machine.halt !== null) return machine
  const { code, jumps, input } = machine
  const tape = machine.tape.slice()
  let { ptr, ip, inPtr, out, steps, lastWrite } = machine
  let halt: Halt = null
  for (let executed = 0; executed < maxSteps && ip < code.length; executed++) {
    switch (code[ip]) {
      case '>':
        if (ptr === TAPE_SIZE - 1) halt = { error: `pointer moved past cell ${TAPE_SIZE - 1}` }
        else ptr++
        break
      case '<':
        if (ptr === 0) halt = { error: 'pointer moved left of cell 0' }
        else ptr--
        break
      case '+': tape[ptr]++; lastWrite = ptr; break
      case '-': tape[ptr]--; lastWrite = ptr; break
      case '[': if (tape[ptr] === 0) ip = jumps[ip]; break
      case ']': if (tape[ptr] !== 0) ip = jumps[ip]; break
      case '.': out += String.fromCharCode(tape[ptr]); break
      case ',':
        tape[ptr] = inPtr < input.length ? input.charCodeAt(inPtr++) : 0
        lastWrite = ptr
        break
    }
    if (halt) break
    ip = nextCommand(code, ip + 1)
    steps++
  }
  if (!halt && ip >= code.length) halt = 'done'
  return { ...machine, tape, ptr, ip, inPtr, out, steps, lastWrite, halt }
}
