import React from 'react';
import './App.css'
import PhaserViewer from './components/PhaserViewer';

function App() {

    return (
        <div className="App">
            <h1>Sumo Pacman</h1>
            <PhaserViewer />
            <p><b>Objective: </b>Push your opponent out of the ring!<br /> 
               <b>Controls:</b> WASD</p>
        </div>
    )
}

export default App
