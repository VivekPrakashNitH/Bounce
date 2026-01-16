import React from 'react';
import { SystemDesignGame } from './components/SystemDesignGame';

export function Backend() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white overflow-hidden">
      {/* 
         We wrap the game in a full-screen container. 
         The Game component handles all the routing (Game World <-> Demos) internally.
      */}
      <SystemDesignGame />
    </div>
  )
}

export default Backend;