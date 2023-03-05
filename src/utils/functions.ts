import { MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS } from '../constants/constants'
import { Cell, CellState, CellValue } from '../typesOfCells/types'

//создаем ячейки. Количество ячеек определяется переменными MAX_ROWS * MAX_COLS
export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = []
    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([])
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.dontTouched,
            })
        }
    }

    // создаем в рандомных местах бомбы
    let bombsPlaced = 0
    while (bombsPlaced < NUMBER_OF_BOMBS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS)
        const randomCol = Math.floor(Math.random() * MAX_COLS)

        const currentCell = cells[randomRow][randomCol]
        if (currentCell.value !== CellValue.bomb) {
            cells = cells.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    if (randomRow === rowIndex && randomCol === colIndex) {
                        return {
                            ...cell,
                            value: CellValue.bomb,
                        }
                    }

                    return cell
                })
            )
            bombsPlaced++
        }
    }

    // считаем количество бомб вокруг клетки
    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            const currentCell = cells[rowIndex][colIndex]

            if (currentCell.value === CellValue.bomb) {
                continue
            }

            let numberOfBombs = 0
            const topLeftCell =
                rowIndex > 0 && colIndex > 0
                    ? cells[rowIndex - 1][colIndex - 1]
                    : null
            const topCell = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null
            const topRightCell =
                rowIndex > 0 && colIndex < MAX_COLS - 1
                    ? cells[rowIndex - 1][colIndex + 1]
                    : null
            const leftCell = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null
            const rightCell =
                colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null
            const bottomLeftCell =
                rowIndex < MAX_ROWS - 1 && colIndex > 0
                    ? cells[rowIndex + 1][colIndex - 1]
                    : null
            const bottomCell =
                rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null
            const bottomRightCell =
                rowIndex < MAX_ROWS - 1 && colIndex > MAX_COLS - 1
                    ? cells[rowIndex + 1][colIndex + 1]
                    : null

            if (topLeftCell?.value === CellValue.bomb) {
                numberOfBombs++
            }
            if (topCell?.value === CellValue.bomb) {
                numberOfBombs++
            }
            if (topRightCell?.value === CellValue.bomb) {
                numberOfBombs++
            }
            if (leftCell?.value === CellValue.bomb) {
                numberOfBombs++
            }
            if (rightCell?.value === CellValue.bomb) {
                numberOfBombs++
            }
            if (bottomLeftCell?.value === CellValue.bomb) {
                numberOfBombs++
            }
            if (bottomCell?.value === CellValue.bomb) {
                numberOfBombs++
            }
            if (bottomRightCell?.value === CellValue.bomb) {
                numberOfBombs++
            }

            if (numberOfBombs > 0) {
                cells[rowIndex][colIndex] = {
                    ...currentCell,
                    value: numberOfBombs,
                }
            }
        }
    }

    return cells
}
