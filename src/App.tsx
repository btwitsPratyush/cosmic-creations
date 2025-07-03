import React, { useEffect, useRef, useState } from 'react';
import { SolarSystem } from './components/SolarSystem';
import Controls from './components/Controls';
import { PlanetControls } from './types';
import { PLANETS } from './data/planets';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const solarSystemRef = useRef<SolarSystem | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [planetSpeeds, setPlanetSpeeds] = useState<PlanetControls>(() => {
    const initialSpeeds: PlanetControls = {};
    PLANETS.forEach(planet => {
      initialSpeeds[planet.name] = 1;
    });
    return initialSpeeds;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize solar system
    solarSystemRef.current = new SolarSystem(containerRef.current);

    // Handle window resize
    const handleResize = () => {
      if (solarSystemRef.current) {
        solarSystemRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (solarSystemRef.current) {
        solarSystemRef.current.dispose();
      }
    };
  }, []);

  const handleTogglePause = () => {
    if (solarSystemRef.current) {
      solarSystemRef.current.togglePause();
      setIsRunning(!isRunning);
    }
  };

  const handlePlanetSpeedChange = (planetName: string, speed: number) => {
    if (solarSystemRef.current) {
      solarSystemRef.current.setPlanetSpeed(planetName, speed);
      setPlanetSpeeds(prev => ({
        ...prev,
        [planetName]: speed
      }));
    }
  };

  const handleReset = () => {
    const resetSpeeds: PlanetControls = {};
    PLANETS.forEach(planet => {
      resetSpeeds[planet.name] = 1;
      if (solarSystemRef.current) {
        solarSystemRef.current.setPlanetSpeed(planet.name, 1);
      }
    });
    setPlanetSpeeds(resetSpeeds);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-black via-slate-900 to-purple-900 overflow-hidden">
      {/* 3D Scene Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <Controls
            isRunning={isRunning}
            planetSpeeds={planetSpeeds}
            onTogglePause={handleTogglePause}
            onPlanetSpeedChange={handlePlanetSpeedChange}
            onReset={handleReset}
          />
        </div>
        
        {/* Header */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              🌎 Cosmic Creations
            </h1>
            <p className="text-lg text-white/90 font-medium mb-1">
              Interactive Solar System
            </p>
            <p className="text-sm text-white/60">
              Explore our solar system in real-time 3D
            </p>
          </div>
        </div>
        
        {/* Performance Info */}
        <div className="absolute bottom-20 right-4 pointer-events-none">
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="font-medium">60 FPS | Three.js</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg">
            <div className="text-center">
              <p className="text-white/90 text-sm font-medium mb-1">
                Made with <span className="text-red-400 animate-pulse">❤️</span> by <span className="text-amber-400 font-semibold">Pratyush</span>
              </p>
              <p className="text-white/60 text-xs">
                © 2024 All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading Overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-1000">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">🌎 Cosmic Creations</p>
          <p className="text-white/70 text-sm mt-1">Loading Solar System...</p>
        </div>
      </div>
    </div>
  );
}

export default App;