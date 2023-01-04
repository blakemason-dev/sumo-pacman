import {
    defineComponent,
    Types,
} from 'bitecs';

export const GuiText = defineComponent({
    text: Types.ui16,
    style: Types.ui16,
    origin: {
        x: Types.f32,
        y: Types.f32
    }
});