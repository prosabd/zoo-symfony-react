export interface Continent {
    id: number;
    name: string;
    '@id'?: string;
    '@type'?: string;
    animals?: Array<any>;  // Changed to 'any' to prevent circular dependency issues
}