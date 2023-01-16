import {
    defineComponent,
    Types,
} from 'bitecs';

export const ServerCoordinateConverter = defineComponent({
    width: Types.f32,
    height: Types.f32,
    originX: Types.f32,
    originY: Types.f32
});