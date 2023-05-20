import { Collection } from 'fireorm';

@Collection()
class Band {
    id: string;
    name: string;
    formationYear: number;
    genres: Array<string>;
}