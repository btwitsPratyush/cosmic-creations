export interface PlanetData {
  name: string;
  size: number;
  distance: number;
  speed: number;
  color: string;
  texture?: string;
  rings?: boolean;
}

export interface PlanetControls {
  [key: string]: number;
}

export interface CameraControls {
  autoRotate: boolean;
  zoom: number;
}