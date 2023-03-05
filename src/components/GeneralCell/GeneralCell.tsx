import React from 'react'
import { CellState, CellValue } from '../../typesOfCells/types'
import './GeneralCell.scss'

interface GeneralCellProps {
    key: string
    row: number
    col: number
    state: CellState
    value: CellValue
}

export const GeneralCell: React.FC<GeneralCellProps> = ({
    state,
    value,
    row,
    col,
}) => {
    const renderContent = (): React.ReactNode => {
        if (state === CellState.visible) {
            if (value === CellValue.bomb) {
                return (
                    <span role="img" aria-label="bomb">
                        💣
                    </span>
                )
            } else if (value === CellValue.none) {
                return null
            }

            return value
        } else if (state === CellState.flagged) {
            return (
                <span role="img" aria-label="flag">
                    🚩
                </span>
            )
        }

        return null
    }

    return (
        <div
            className={`GeneralCell ${
                state === CellState.visible ? 'visible' : ''
            } value-${value}`}
        >
            {renderContent()}
        </div>
    )
}
