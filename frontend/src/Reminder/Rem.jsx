import React from 'react';
import { Brain } from 'lucide-react';
import TasksPage from './TasksPage';

function Rem() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#E066FF] to-[#8A7CFF]">
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center md:justify-start">
            <Brain className="h-10 w-10 text-white" />
            <div className="ml-4 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">Memory Vault: Smriti</h1>
              <p className="text-white/80 text-sm mt-1">Preserving memories, connecting hearts</p>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <TasksPage />
      </div>
    </div>
  );
}

export default Rem;