const COMMANDS: [string, string][] = [
  ['>', 'Move the pointer one cell to the right.'],
  ['<', 'Move the pointer one cell to the left.'],
  ['+', 'Increase the current cell by one (255 wraps to 0).'],
  ['-', 'Decrease the current cell by one (0 wraps to 255).'],
  ['.', 'Output the current cell as a character.'],
  [',', 'Read one character of input into the current cell (0 when input is used up).'],
  ['[', 'If the current cell is 0, jump past the matching ].'],
  [']', 'If the current cell is not 0, jump back to the matching [.'],
]

export default function CommandsTable() {
  return (
    <details className="rounded-[10px] border border-border bg-panel p-4">
      <summary className="cursor-pointer text-[13px] font-semibold uppercase tracking-[.08em] text-muted">Commands</summary>
      <table className="mt-3 w-full border-collapse text-sm">
        <tbody>
          {COMMANDS.map(([command, meaning]) => (
            <tr key={command} className="border-t border-border">
              <th scope="row" className="w-12 py-2 text-left font-mono text-base text-accent">{command}</th>
              <td className="py-2">{meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}
