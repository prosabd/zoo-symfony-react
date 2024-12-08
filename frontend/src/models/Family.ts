import Animal from './Animal';
export default class Family {
    id: number;
    name: string;
    '@id'?: string;
    '@type'?: string;
    description?: string;
    animals?: Animal[];

    constructor (id: number, name: string, description?: string, animal?: Animal[]) {
        this.id = id;
         this.name = name;
         this.description = description;
         this.animals = animal;
    }
}