// ussage:
//    import * as AssetLibrary from '../etc./etc.'

const library = [
    {
        key: 'pacman',
        src: '/src/game/assets/pacman.png',
        type: 'IMAGE'
    },
    {
        key: 'red-ghost',
        src: '/src/game/assets/red-ghost.png',
        type: 'IMAGE'
    },
    {
        key: 'yellow-ghost',
        src: '/src/game/assets/yellow-ghost.png',
        type: 'IMAGE'
    },
    {
        key: 'pink-ghost',
        src: '/src/game/assets/pink-ghost.png',
        type: 'IMAGE'
    },
];

const getIndex = (key: string) => {
    for (let i = 0; i < library.length; i++) {
        if (library[i].key === key) return i;
    }
    return -1;
}

const getKey = (index: number) => {
    const key = library[index].key;
    if (!key) throw Error(`${index} is not a valid index into the asset library`);
    return key;
}

export { library, getIndex, getKey }