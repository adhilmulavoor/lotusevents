'use client';

import { useActionState, use } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { loginAction } from '@/app/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full text-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-4 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[50px] touch-manipulation"
    >
      {pending ? 'Signing In...' : 'Sign In'}
    </button>
  );
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ role?: string, error?: string }> }) {
  const params = use(searchParams);
  const role = params.role || 'member';
  const urlError = params.error === 'unauthorized' ? 'You are not authorized to view this page.' : null;
  const [state, formAction] = useActionState(loginAction, null);
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 bg-gradient-to-br from-black to-zinc-900">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2 tracking-tight">Lotus Login</h1>
          <p className="text-gray-400 text-sm">Sign in to your {role} account</p>
        </div>

        {urlError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
            {urlError}
          </div>
        )}
        
        {state?.error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="role" value={role} />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email / Phone Number</label>
            <input 
              type="text" 
              name="emailOrPhone"
              placeholder="user@example.com or +1 (555) 000-0000"
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-base touch-manipulation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password / PIN</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••"
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-base touch-manipulation"
            />
          </div>

          <SubmitButton />
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
