import React from 'react'
import './App.scss'
import { ControlDisplay } from './components/ControlDisplay/ControlDisplay'

export const App: React.FC = () => {
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
            <div className="body">Body</div>
        </div>
    )
}
