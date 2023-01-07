import {
    defineComponent,
    Types,
} from 'bitecs';

export const Image = defineComponent({
    texture: Types.ui16,
    width: Types.f32,
    height: Types.f32,
    origin: {
        x: Types.f32,
        y: Types.f32
    }
});