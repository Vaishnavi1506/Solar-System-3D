import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, ChevronDown, ChevronUp } from 'lucide-react';

export const ControlPanel = ({
  planets,
  planetSpeeds,
  onSpeedChange,
  onPauseResume,
  onReset,
  isAnimating
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Solar System Controls</span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          {/* Animation Controls */}
          <div className="flex space-x-2">
            <button
              onClick={onPauseResume}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isAnimating
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isAnimating ? 'Pause' : 'Resume'}</span>
            </button>
            
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Speed Controls */}
          {isExpanded && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Orbital Speed Controls</h3>
              {planets.map((planet) => {
                const currentSpeed = planetSpeeds.get(planet.name) || planet.orbitSpeed;
                const speedMultiplier = currentSpeed / planet.orbitSpeed;
                
                return (
                  <div key={planet.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{planet.name}</span>
                      <span className="text-xs text-gray-400">{speedMultiplier.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full border-2 border-gray-600"
                        style={{ backgroundColor: planet.color }}
                      />
                      <input
                        type="range"
                        min="0"
                        max={planet.orbitSpeed * 5}
                        step={planet.orbitSpeed * 0.1}
                        value={currentSpeed}
                        onChange={(e) => onSpeedChange(planet.name, parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};