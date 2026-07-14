import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  setAuthTokenGetter,
  useRegisterAccount,
  useLoginAccount,
  useLogoutAccount,
  useGetCurrentAccount,
  getGetCurrentAccountQueryKey,
  useListSaveSlots,
  getListSaveSlotsQueryKey,
  usePutSaveSlot,
  useDeleteSaveSlot,
  type Account,
  type SaveSlot,
} from '@workspace/api-client-react';
import Game from './game/Game';
import { GameStateData } from './game/types';
import { buildInitialState, serializeGameState, summarizeSavedState, SavedGameState } from './game/save';
import './index.css';

const TOKEN_KEY = 'echo-realm-token';
const queryClient = new QueryClient();

let currentToken: string | null = null;
try { currentToken = localStorage.getItem(TOKEN_KEY); } catch { /* storage unavailable */ }
setAuthTokenGetter(() => currentToken);

function setToken(token: string | null) {
  currentToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* storage unavailable */ }
}

type Screen = 'loading' | 'auth' | 'slots' | 'game';

function AppInner() {
  const [screen, setScreen] = useState<Screen>(currentToken ? 'loading' : 'auth');
  const [account, setAccount] = useState<Account | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [initialState, setInitialState] = useState<GameStateData | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const meQuery = useGetCurrentAccount({ query: { queryKey: getGetCurrentAccountQueryKey(), enabled: screen === 'loading', retry: false } });
  const registerMutation = useRegisterAccount();
  const loginMutation = useLoginAccount();
  const logoutMutation = useLogoutAccount();
  const slotsQuery = useListSaveSlots({ query: { queryKey: getListSaveSlotsQueryKey(), enabled: screen === 'slots' && !isGuest } });
  const putSlotMutation = usePutSaveSlot();
  const deleteSlotMutation = useDeleteSaveSlot();

  useEffect(() => {
    if (screen !== 'loading') return;
    if (meQuery.data) {
      setAccount(meQuery.data);
      setIsGuest(false);
      setScreen('slots');
    } else if (meQuery.isError) {
      setToken(null);
      setScreen('auth');
    }
  }, [screen, meQuery.data, meQuery.isError]);

  const submitAuth = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const mutation = authMode === 'login' ? loginMutation : registerMutation;
    mutation.mutate({ data: { username, password } }, {
      onSuccess: (session) => {
        setToken(session.token);
        setAccount(session.account);
        setIsGuest(false);
        setScreen('slots');
      },
      onError: (err: any) => setAuthError(err?.message || 'Something went wrong.'),
    });
  }, [authMode, username, password, loginMutation, registerMutation]);

  const playAsGuest = useCallback(() => {
    setIsGuest(true);
    setAccount(null);
    setActiveSlot(null);
    setInitialState(buildInitialState(null, true));
    setScreen('game');
  }, []);

  const logout = useCallback(() => {
    logoutMutation.mutate(undefined, { onSettled: () => {
      setToken(null);
      setAccount(null);
      setUsername(''); setPassword('');
      setScreen('auth');
    } });
  }, [logoutMutation]);

  const startSlot = useCallback((slot: number, saved: SaveSlot | undefined) => {
    setActiveSlot(slot);
    const savedState = saved ? (saved.state as unknown as SavedGameState) : null;
    setInitialState(buildInitialState(savedState, false));
    setScreen('game');
  }, []);

  const deleteSlot = useCallback((slot: number) => {
    deleteSlotMutation.mutate({ slot }, { onSuccess: () => slotsQuery.refetch() });
  }, [deleteSlotMutation, slotsQuery]);

  const onSave = useCallback(async (state: GameStateData) => {
    if (isGuest || !activeSlot) return;
    const saved = serializeGameState(state);
    await putSlotMutation.mutateAsync({
      slot: activeSlot,
      data: { name: `Slot ${activeSlot}`, summary: summarizeSavedState(saved), state: saved as unknown as Record<string, unknown> },
    });
  }, [isGuest, activeSlot, putSlotMutation]);

  const onExit = useCallback(() => {
    setInitialState(null);
    setActiveSlot(null);
    if (isGuest) { setIsGuest(false); setScreen('auth'); }
    else { setScreen('slots'); slotsQuery.refetch(); }
  }, [isGuest, slotsQuery]);

  const slotsByNumber = useMemo(() => {
    const map = new Map<number, SaveSlot>();
    (slotsQuery.data || []).forEach(s => map.set(s.slot, s));
    return map;
  }, [slotsQuery.data]);

  if (screen === 'loading') {
    return <Centered><p className="text-purple-300 font-mono">Loading...</p></Centered>;
  }

  if (screen === 'auth') {
    return (
      <Centered>
        <div className="w-full max-w-sm bg-[#180a28] border-2 border-[#3a205e] rounded-lg p-8 font-mono text-purple-100">
          <h1 className="text-2xl mb-1 text-center tracking-widest text-purple-200">ECHO REALM</h1>
          <p className="text-center text-xs text-purple-400 mb-6">Sign in to save your progress across devices</p>
          <form onSubmit={submitAuth} className="space-y-3">
            <input
              value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required minLength={3} maxLength={32}
              className="w-full bg-[#0f0518] border border-[#3a205e] rounded px-3 py-2 text-sm outline-none focus:border-purple-400"
            />
            <input
              value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required minLength={6} maxLength={128}
              className="w-full bg-[#0f0518] border border-[#3a205e] rounded px-3 py-2 text-sm outline-none focus:border-purple-400"
            />
            {authError && <p className="text-red-400 text-xs">{authError}</p>}
            <button
              type="submit" disabled={loginMutation.isPending || registerMutation.isPending}
              className="w-full bg-purple-700 hover:bg-purple-600 rounded py-2 text-sm font-bold tracking-wide disabled:opacity-50"
            >
              {authMode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
          <button
            className="w-full mt-3 text-xs text-purple-400 hover:text-purple-200 underline"
            onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(null); }}
          >
            {authMode === 'login' ? "Need an account? Register" : 'Have an account? Log in'}
          </button>
          <div className="border-t border-[#3a205e] my-4" />
          <button
            className="w-full text-xs text-purple-500 hover:text-purple-300"
            onClick={playAsGuest}
          >
            Play as Guest (progress won't be saved)
          </button>
        </div>
      </Centered>
    );
  }

  if (screen === 'slots') {
    return (
      <Centered>
        <div className="w-full max-w-md bg-[#180a28] border-2 border-[#3a205e] rounded-lg p-8 font-mono text-purple-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg tracking-widest text-purple-200">SELECT SAVE SLOT</h1>
            <button onClick={logout} className="text-xs text-purple-500 hover:text-purple-300">Log out ({account?.username})</button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(slot => {
              const saved = slotsByNumber.get(slot);
              return (
                <div key={slot} className="border border-[#3a205e] rounded p-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-purple-200">Slot {slot}</div>
                    <div className="text-xs text-purple-500">{saved ? saved.summary : 'Empty'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startSlot(slot, saved)}
                      className="bg-purple-700 hover:bg-purple-600 rounded px-3 py-1 text-xs font-bold"
                    >
                      {saved ? 'Continue' : 'New Game'}
                    </button>
                    {saved && (
                      <button
                        onClick={() => deleteSlot(slot)}
                        className="border border-red-800 text-red-400 hover:bg-red-950 rounded px-2 py-1 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Centered>
    );
  }

  if (screen === 'game' && initialState) {
    return <Centered><Game initialState={initialState} onSave={onSave} onExit={onExit} /></Centered>;
  }

  return null;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f0518]">
      {children}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

export default App;
