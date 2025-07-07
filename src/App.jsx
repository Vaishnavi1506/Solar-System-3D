import React from 'react';
import { SolarSystem } from './components/SolarSystem.jsx';

function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <SolarSystem />
      
      {/* Title Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-4">
          <h1 className="text-2xl font-bold text-white mb-1">Solar System Simulation</h1>
          <p className="text-sm text-gray-300">Interactive 3D orbital mechanics with Three.js</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 p-4 max-w-md">
          <h3 className="text-sm font-semibold text-white mb-2">Controls:</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Hover over planets to see information</li>
            <li>• Use the control panel to adjust orbital speeds</li>
            <li>• Click Pause/Resume to control animation</li>
            <li>• Click Reset to restore default speeds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;