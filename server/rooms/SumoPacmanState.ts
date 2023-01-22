import { Schema, ArraySchema, type } from "@colyseus/schema";

import { iSumoPacmanState, Pacman } from '../types/iSumoPacmanState';

export default class SumoPacmanState extends Schema implements iSumoPacmanState {
    @type([Pacman])
    pacmen: ArraySchema<Pacman> = new ArraySchema<Pacman>();

    @type("number")
    ringRadius: number = 4.5;
}