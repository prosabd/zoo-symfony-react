export interface Animal {
  id: number;
  name: string;
  description: string;
  family: string;
  '@id'?: string;
  '@type'?: string;
  continents?: string[];
}