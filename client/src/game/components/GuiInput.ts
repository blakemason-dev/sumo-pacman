import {
    defineComponent,
    Types,
} from 'bitecs';

export const GuiInput = defineComponent({
    pointerDown: Types.ui8, // 0 = false, 1 = true
    pointerReleased: Types.ui8 // 0 = not released, 1 = just released
});