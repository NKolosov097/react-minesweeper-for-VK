import React, { useState, useEffect } from 'react'
import { reduceEachTrailingCommentRange } from 'typescript'
import './App.scss'
import { ControlDisplay } from './components/ControlDisplay/ControlDisplay'
import { GeneralCell } from './components/GeneralCell/GeneralCell'
import { Cell, CellState, CellValue, Face } from './typesOfCells/types'
import { generateCells, openMultipleCells } from './utils/functions'

export const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells())
    const [face, setFace] = useState<Face>(Face.smile)
    const [time, setTime] = useState<number>(0)
    const [islive, setIsLive] = useState<boolean>(false)
    const [bombCounter, setBombCounter] = useState<number>(10)

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
        if (islive && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1)
            }, 1000)

            return () => {
                clearInterval(timer)
            }
        }
    }, [islive, time])

    const handleCellClick =
        (rowParam: number, colParam: number) => (): void => {
            if (!islive) {
                setIsLive(true)
            }

            const currentCell = cells[rowParam][colParam]
            let newCells = cells.slice()

            if (
                [CellState.flagged, CellState.visible].includes(
                    currentCell.state
                )
            ) {
                return
            }

            if (currentCell.value === CellValue.bomb) {
                return
            } else if (currentCell.value === CellValue.none) {
                newCells = openMultipleCells(newCells, rowParam, colParam)
                setCells(newCells)
            } else {
                newCells[rowParam][colParam].state = CellState.visible
                setCells(newCells)
            }
        }

    const handleCellContext =
        (rowParam: number, colParam: number) =>
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
            e.preventDefault()

            if (!islive) return

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
        if (islive) {
            setIsLive(false)
            setTime(0)
            setCells(generateCells())
        }
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
                />
            ))
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
