import {
    defineComponent,
    Types,
} from 'bitecs';

export const Sprite = defineComponent({
    width: Types.f32,
    height: Types.f32,
    origin: {
        x: Types.f32,
        y: Types.f32
    }
});