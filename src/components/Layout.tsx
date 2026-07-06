import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white text-space-cadet dark:bg-space-cadet dark:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-gray/20 bg-white/95 dark:bg-space-cadet/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-tan rounded-sm flex items-center justify-center">
              <span className="text-space-cadet font-bold text-sm">Φ</span>
            </div>
            <span className="font-bold text-sm hidden sm:inline">Physics</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/quantum">Quantum</NavLink>
            <NavLink to="/black-holes">Black Holes</NavLink>
            <NavLink to="/classical-mechanics">Classical</NavLink>
            <NavLink to="/visual-math">Visual Math</NavLink>
            <NavLink to="/ai-physics">AI × Physics</NavLink>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-slate-gray/10 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-gray/20 bg-slate-gray/5 dark:bg-white/5 py-6">
        <div className="container text-center text-sm text-slate-gray dark:text-slate-gray/70 px-4">
          <p>
            A portfolio of physics simulations and mathematical visualizations.{" "}
            <a href="mailto:contact@example.com" className="text-tan hover:underline">
              Get in touch
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="px-3 py-2 text-sm rounded-md hover:bg-slate-gray/10 dark:hover:bg-white/10 transition-colors">
      {children}
    </Link>
  );
}
