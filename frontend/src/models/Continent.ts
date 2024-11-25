import Animal from './Animal';
export default class Continent {
    id: number;
    name: string;
    '@id'?: string;
    '@type'?: string;
    animals?: Animal[];  // Changed to 'any' to prevent circular dependency issues

    constructor (id: number, name: string, animals?: Animal[]) {
        this.id = id;
        this.name = name;
        this.animals = animals;
    }
}