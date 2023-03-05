import React, { useState } from 'react'
import './App.scss'
import { ControlDisplay } from './components/ControlDisplay/ControlDisplay'
import { GeneralCell } from './components/GeneralCell/GeneralCell'
import { generateCells } from './utils/functions'

export const App: React.FC = () => {
    const [cells, setCells] = useState(generateCells())

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
                <GeneralCell key={`${rowIndex}-${colIndex}`} />
            ))
        )
    }

    return (
        <div className="App">
            <header className="header">
                <ControlDisplay value={0} />
                <div className="Restart">
                    <span role="img" aria-label="restart">
                        🔄
                    </span>
                </div>
                <ControlDisplay value={23} />
            </header>
            <div className="body">{renderCells()}</div>
        </div>
    )
}
