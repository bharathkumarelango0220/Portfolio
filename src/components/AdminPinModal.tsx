'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Unlock, ArrowRight, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function AdminPinModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const VALID_PIN = '0220';

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Trigger ONLY when Ctrl + K or Cmd + K is pressed on keyboard
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === VALID_PIN) {
      setSuccess(true);
      setError(false);
      try {
        sessionStorage.setItem('apex_admin_auth', 'true');
      } catch {
        // ignore
      }
      setTimeout(() => {
        setIsOpen(false);
        router.push('/admin');
      }, 500);
    } else {
      setError(true);
      setPin('');
      inputRef.current?.focus();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="w-full max-w-sm bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl glass-panel relative overflow-hidden text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Status Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${
          success 
            ? 'bg-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/20 scale-110' 
            : error 
            ? 'bg-destructive/20 text-destructive' 
            : 'bg-primary/15 text-primary shadow-md shadow-primary/15'
        }`}>
          {success ? (
            <CheckCircle2 className="w-7 h-7" />
          ) : error ? (
            <ShieldAlert className="w-7 h-7" />
          ) : (
            <Lock className="w-7 h-7" />
          )}
        </div>

        {/* Heading */}
        <div className="space-y-1 mb-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Admin Backdoor (Ctrl + K)
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            {success ? 'Access Granted' : 'Enter Admin PIN'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {success 
              ? 'Redirecting to Admin Portal...' 
              : 'Enter your 4-digit master PIN to access the management dashboard.'}
          </p>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <input
              ref={inputRef}
              type="password"
              maxLength={8}
              required
              disabled={success}
              placeholder="••••"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              className={`w-full px-4 py-3.5 rounded-xl bg-background border text-center font-mono text-xl tracking-[0.4em] outline-none transition-all ${
                error 
                  ? 'border-destructive ring-1 ring-destructive text-destructive' 
                  : success
                  ? 'border-emerald-500 ring-1 ring-emerald-500 text-emerald-500'
                  : 'border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground'
              }`}
            />
            {error && (
              <p className="text-[11px] text-destructive font-semibold pt-1 animate-in fade-in">
                Incorrect PIN. Access denied.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={success || !pin.trim()}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 ${
              success
                ? 'bg-emerald-600 text-white'
                : 'bg-primary hover:bg-blue-600 text-white shadow-primary/25 disabled:opacity-50'
            }`}
          >
            {success ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <span>Unlock &amp; Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-border/50 text-[10px] text-muted-foreground flex items-center justify-between">
          <span>ApexAssure Security</span>
          <span>Press ESC to Close</span>
        </div>
      </div>
    </div>
  );
}
