import { Collection, getRepository } from "fireorm";

@Collection()
class Campus {
    id: string;
    name: string;
    location: string;
}


