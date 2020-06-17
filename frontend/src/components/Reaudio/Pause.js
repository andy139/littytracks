import React from 'react';
import PauseIcon from './assets/PauseIcon';

const Pause = ({ handleClick }) => (
  <button className="player__button" onClick={handleClick}>
    <PauseIcon />
  </button>
);

export default Pause;
