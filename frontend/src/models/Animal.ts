import Continent from './Continent';
import Family from './Family';

export default class Animal {
  id: number;
  name: string;
  description: string;
  family: Family;
  '@id'?: string;
  '@type'?: string;
  continents?: Continent[];

  constructor(id: number, name: string, description: string, family: Family, continents?: Continent[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.family = family;
    this.continents = continents;
  }
}