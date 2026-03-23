/**
 * Settings Page
 */

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAppStore } from '@/lib/store';
import { authApi } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { token, user, setAuth, clearAuth } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { token, user } = await authApi.login(
        loginData.username,
        loginData.password
      );
      setAuth(token, user);
      setLoginData({ username: '', password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authApi.register(registerData);
      // Auto-login after registration
      const { token, user } = await authApi.login(
        registerData.username,
        registerData.password
      );
      setAuth(token, user);
      setRegisterData({ username: '', email: '', password: '' });
      setShowRegister(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Quantum-N3BULA | Settings</title>
      </Head>

      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-nebula-400">
            Manage your account and application settings.
          </p>
        </div>

        {/* User Section */}
        <div className="bg-nebula-900/50 rounded-xl p-6 border border-nebula-800">
          <h2 className="text-lg font-semibold mb-4">Account</h2>

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-nebula-700 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-lg">{user.username}</p>
                  <p className="text-nebula-400">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-nebula-600 px-2 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-nebula-700" />

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 border border-red-600/50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/50">
                  {error}
                </div>
              )}

              {!showRegister ? (
                <>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm text-nebula-400 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={loginData.username}
                        onChange={(e) =>
                          setLoginData({ ...loginData, username: e.target.value })
                        }
                        className="w-full bg-nebula-950 border border-nebula-700 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-nebula-400 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                        className="w-full bg-nebula-950 border border-nebula-700 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-4 py-2 bg-nebula-600 rounded-lg hover:bg-nebula-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>

                  <p className="text-center text-sm text-nebula-400">
                    {"Don't have an account? "}
                    <button
                      onClick={() => setShowRegister(true)}
                      className="text-nebula-300 hover:underline"
                    >
                      Register
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm text-nebula-400 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={registerData.username}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            username: e.target.value,
                          })
                        }
                        className="w-full bg-nebula-950 border border-nebula-700 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-nebula-400 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-nebula-950 border border-nebula-700 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-nebula-400 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="w-full bg-nebula-950 border border-nebula-700 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Creating account...' : 'Register'}
                    </button>
                  </form>

                  <p className="text-center text-sm text-nebula-400">
                    Already have an account?{' '}
                    <button
                      onClick={() => setShowRegister(false)}
                      className="text-nebula-300 hover:underline"
                    >
                      Login
                    </button>
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* API Configuration */}
        <div className="bg-nebula-900/50 rounded-xl p-6 border border-nebula-800">
          <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-nebula-400">API URL:</span>
              <code className="text-nebula-300">
                {process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:18080'}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-nebula-400">WebSocket URL:</span>
              <code className="text-nebula-300">
                {process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:18080/ws'}
              </code>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-nebula-900/50 rounded-xl p-6 border border-nebula-800">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="space-y-2 text-sm text-nebula-400">
            <p>
              <strong className="text-white">Quantum-N3BULA</strong> is a modular
              AI-ops platform for managing and monitoring AI agents.
            </p>
            <p>Version: 1.0.0</p>
            <p>Built with FastAPI + Next.js + TailwindCSS</p>
          </div>
        </div>
      </div>
    </>
  );
}
