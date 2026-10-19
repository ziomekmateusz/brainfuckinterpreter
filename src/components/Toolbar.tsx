import type { Theme } from '../hooks/useTheme'

interface Props {
  running: boolean
  canRun: boolean
  canStep: boolean
  speed: number
  theme: Theme
  onRun(): void
  onPause(): void
  onStep(): void
  onReset(): void
  onSpeed(speed: number): void
  onToggleTheme(): void
}

const base =
  'inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45'
const primary = `${base} bg-accent font-semibold text-on-accent`
const secondary = `${base} border border-border bg-panel text-text`

const Icon = ({ path }: { path: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={path} />
  </svg>
)

export default function Toolbar({
  running, canRun, canStep, speed, theme, onRun, onPause, onStep, onReset, onSpeed, onToggleTheme,
}: Props) {
  const otherTheme = theme === 'dark' ? 'light' : 'dark'
  return (
    <div className="flex flex-wrap items-center gap-2">
      {running ? (
        <button className={primary} onClick={onPause}><Icon path="M8 5v14M16 5v14" />Pause</button>
      ) : (
        <button className={primary} onClick={onRun} disabled={!canRun}><Icon path="M7 4l13 8-13 8z" />Run</button>
      )}
      <button className={secondary} onClick={onStep} disabled={!canStep}><Icon path="M5 5l9 7-9 7zM19 5v14" />Step</button>
      <button className={secondary} onClick={onReset}><Icon path="M4 12a8 8 0 1 0 3-6.2M4 4v5h5" />Reset</button>
      <label className="ml-2 inline-flex items-center gap-2 text-sm text-muted">
        Speed
        <input type="range" min={1} max={10} step={1} value={speed}
          onChange={(event) => onSpeed(Number(event.target.value))} className="h-11 w-28" />
      </label>
      <button className={`${secondary} w-11 justify-center px-0`} onClick={onToggleTheme}
        aria-label={`Switch to ${otherTheme} theme`} title={`Switch to ${otherTheme} theme`}>
        {theme === 'dark'
          ? <Icon path="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
          : <Icon path="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />}
      </button>
    </div>
  )
}
