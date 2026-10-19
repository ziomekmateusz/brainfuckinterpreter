# Brainfuck Debugger

A Brainfuck interpreter and step-by-step debugger that runs in the browser. Write or pick a program, then run it, pause it or step through it one instruction at a time and watch the memory tape change.

**Try it:** https://ziomekmateusz.github.io/brainfuckinterpreter/

## Features

- Run, pause, step and reset, with an adjustable speed (from one instruction at a time up to 500 per frame)
- Live memory view: the cells around the pointer with value, character and a 0–255 bar; the current and last written cells are highlighted
- Program trace with the current instruction highlighted
- Clear errors for unbalanced brackets and for moving the pointer off the tape
- Example programs, a commands reference, light and dark themes

## Interpreter semantics

- 30,000 cells of 8 bits; values wrap (255 + 1 = 0, 0 − 1 = 255)
- Moving left of cell 0 or right of cell 29,999 stops the program with an error
- `,` reads the next input character (its low byte); once the input is used up it writes 0
- Any character other than the eight commands is ignored

## Development

```bash
npm install
npm run dev     # start the dev server
npm test        # run the tests (Vitest)
npm run build   # production build in dist/
```

Built with React 19, TypeScript, Vite and Tailwind CSS. Deployed to GitHub Pages by GitHub Actions on every push to `main`.

## History

The original 2020 version (Create React App + Material-UI) is preserved under the tag [`v0.1.0`](https://github.com/ziomekmateusz/brainfuckinterpreter/tree/v0.1.0).

## License

See [LICENSE.md](LICENSE.md).
