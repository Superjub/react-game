import React, { useState } from 'react';
import './App.css';
import { TitleScreen } from './states/title/title';
import { Gameplay } from './states/gameplay/gameplay';

function App(this: any) {

  const [gameState, setGameState] = useState('title'); // can be 'title', 'active' or 'game-over';

  const updateGameState = (state: string): void => {
    console.log('set state to: ', state);
    setGameState(state);
  }

  const appProps = {
    updateState: updateGameState
  };

  return (
    <React.Fragment>
      { gameState === 'title' && <TitleScreen {...appProps} /> }

      { gameState === 'gameplay' && <Gameplay {...appProps} /> }
    </React.Fragment>
  );
}

export default App;
