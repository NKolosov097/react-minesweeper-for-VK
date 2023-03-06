import React, { useState, useEffect } from 'react'
import { reduceEachTrailingCommentRange } from 'typescript'
import './App.scss'
import { ControlDisplay } from './components/ControlDisplay/ControlDisplay'
import { GeneralCell } from './components/GeneralCell/GeneralCell'
import { MAX_COLS, MAX_ROWS } from './constants/constants'
import { Cell, CellState, CellValue, Face } from './typesOfCells/types'
import { generateCells, openMultipleCells } from './utils/functions'

export const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells())
    const [face, setFace] = useState<Face>(Face.smile)
    const [time, setTime] = useState<number>(0)
    const [isLive, setIsLive] = useState<boolean>(false)
    const [bombCounter, setBombCounter] = useState<number>(10)
    const [hasLost, setHasLost] = useState<boolean>(false)
    const [hasWon, setHasWon] = useState<boolean>(false)

    useEffect(() => {
        const handleMouseDown = (): void => {
            setFace(Face.oh)
        }

        const handleMouseUp = (): void => {
            setFace(Face.smile)
        }

        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    useEffect(() => {
        if (isLive && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1)
            }, 1000)

            return () => {
                clearInterval(timer)
            }
        }
    }, [isLive, time])

    useEffect(() => {
        if (hasLost) {
            setFace(Face.lost)
            setIsLive(false)
        }
    }, [hasLost])

    useEffect(() => {
        if (hasWon) {
            setIsLive(false)
            setFace(Face.won)
        }
    })

    const handleCellClick =
        (rowParam: number, colParam: number) => (): void => {
            let newCells = cells.slice()

            if (!isLive) {
                let isABomb =
                    newCells[rowParam][colParam].value === CellValue.bomb
                while (isABomb) {
                    newCells = generateCells()
                    if (newCells[rowParam][colParam].value !== CellValue.bomb) {
                        isABomb = false
                        break
                    }
                }
                setIsLive(true)
            }

            const currentCell = newCells[rowParam][colParam]

            if (
                [CellState.flagged, CellState.visible].includes(
                    currentCell.state
                )
            ) {
                return
            }

            if (currentCell.value === CellValue.bomb) {
                setHasLost(true)
                newCells[rowParam][colParam].red = true
                newCells = showAllBombs()
                setCells(newCells)
                return
            } else if (currentCell.value === CellValue.none) {
                newCells = openMultipleCells(newCells, rowParam, colParam)
            } else {
                newCells[rowParam][colParam].state = CellState.visible
            }

            // Проверка на открытие всех полей, которые НЕ являются бомбами
            let safeOpenCellsExists = false
            for (let row = 0; row < MAX_ROWS; row++) {
                for (let col = 0; col < MAX_COLS; col++) {
                    const currentCell = newCells[row][col]

                    if (
                        currentCell.value !== CellValue.bomb &&
                        currentCell.state === CellState.dontTouched
                    ) {
                        safeOpenCellsExists = true
                        break
                    }
                }
            }

            if (!safeOpenCellsExists) {
                newCells = newCells.map((row) =>
                    row.map((cell) => {
                        if (cell.value === CellValue.bomb) {
                            return {
                                ...cell,
                                state: CellState.flagged,
                            }
                        }
                        return cell
                    })
                )
                setHasWon(true)
            }

            setCells(newCells)
        }

    const handleCellContext =
        (rowParam: number, colParam: number) =>
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
            e.preventDefault()

            if (!isLive) return

            const currentCells = cells.slice()
            const currentCell = cells[rowParam][colParam]

            if (currentCell.state === CellState.visible) {
                return
            } else if (currentCell.state === CellState.dontTouched) {
                currentCells[rowParam][colParam].state = CellState.flagged
                setCells(currentCells)
                setBombCounter(bombCounter - 1)
            } else if (currentCell.state === CellState.flagged) {
                currentCells[rowParam][colParam].state = CellState.dontTouched
                setCells(currentCells)
                setBombCounter(bombCounter + 1)
            }
        }

    const handleFaceClick = (): void => {
        setIsLive(false)
        setTime(0)
        setCells(generateCells())
        setHasLost(false)
        setHasWon(false)
    }

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
                <GeneralCell
                    key={`${rowIndex}-${colIndex}`}
                    state={cell.state}
                    value={cell.value}
                    onClick={handleCellClick}
                    onContext={handleCellContext}
                    row={rowIndex}
                    col={colIndex}
                    red={cell.red}
                />
            ))
        )
    }

    const showAllBombs = (): Cell[][] => {
        const currentcells = cells.slice()
        return currentcells.map((row) =>
            row.map((cell) => {
                if (cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.visible,
                    }
                }

                return cell
            })
        )
    }

    return (
        <div className="App">
            <header className="header">
                <ControlDisplay value={bombCounter} />
                <div className="Face" onClick={handleFaceClick}>
                    <span role="img" aria-label="bomb">
                        {face}
                    </span>
                </div>
                <ControlDisplay value={time} />
            </header>
            <div className="body">{renderCells()}</div>
        </div>
    )
}
