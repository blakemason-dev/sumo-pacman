import {
    defineComponent,
    Types,
} from 'bitecs';

export const GuiTransform = defineComponent({
    position: {
        x: Types.f32,
        y: Types.f32
    },
    scale: {
        x: Types.f32,
        y: Types.f32
    },
    origin: {
        x: Types.f32,
        y: Types.f32
    },
    angle: Types.f32
});

export const DefaultGuiTransform = {
    position: {
        x: 0,
        y: 0
    },
    scale: {
        x: 1,
        y: 1
    },
    origin: {
        x: 0,
        y: 0
    },
    angle: 0
}