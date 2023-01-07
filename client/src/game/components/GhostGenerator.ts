import {
    defineComponent,
    Types,
} from 'bitecs';

export const GhostGenerator = defineComponent({
    type: Types.ui16 // 0 = red, 1 = yellow, 2 = pink
});