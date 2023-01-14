import { ArraySchema, Schema, type } from '@colyseus/schema';

export class Vector2 extends Schema {
    @type("number")
    x: number = 0;

    @type("number")
    y: number = 0;
}

export class Pacman extends Schema {
    @type(Vector2)
    position: Vector2 = new Vector2();

    @type("number")
    charge: number = 0; // between 0 and 1

    @type("string")
    sessionId: string = "";
}

export interface iSumoPacmanState {
    pacmen: ArraySchema<Pacman>;
}

export default iSumoPacmanState;