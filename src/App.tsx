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
        <div className="absolute top-4 right-4 pointer-events-none max-w-xs sm:max-w-sm md:max-w-md">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-200/30 to-transparent animate-pulse"></div>
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-100 rounded-full opacity-80"></div>
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-orange-200 rounded-full opacity-60"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Cosmic Creations
              </h1>
            </div>
            
            <p className="text-base sm:text-lg text-white/90 font-medium mb-2">
              Interactive Solar System
            </p>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
              Explore our solar system in real-time 3D with interactive controls and realistic physics
            </h1>
          </div>
        </div>
        
        {/* Mobile Info Panel */}
        <div className="absolute top-4 left-4 right-4 pointer-events-none md:hidden">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-xl">
            <div className="text-center">
              <p className="text-white/90 text-sm font-medium mb-1">
                🌌 Interactive 3D Solar System
              </p>
              <p className="text-white/60 text-xs">
                Use controls on the left to adjust planet speeds
              </p>
            </div>
          </div>
        </div>
        
        {/* Description Panel - Desktop Only */}
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none hidden lg:block max-w-sm">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              About This Simulation
            </h3>
            <div className="space-y-3 text-sm text-white/80">
              <p className="leading-relaxed">
                Experience our solar system like never before with this interactive 3D simulation featuring all 8 planets orbiting the Sun.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✨</span>
                  <span>Realistic orbital mechanics and physics</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">🎮</span>
                  <span>Individual planet speed controls</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">📱</span>
                  <span>Fully responsive design</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">🚀</span>
                  <span>Built with Three.js & React</span>
                </div>
              </div>
            </p>
          </div>
        </div>
        
        {/* Mobile Description - Bottom */}
        <div className="absolute bottom-24 left-4 right-4 pointer-events-none md:hidden">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              Features
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">✨</span>
                <span>Realistic Physics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">🎮</span>
                <span>Interactive Controls</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">📱</span>
                <span>Mobile Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-400">🚀</span>
                <span>3D Graphics</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Planet Info Panel - Desktop */}
        <div className="absolute bottom-32 right-4 pointer-events-none hidden md:block">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-pulse"></div>
              Solar System Facts
            </h4>
            <div className="space-y-2 text-xs text-white/70">
              <p>🌞 Sun: 99.86% of solar system mass</p>
              <p>🪐 Saturn: Has over 80 known moons</p>
              <p>🌍 Earth: Only known planet with life</p>
              <p>♆ Neptune: Windiest planet (2,100 km/h)</p>
            </p>
          </div>
        </div>
        
        {/* Performance Info */}
        <div className="absolute bottom-20 right-4 pointer-events-none hidden sm:block">
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-3 sm:p-4 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 text-white/70 text-xs sm:text-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="font-medium">60 FPS | Three.js</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-3 sm:p-4 shadow-lg">
            <div className="text-center">
              <p className="text-white/90 text-xs sm:text-sm font-medium mb-1">
                Made with <span className="text-red-400 animate-pulse">❤️</span> by <span className="text-amber-400 font-semibold">Pratyush</span>
              </p>
              <p className="text-white/60 text-xs hidden sm:block">
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