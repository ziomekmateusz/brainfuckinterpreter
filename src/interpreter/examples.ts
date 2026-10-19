export interface Example {
  name: string
  code: string
  input: string
}

export const EXAMPLES: Example[] = [
  {
    name: 'Hello World',
    code: '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.',
    input: '',
  },
  { name: 'Reverse input', code: '>,[>,]<[.<]', input: 'brainfuck' },
  { name: 'Add 2 + 5', code: '++>+++++[<+>-]<', input: '' },
]
