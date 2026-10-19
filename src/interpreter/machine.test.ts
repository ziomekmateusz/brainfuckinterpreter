import { EXAMPLES } from './examples'
import { load, run } from './machine'

const runExample = (name: string) => {
  const example = EXAMPLES.find((candidate) => candidate.name === name)!
  return run(load(example.code, example.input), 1e6)
}

test('keeps the source text as written', () => {
  expect(load('a+b-c', '').code).toBe('a+b-c')
})

test('skips comments without counting them as steps', () => {
  const machine = run(load('a+ b+ c+', ''), 10)
  expect(machine.tape[0]).toBe(3)
  expect(machine.steps).toBe(3)
  expect(machine.halt).toBe('done')
})

test('ip always rests on a command', () => {
  expect(load('ab+', '').ip).toBe(2)
  expect(run(load('+ comment +', ''), 1).ip).toBe(10)
})

test('text without commands finishes in zero steps', () => {
  const machine = run(load('ciao', ''), 10)
  expect(machine.steps).toBe(0)
  expect(machine.halt).toBe('done')
})

test('runs the examples', () => {
  const hello = runExample('Hello World')
  expect(hello.out).toBe('Hello World!\n')
  expect(hello.halt).toBe('done')
  const rev = runExample('Reverse input')
  expect(rev.out).toBe('kcufniarb')
  expect(rev.halt).toBe('done')
  const add = runExample('Add 2 + 5')
  expect(add.tape[0]).toBe(7)
  expect(add.out).toBe('')
  expect(add.halt).toBe('done')
})

test('wraps 8-bit cells', () => {
  expect(run(load('-', ''), 1).tape[0]).toBe(255)
  expect(run(load('-+', ''), 2).tape[0]).toBe(0)
})

test("',' reads input then writes 0", () => {
  const machine = run(load(',>,>,', 'A'), 10)
  expect(machine.tape[0]).toBe(65)
  expect(machine.tape[1]).toBe(0)
  expect(machine.tape[2]).toBe(0)
  expect(machine.inPtr).toBe(1)
})

test("',' truncates non-ASCII to a byte", () => {
  expect(run(load(',', 'è'), 1).tape[0]).toBe(232)
  expect(() => run(load(',', '😀'), 1)).not.toThrow()
})

test('reports unbalanced brackets at load', () => {
  expect(load('+[', '').halt).toEqual({ error: 'unmatched [ at 1' })
  expect(load('+]', '').halt).toEqual({ error: 'unmatched ] at 1' })
})

test('errors moving left of cell 0', () => {
  expect(run(load('<', ''), 1).halt).toEqual({ error: 'pointer moved left of cell 0' })
})

test('errors moving past the last cell', () => {
  const machine = run(load('>'.repeat(30000), ''), 30000)
  expect(machine.halt).toEqual({ error: 'pointer moved past cell 29999' })
  expect(machine.ptr).toBe(29999)
})

test('runs at most n steps', () => {
  const machine = run(load('+++++', ''), 2)
  expect(machine.steps).toBe(2)
  expect(machine.ip).toBe(2)
  expect(machine.tape[0]).toBe(2)
  expect(machine.halt).toBeNull()
})

test('does not mutate its input', () => {
  const machine = load('+', '')
  run(machine, 1)
  expect(machine.tape[0]).toBe(0)
  expect(machine.steps).toBe(0)
})

test('halted machine is returned unchanged', () => {
  const done = run(load('+', ''), 5)
  expect(run(done, 5)).toBe(done)
})

test('tracks lastWrite', () => {
  expect(run(load('>+', ''), 2).lastWrite).toBe(1)
  expect(load('', '').lastWrite).toBe(-1)
})

test('infinite loop stops at n', () => {
  const machine = run(load('+[]', ''), 1000)
  expect(machine.steps).toBe(1000)
  expect(machine.halt).toBeNull()
})

test('bracket error positions refer to the source text', () => {
  expect(load('loop: [', '').halt).toEqual({ error: 'unmatched [ at 6' })
  expect(load('a\n]', '').halt).toEqual({ error: 'unmatched ] at 2' })
})
