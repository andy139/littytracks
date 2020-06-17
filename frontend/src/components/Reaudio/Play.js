import React from 'react';
import PlayIcon from './assets/PlayIcon';

const Play = ({ handleClick }) => (
  <button className="player__button" onClick={handleClick}>
    <PlayIcon />
  </button>
);

export default Play;
