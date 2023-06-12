import React from 'react'

import './NumberDisplay.scss'

interface NumberDisplayProps {
    value: number
}

function NumberDisplay ({ value }: NumberDisplayProps): ReactElement {
    return (
        <div className="NumberDisplay">
            {value < 0
                ? `-${Math.abs(value).toString().padStart(2, '0')}`
                : value.toString().padStart(3, '0')}
        </div>
    )
}

export default NumberDisplay
