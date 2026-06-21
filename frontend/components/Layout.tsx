/**
 * Layout component with navigation
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppStore } from '@/lib/store';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/', label: 'Overview', icon: '📊' },
  { href: '/logs', label: 'Logs', icon: '📜' },
  { href: '/agents', label: 'Agents', icon: '🤖' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, wsConnected, clearAuth } = useAppStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-nebula-950/80 border-b border-nebula-800 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold glow-text">
              ⚛️ Quantum-N3BULA
            </Link>
            <span className="text-xs text-nebula-400">AI-Ops Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`w-2 h-2 rounded-full ${
                wsConnected ? 'status-active' : 'status-inactive'
              }`}
              title={wsConnected ? 'Connected' : 'Disconnected'}
            />
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-nebula-300">👤 {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/settings"
                className="text-sm text-nebula-400 hover:text-nebula-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <nav className="w-56 bg-nebula-950/50 border-r border-nebula-800 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    router.pathname === item.href
                      ? 'bg-nebula-600 text-white'
                      : 'text-nebula-300 hover:bg-nebula-800/50 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-nebula-950/80 border-t border-nebula-800 py-3 text-center text-sm text-nebula-500">
        Quantum-N3BULA v1.0.0 • Built with FastAPI + Next.js
      </footer>
    </div>
  );
}
