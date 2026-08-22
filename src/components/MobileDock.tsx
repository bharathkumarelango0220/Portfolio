'use client';

import React from 'react';
import Link from 'next/link';
import { Home, MessageSquare, Phone, FileSpreadsheet, Compass } from 'lucide-react';

export function MobileDock() {
  return (
    <div className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] inset-x-0 z-40 px-3 pointer-events-none">
      <div className="max-w-md mx-auto glass-panel rounded-2xl p-1.5 shadow-2xl border border-white/20 dark:border-white/10 pointer-events-auto flex items-center justify-around">
        
        {/* Home Link */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-primary active:scale-90 transition-all group min-w-[48px] min-h-[44px]"
        >
          <Home className="w-5 h-5 group-hover:text-primary transition-colors" />
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </Link>

        {/* Trip Tools Link */}
        <Link
          href="/products/trip-tools"
          className="flex flex-col items-center justify-center p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 active:scale-90 transition-all group min-w-[48px] min-h-[44px]"
        >
          <Compass className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-semibold mt-0.5">Product</span>
        </Link>

        {/* WhatsApp Quick Link */}
        <a
          href="https://wa.me/918220802736?text=Hi%20Bharathkumar,%20I%20am%20interested%20in%20building%20a%20high-converting%20website%20with%20ApexAssure!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 active:scale-90 transition-all group min-w-[48px] min-h-[44px]"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
        </a>

        {/* Direct Call Link */}
        <a
          href="tel:+918220802736"
          className="flex flex-col items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-primary active:scale-90 transition-all group min-w-[48px] min-h-[44px]"
        >
          <Phone className="w-5 h-5 group-hover:text-primary transition-colors" />
          <span className="text-[10px] font-medium mt-0.5">Call</span>
        </a>

        {/* Project Brief CTA */}
        <Link
          href="/#brief-wizard"
          className="flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl bg-primary text-white shadow-md shadow-primary/30 active:scale-90 transition-all min-h-[44px]"
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Brief</span>
        </Link>

      </div>
    </div>
  );
}
