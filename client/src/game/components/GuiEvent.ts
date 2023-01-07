import {
    defineComponent,
    Types,
} from 'bitecs';

export enum GuiEventEnum {
    CREATE_PACMAN,
    CREATE_GHOST,
    UPDATE_COUNTER
}

export const GuiEvent = defineComponent({
    type: Types.ui16
});