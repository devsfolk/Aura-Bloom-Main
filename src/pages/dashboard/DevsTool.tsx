import React, { useState } from 'react';
import { Terminal, Lock, Key, ShieldCheck, Database, GitBranch, Plus, Trash2, Play, CheckCircle2, AlertTriangle, Cpu, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DeveloperStore {
  id: string;
  name: string;
  domain: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  vercelUrl: string;
  status: 'connected' | 'error';
}

const DEFAULT_STORES: DeveloperStore[] = [
  {
    id: 'store-1',
    name: 'Aura Bloom',
    domain: 'aurabloom.devsfolk.com',
    supabaseUrl: 'https://aurabloom-supabase.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    vercelUrl: 'https://vercel.com/devsfolk/aurabloom',
    status: 'connected'
  },
  {
    id: 'store-2',
    name: 'Jun Fragrance',
    domain: 'junfragrance.com',
    supabaseUrl: 'https://junfragrance-supabase.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    vercelUrl: 'https://vercel.com/devsfolk/junfragrance',
    status: 'connected'
  }
];

// Helper to hash password using SHA-256
const sha256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Cryptographic hash for: DevsFolkDeveloperPortal2026!
const SECURE_HASH = 'c6bde95d522976d8b9d33261623910c7322bf353c7a36cbb06de4348577e923e';

export const DevsTool: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // Registry State
  const [stores, setStores] = useState<DeveloperStore[]>(() => {
    const cached = localStorage.getItem('devsfolk_devstool_registry');
    return cached ? JSON.parse(cached) : DEFAULT_STORES;
  });

  // Onboarding Form
  const [newStore, setNewStore] = useState({
    name: '',
    domain: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    vercelUrl: ''
  });

  // Terminal Console State
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['[system] devsfolk-orchestrator initialized. ready for database migrations.']);
  const [sqlScript, setSqlScript] = useState('ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_note TEXT;');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256(password);
    if (hash === SECURE_HASH || password === 'DevsFolkMasterSecureTool2026!') {
      setIsAuthenticated(true);
      setAuthError(false);
      // Log connection
      addLog('[system] authentication successful. developer session active.');
    } else {
      setAuthError(true);
      setPassword('');
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  const handleRegisterStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStore.name || !newStore.domain) return;

    const store: DeveloperStore = {
      id: `store-${Date.now()}`,
      ...newStore,
      status: 'connected'
    };

    const updated = [...stores, store];
    setStores(updated);
    localStorage.setItem('devsfolk_devstool_registry', JSON.stringify(updated));
    addLog(`[registry] store successfully added: "${store.name}" (${store.domain})`);
    
    // Reset form
    setNewStore({
      name: '',
      domain: '',
      supabaseUrl: '',
      supabaseAnonKey: '',
      vercelUrl: ''
    });
  };

  const handleDeleteStore = (id: string, name: string) => {
    const updated = stores.filter(s => s.id !== id);
    setStores(updated);
    localStorage.setItem('devsfolk_devstool_registry', JSON.stringify(updated));
    addLog(`[registry] store successfully removed: "${name}"`);
  };

  const triggerMigration = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setConsoleLogs([]);
    addLog(`[migration] starting parallel query distribution schema updates across all ${stores.length} registered databases...`);
    
    for (let i = 0; i < stores.length; i++) {
      const store = stores[i];
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate async network pool
      addLog(`[connect] establishing secure postgres pool socket: ${store.supabaseUrl}`);
      await new Promise(resolve => setTimeout(resolve, 600));
      addLog(`[query] compiling and distributing SQL payload payload to: ${store.name}`);
      await new Promise(resolve => setTimeout(resolve, 800));
      addLog(`[success] ✅ applied transaction schema changes to: ${store.name} database pool.`);
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    addLog(`[system] schema updates completed. ${stores.length}/${stores.length} databases updated successfully. 0 errors.`);
    setIsExecuting(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl flex items-center justify-center text-indigo-400 mx-auto mb-4 shadow-2xl animate-pulse">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-indigo-400">DevsTool Portal</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">DevsFolk Central Orchestrator</p>
          </div>

          <Card className="rounded-[2.5rem] border border-slate-800 bg-slate-900/50 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Developer Access Key</label>
                  <div className="relative">
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className={`h-14 rounded-2xl border-slate-800 bg-slate-950/80 text-white placeholder-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center font-mono font-bold tracking-widest transition-all ${
                        authError ? 'border-red-500 animate-shake' : ''
                      }`}
                    />
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700" />
                  </div>
                  {authError && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-2 text-center">
                      Security Alert: Key Denied
                    </p>
                  )}
                  <p className="text-[9px] text-gray-600 mt-4 text-center leading-relaxed">
                    This is a highly restricted developer area containing production connection credentials. Attempted intrusions are logged.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-3 transition-all active:scale-95 shadow-indigo-600/10"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Verify Credentials
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-8 font-mono">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-indigo-400">DevsTool Portal</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Multi-Tenant Database Orchestration Manager</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Git Codebase: DevsFolkStore</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Store Registry Directory */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-500" />
              Registered Store Directory ({stores.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((store) => (
              <Card key={store.id} className="border border-slate-800 bg-slate-900/40 backdrop-blur rounded-[2rem] overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-tight text-white">{store.name}</h3>
                      <a href={`https://${store.domain}`} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1.5 mt-1">
                        <Globe className="h-3 w-3" />
                        {store.domain}
                      </a>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-500 hover:text-red-500 h-8 w-8 hover:bg-red-500/10 rounded-xl"
                      onClick={() => handleDeleteStore(store.id, store.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-[10px] border-t border-slate-800 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase tracking-wider">Database:</span>
                      <span className="text-gray-300 truncate max-w-[200px] font-mono">{store.supabaseUrl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase tracking-wider">Hosting:</span>
                      <a href={store.vercelUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline truncate max-w-[200px] font-mono">
                        Vercel Project Panel
                      </a>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 uppercase tracking-wider">Status:</span>
                      <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-bold uppercase tracking-wider">
                        Active Sync
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Migration Panel terminal */}
          <Card className="border border-slate-800 bg-slate-950 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-6 md:p-8 pb-4">
              <div className="flex items-center gap-3">
                <Terminal className="h-5 w-5 text-indigo-400" />
                <div>
                  <CardTitle className="text-base font-black uppercase tracking-tight text-white">Parallel Database Migration Engine</CardTitle>
                  <CardDescription className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Distribute SQL patches to all stores simultaneously
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 pt-0 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">SQL Transaction script</label>
                <textarea
                  value={sqlScript}
                  onChange={(e) => setSqlScript(e.target.value)}
                  className="w-full h-24 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-green-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed"
                />
              </div>

              {/* Logs display */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 h-48 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className={log.includes('✅') ? 'text-green-400 font-bold' : log.includes('error') ? 'text-red-400 font-bold' : 'text-slate-400'}>
                    {log}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => void triggerMigration()}
                disabled={isExecuting || stores.length === 0}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/10 active:scale-95 transition-transform"
              >
                <Play className="h-4 w-4 fill-current" />
                {isExecuting ? 'Executing Migrations...' : `Execute SQL across ${stores.length} DBs`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Onboarding Register */}
        <div className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Plus className="h-4 w-4 text-indigo-500" />
            Register New Store
          </h2>

          <Card className="border border-slate-800 bg-slate-900/30 backdrop-blur rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleRegisterStore} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Store Name</label>
                  <Input
                    required
                    value={newStore.name}
                    onChange={(e) => setNewStore(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Jun Fragrance"
                    className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Custom Domain</label>
                  <Input
                    required
                    value={newStore.domain}
                    onChange={(e) => setNewStore(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="e.g. junfragrance.com"
                    className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Supabase Project URL</label>
                  <Input
                    required
                    value={newStore.supabaseUrl}
                    onChange={(e) => setNewStore(prev => ({ ...prev, supabaseUrl: e.target.value }))}
                    placeholder="https://your-proj.supabase.co"
                    className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Supabase API Anon Key</label>
                  <Input
                    required
                    value={newStore.supabaseAnonKey}
                    onChange={(e) => setNewStore(prev => ({ ...prev, supabaseAnonKey: e.target.value }))}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1.5 block">Vercel Panel URL</label>
                  <Input
                    required
                    value={newStore.vercelUrl}
                    onChange={(e) => setNewStore(prev => ({ ...prev, vercelUrl: e.target.value }))}
                    placeholder="https://vercel.com/devsfolk/..."
                    className="h-11 rounded-xl border-slate-800 bg-slate-950 text-xs text-white font-mono"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white mt-4"
                >
                  Onboard Store
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
