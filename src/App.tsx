import React, { useState } from 'react'
import './App.scss'
import { ControlDisplay } from './components/ControlDisplay/ControlDisplay'
import { GeneralCell } from './components/GeneralCell/GeneralCell'
import { generateCells } from './utils/functions'

export const App: React.FC = () => {
    const [cells, setCells] = useState(generateCells())
    console.log('cells', cells)

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
                <GeneralCell
                    key={`${rowIndex}-${colIndex}`}
                    state={cell.state}
                    value={cell.value}
                    row={rowIndex}
                    col={colIndex}
                />
            ))
        )
    }

    return (
        <div className="App">
            <header className="header">
                <ControlDisplay value={0} />
                <div className="Face">
                    <span role="img" aria-label="bomb">
                        😁
                    </span>
                </div>
                <ControlDisplay value={23} />
            </header>
            <div className="body">{renderCells()}</div>
        </div>
    )
}
