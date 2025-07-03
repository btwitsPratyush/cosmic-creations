import * as THREE from 'three';
import { Planet } from './Planet';
import { PLANETS, SUN_DATA } from '../data/planets';
import { PlanetControls } from '../types';

export class SolarSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private planets: Planet[] = [];
  private sun: THREE.Mesh;
  private animationId: number | null = null;
  private isRunning: boolean = true;
  private speedMultipliers: PlanetControls = {};
  
  constructor(private container: HTMLElement) {
    this.clock = new THREE.Clock();
    this.init();
    this.createStarfield();
    this.createSun();
    this.createPlanets();
    this.setupLighting();
    this.setupControls();
    this.animate();
    
    // Initialize speed multipliers
    PLANETS.forEach(planet => {
      this.speedMultipliers[planet.name] = 1;
    });
  }
  
  private init(): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000011);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 30, 50);
    this.camera.lookAt(0, 0, 0);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    this.container.appendChild(this.renderer.domElement);
  }
  
  private createStarfield(): void {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(starField);
  }
  
  private createSun(): void {
    const geometry = new THREE.SphereGeometry(SUN_DATA.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: SUN_DATA.color,
      emissive: SUN_DATA.color,
      emissiveIntensity: 0.3,
    });
    
    this.sun = new THREE.Mesh(geometry, material);
    this.sun.castShadow = false;
    this.sun.receiveShadow = false;
    this.scene.add(this.sun);
  }
  
  private createPlanets(): void {
    PLANETS.forEach(planetData => {
      const planet = new Planet(planetData, this.scene);
      this.planets.push(planet);
    });
  }
  
  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    this.scene.add(ambientLight);
    
    // Point light from sun
    const sunLight = new THREE.PointLight(0xffffff, 2, 100);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 100;
    this.scene.add(sunLight);
    
    // Directional light for better visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
  }
  
  private setupControls(): void {
    // Mouse controls for camera
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetX = mouseX * 0.1;
      targetY = mouseY * 0.1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Update camera position based on mouse
    const updateCamera = () => {
      if (!this.isRunning) return;
      
      const time = this.clock.getElapsedTime();
      const radius = 50;
      const height = 30;
      
      this.camera.position.x = Math.cos(time * 0.1 + targetX) * radius;
      this.camera.position.z = Math.sin(time * 0.1 + targetX) * radius;
      this.camera.position.y = height + targetY * 10;
      this.camera.lookAt(0, 0, 0);
    };
    
    // Add to animation loop
    this.updateCamera = updateCamera;
  }
  
  private updateCamera(): void {
    // This will be overridden by setupControls
  }
  
  public setPlanetSpeed(planetName: string, speed: number): void {
    this.speedMultipliers[planetName] = speed;
  }
  
  public pause(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  public resume(): void {
    this.isRunning = true;
    this.animate();
  }
  
  public togglePause(): void {
    if (this.isRunning) {
      this.pause();
    } else {
      this.resume();
    }
  }
  
  private animate(): void {
    if (!this.isRunning) return;
    
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    // Update camera
    this.updateCamera();
    
    // Rotate sun
    this.sun.rotation.y += deltaTime * 0.5;
    
    // Update planets
    this.planets.forEach((planet, index) => {
      const planetName = PLANETS[index].name;
      const speedMultiplier = this.speedMultipliers[planetName] || 1;
      planet.update(deltaTime, speedMultiplier);
    });
    
    this.renderer.render(this.scene, this.camera);
  }
  
  public resize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.planets.forEach(planet => planet.dispose());
    this.sun.geometry.dispose();
    (this.sun.material as THREE.Material).dispose();
    
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}