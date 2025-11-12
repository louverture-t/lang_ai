import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="relative overflow-hidden"
    >
      {/* Sun icon for light mode */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === 'light'
            ? 'rotate-0 scale-100'
            : 'rotate-90 scale-0'
        }`}
      />

      {/* Moon icon for dark mode */}
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          theme === 'dark'
            ? 'rotate-0 scale-100'
            : '-rotate-90 scale-0'
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
