import {
    defineComponent,
    Types,
} from 'bitecs';

export enum ServerLinkType {
    Player,
    OtherPlayer,
    NPC
}

export const ServerLink = defineComponent({
    linkType: Types.ui16 
});