import React from 'react';
import { Train } from 'lucide-react';

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-indigo-900 z-[100] flex flex-col items-center justify-center text-white overflow-hidden">
      <div className="relative w-full h-32 mb-8">
        <div className="absolute top-0 left-0 animate-train-move text-yellow-400">
           <Train size={64} />
        </div>
      </div>
      
      <div className="text-center animate-fade-up">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">RailSafar</h1>
        <p className="text-indigo-200 text-lg tracking-widest uppercase">TA Journal Assistant</p>
      </div>

      <div className="absolute bottom-10 text-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <p className="text-sm text-indigo-300">Developed by</p>
        <p className="text-2xl font-['Dancing_Script'] text-yellow-400 mt-1">Milind Manugade</p>
      </div>
    </div>
  );
};