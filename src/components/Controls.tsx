import React from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { PLANETS } from '../data/planets';
import { PlanetControls } from '../types';

interface ControlsProps {
  isRunning: boolean;
  planetSpeeds: PlanetControls;
  onTogglePause: () => void;
  onPlanetSpeedChange: (planetName: string, speed: number) => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  planetSpeeds,
  onTogglePause,
  onPlanetSpeedChange,
  onReset,
}) => {
  return (
    <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-full max-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Solar System Controls
          </span>
        </h2>
        
        <div className="flex gap-3 mb-4">
          <button
            onClick={onTogglePause}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/30 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-400/20"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            <span className="font-medium">{isRunning ? 'Pause' : 'Play'}</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-400/30 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/20"
          >
            <RotateCcw size={16} />
            <span className="font-medium">Reset</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
          Planet Speeds
        </h3>
        
        {PLANETS.map((planet) => (
          <div key={planet.name} className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-lg"
                  style={{ backgroundColor: planet.color, boxShadow: `0 0 8px ${planet.color}40` }}
                ></div>
                {planet.name}
              </label>
              <span className="text-xs text-white/70 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 font-medium">
                {planetSpeeds[planet.name]?.toFixed(1) || '1.0'}x
              </span>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={planetSpeeds[planet.name] || 1}
                onChange={(e) => onPlanetSpeedChange(planet.name, parseFloat(e.target.value))}
                className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider backdrop-blur-sm border border-white/20"
                style={{
                  background: `linear-gradient(to right, ${planet.color} 0%, ${planet.color} ${(planetSpeeds[planet.name] || 1) * 50}%, rgba(255,255,255,0.1) ${(planetSpeeds[planet.name] || 1) * 50}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-white/50 mt-2 px-1">
                <span className="font-medium">0x</span>
                <span className="font-medium">1x</span>
                <span className="font-medium">2x</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-400/20 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          Instructions
        </h4>
        <ul className="text-xs text-white/70 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Move mouse to control camera angle</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Adjust individual planet orbital speeds</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Use pause/play for precise observation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">•</span>
            <span>Reset to restore default speeds</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Controls;