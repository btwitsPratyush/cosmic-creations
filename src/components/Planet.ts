import * as THREE from 'three';
import { PlanetData } from '../types';

export class Planet {
  public mesh: THREE.Mesh;
  public orbitLine: THREE.Line;
  public group: THREE.Group;
  private angle: number = 0;
  private rings?: THREE.Mesh;
  
  constructor(
    private data: PlanetData,
    private scene: THREE.Scene
  ) {
    this.group = new THREE.Group();
    
    // Create planet mesh
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: data.color,
      shininess: 30,
      specular: 0x111111,
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.x = data.distance;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    // Create orbital path
    this.orbitLine = this.createOrbitLine();
    
    // Create rings for Saturn
    if (data.rings) {
      this.rings = this.createRings();
      this.group.add(this.rings);
    }
    
    this.group.add(this.mesh);
    this.scene.add(this.group);
    this.scene.add(this.orbitLine);
    
    // Random starting position
    this.angle = Math.random() * Math.PI * 2;
    this.updatePosition();
  }
  
  private createOrbitLine(): THREE.Line {
    const points = [];
    const segments = 64;
    
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(theta) * this.data.distance,
        0,
        Math.sin(theta) * this.data.distance
      ));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x444444,
      opacity: 0.3,
      transparent: true,
    });
    
    return new THREE.Line(geometry, material);
  }
  
  private createRings(): THREE.Mesh {
    const innerRadius = this.data.size * 1.2;
    const outerRadius = this.data.size * 2.0;
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    
    const rings = new THREE.Mesh(geometry, material);
    rings.rotation.x = Math.PI / 2;
    rings.position.x = this.data.distance;
    
    return rings;
  }
  
  public update(deltaTime: number, speedMultiplier: number = 1): void {
    // Update orbital position
    this.angle += deltaTime * this.data.speed * speedMultiplier * 0.1;
    this.updatePosition();
    
    // Rotate planet on its axis
    this.mesh.rotation.y += deltaTime * 2;
    
    // Update rings position if they exist
    if (this.rings) {
      this.rings.position.x = this.mesh.position.x;
      this.rings.position.z = this.mesh.position.z;
    }
  }
  
  private updatePosition(): void {
    this.mesh.position.x = Math.cos(this.angle) * this.data.distance;
    this.mesh.position.z = Math.sin(this.angle) * this.data.distance;
  }
  
  public dispose(): void {
    this.scene.remove(this.group);
    this.scene.remove(this.orbitLine);
    
    if (this.rings) {
      this.rings.geometry.dispose();
      (this.rings.material as THREE.Material).dispose();
    }
    
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.orbitLine.geometry.dispose();
    (this.orbitLine.material as THREE.Material).dispose();
  }
}