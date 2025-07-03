import { PlanetData } from '../types';

export const PLANETS: PlanetData[] = [
  {
    name: 'Mercury',
    size: 0.38,
    distance: 5,
    speed: 4.74,
    color: '#8C7853',
  },
  {
    name: 'Venus',
    size: 0.95,
    distance: 7,
    speed: 3.50,
    color: '#FFC649',
  },
  {
    name: 'Earth',
    size: 1.0,
    distance: 9,
    speed: 2.98,
    color: '#6B93D6',
  },
  {
    name: 'Mars',
    size: 0.53,
    distance: 11,
    speed: 2.41,
    color: '#C1440E',
  },
  {
    name: 'Jupiter',
    size: 2.5,
    distance: 16,
    speed: 1.31,
    color: '#D8CA9D',
  },
  {
    name: 'Saturn',
    size: 2.1,
    distance: 21,
    speed: 0.97,
    color: '#FAD5A5',
    rings: true,
  },
  {
    name: 'Uranus',
    size: 1.0,
    distance: 26,
    speed: 0.68,
    color: '#4FD0E3',
  },
  {
    name: 'Neptune',
    size: 0.95,
    distance: 31,
    speed: 0.54,
    color: '#4B70DD',
  },
];

export const SUN_DATA = {
  name: 'Sun',
  size: 3.5,
  color: '#FDB813',
};