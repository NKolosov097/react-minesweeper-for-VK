import React from 'react'
import './ControlDisplay.scss'

interface ControlDisplayProps {
    value: number
}

export const ControlDisplay: React.FC<ControlDisplayProps> = ({ value }) => {
    return (
        <div className="ControlDisplay">
            {value.toString().padStart(2, '0')}
        </div>
    )
}
