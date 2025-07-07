import React from 'react';

export const PlanetTooltip = ({ planet, position }) => {
  return (
    <div
      className="absolute z-50 bg-gray-900/95 backdrop-blur-sm text-white p-3 rounded-lg shadow-2xl border border-gray-700 pointer-events-none max-w-xs"
      style={{
        left: position.x + 10,
        top: position.y - 60,
        transform: 'translateY(-50%)'
      }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: planet.color }}
        />
        <h3 className="font-semibold text-lg">{planet.name}</h3>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{planet.description}</p>
      <div className="mt-2 text-xs text-gray-400">
        <div>Distance: {planet.distance} AU</div>
        <div>Orbital Speed: {(planet.orbitSpeed * 1000).toFixed(1)} km/s</div>
      </div>
    </div>
  );
};