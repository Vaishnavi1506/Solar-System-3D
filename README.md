# 🌍 Solar-System-3D

An interactive 3D Solar System simulation built with **Three.js** and **React**. This project features realistic planetary motion, user controls, and immersive visuals — all rendered in your browser.

---

## 🌌 Features

- 🪐 **Interactive 3D Solar System**: All 8 planets orbiting around the Sun with realistic proportions  
- ⏱ **Real-time Speed Controls**: Adjust each planet's orbital speed  
- ⏸ **Pause / Resume Simulation**: Full control over animation  
- 🛰 **Planet Information**: Hover to view facts about each planet  
- ✨ **Background Stars**: Dynamic space environment with thousands of stars  
- 📱 **Responsive Design**: Works on desktop and mobile  
- 🧭 **Smooth Animations**: Handled by `requestAnimationFrame`  
- 💡 **Realistic Lighting**: Shadows and illumination effects using Three.js

---

## 🛠️ Technologies Used

- **Three.js** – 3D rendering and animation  
- **React** – UI framework  
- **Tailwind CSS** – Styling and responsiveness  
- **Lucide React** – Icon set  
- **Vite** – Fast development and builds  
- **JavaScript (ES6+), HTML5, WebGL**

---

## 📁 Project Structure

<pre>
src/
├── components/
│   ├── SolarSystem.jsx        # Main 3D scene and animation logic
│   ├── ControlPanel.jsx       # Speed control sliders and buttons
│   └── PlanetTooltip.jsx      # Tooltip shown on hover
├── data/
│   └── planetsData.js         # Planet metadata (name, size, speed)
├── types/
│   └── Planet.js              # Type definitions
├── App.jsx                    # Main layout
├── main.jsx                   # App entry point
├── index.css                  # Global styles
└── index.html                 # Root HTML
</pre>

---

## 🚀 Getting Started

### ✅ Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn

### Author:
Developed by Vaishnavi Sankepally
