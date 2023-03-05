export enum CellValue {
    // bomb если это бомба,
    // none если рядом нет бомбы,
    // 1-8 количество бомб вокруг этой ячейки
    none,
    bomb,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
}

export enum CellState {
    // dontTouched - начальное состояние ячейки
    // visible - когда мы открыли ячейку
    // flagged - если мы думаем, что на этой ячейке бомба, мы помечаем ее флажком
    dontTouched,
    visible,
    flagged,
}

export type Cell = { value: CellValue; state: CellState }

export enum Face {
    smile = '😁',
    oh = '😮',
    lost = '😵',
    won = '😎',
}
