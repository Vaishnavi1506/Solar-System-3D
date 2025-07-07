import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { planetsData } from '../data/planetsData.js';
import { ControlPanel } from './ControlPanel.jsx';
import { PlanetTooltip } from './PlanetTooltip.jsx';

export const SolarSystem = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);
  const clockRef = useRef(null);
  const planetsRef = useRef(new Map());
  const planetSpeedsRef = useRef(new Map());4
  const isAnimatingRef = useRef(true);
  
  const [planets, setPlanets] = useState(new Map());
  const [planetSpeeds, setPlanetSpeeds] = useState(new Map());
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update refs when state changes
  useEffect(() => {
    planetsRef.current = planets;
  }, [planets]);

  useEffect(() => {
    planetSpeedsRef.current = planetSpeeds;
  }, [planetSpeeds]);

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize speeds
    const initialSpeeds = new Map();
    planetsData.forEach(planet => {
      initialSpeeds.set(planet.name, planet.orbitSpeed);
    });
    setPlanetSpeeds(initialSpeeds);
    planetSpeedsRef.current = initialSpeeds;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 35);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000011);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Clock for animation
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 3, 200);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 100;
    scene.add(pointLight);

    // Additional directional light for better visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create stars
    createStars(scene);

    // Create Sun with glow effect
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.6
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Add sun glow effect
    const sunGlowGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.3
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);

    // Create planets with labels
    const planetStates = new Map();
    
    planetsData.forEach((planetData) => {
      // Create orbit group (rotates around sun)
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);
      
      // Create planet group (contains planet and label)
      const planetGroup = new THREE.Group();
      planetGroup.position.x = planetData.distance;
      orbitGroup.add(planetGroup);
      
      // Planet geometry and material with enhanced visibility
      const geometry = new THREE.SphereGeometry(planetData.radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({ 
        color: planetData.color,
        shininess: 100,
        specular: 0x222222
      });
      
      const planet = new THREE.Mesh(geometry, material);
      planet.castShadow = true;
      planet.receiveShadow = true;
      planet.userData = { planetData };
      
      planetGroup.add(planet);

      // Create planet label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      
      context.fillStyle = 'rgba(0, 0, 0, 0.8)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.fillStyle = 'white';
      context.font = 'bold 24px Arial';
      context.textAlign = 'center';
      context.fillText(planetData.name, canvas.width / 2, canvas.height / 2 + 8);
      
      const labelTexture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: labelTexture,
        transparent: true,
        opacity: 0.9
      });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(4, 1, 1);
      label.position.set(0, planetData.radius + 1.5, 0);
      
      planetGroup.add(label);

      // Create orbit line with better visibility
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * planetData.distance,
          0,
          Math.sin(angle) * planetData.distance
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      
      const orbitMaterial = new THREE.LineBasicMaterial({ 
        color: planetData.color,
        transparent: true,
        opacity: 0.4
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      planetStates.set(planetData.name, {
        angle: Math.random() * Math.PI * 2,
        orbitGroup: orbitGroup,
        planetGroup: planetGroup,
        planet: planet,
        label: label,
        orbitLine: orbitLine
      });
    });

    setPlanets(planetStates);
    planetsRef.current = planetStates;

    // Mouse move handler for tooltips
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    // Raycaster for planet interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseHover = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const meshes = Array.from(planetStates.values())
        .map(state => state.planet)
        .filter(mesh => mesh !== undefined);
      
      const intersects = raycaster.intersectObjects(meshes);
      
      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object;
        const planetData = hoveredMesh.userData.planetData;
        setHoveredPlanet(planetData);
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredPlanet(null);
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mousemove', handleMouseHover);

    // Main animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const deltaTime = clock.getDelta();
      
      // Always render, but only update positions if animating
      if (isAnimatingRef.current) {
        // Update planets orbital motion and rotation
        planetsRef.current.forEach((state, planetName) => {
          const planetData = planetsData.find(p => p.name === planetName);
          const currentSpeed = planetSpeedsRef.current.get(planetName) || planetData?.orbitSpeed || 0;
          
          if (state.orbitGroup && state.planet && planetData) {
            // Update orbital angle
            state.angle += currentSpeed * deltaTime * 10; // Multiply by 10 for visible motion
            
            // Rotate the orbit group around the sun
            state.orbitGroup.rotation.y = state.angle;
            
            // Rotate the planet on its own axis
            state.planet.rotation.y += planetData.rotationSpeed * deltaTime * 20;
            
            // Keep label facing camera
            if (state.label && camera) {
              state.label.lookAt(camera.position);
            }
          }
        });

        // Sun rotation
        sun.rotation.y += 0.01 * deltaTime;
        sunGlow.rotation.y -= 0.005 * deltaTime;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mousemove', handleMouseHover);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const createStars = (scene) => {
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    const starColors = [];
    
    for (let i = 0; i < 15000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starPositions.push(x, y, z);
      
      // Add some color variation to stars
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.75);
      starColors.push(color.r, color.g, color.b);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({ 
      size: 1,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      sizeAttenuation: false
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  };

  const handleSpeedChange = useCallback((planetName, speed) => {
    setPlanetSpeeds(prev => {
      const newSpeeds = new Map(prev);
      newSpeeds.set(planetName, speed);
      return newSpeeds;
    });
  }, []);

  const handlePauseResume = useCallback(() => {
    setIsAnimating(prev => !prev);
  }, []);

  const resetSpeeds = useCallback(() => {
    const defaultSpeeds = new Map();
    planetsData.forEach(planet => {
      defaultSpeeds.set(planet.name, planet.orbitSpeed);
    });
    setPlanetSpeeds(defaultSpeeds);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      
      <ControlPanel
        planets={planetsData}
        planetSpeeds={planetSpeeds}
        onSpeedChange={handleSpeedChange}
        onPauseResume={handlePauseResume}
        onReset={resetSpeeds}
        isAnimating={isAnimating}
      />
      
      {hoveredPlanet && (
        <PlanetTooltip
          planet={hoveredPlanet}
          position={mousePosition}
        />
      )}
    </div>
  );
};