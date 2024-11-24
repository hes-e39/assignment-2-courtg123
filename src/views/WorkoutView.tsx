import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { TimerContext } from '../context/TimerContext'
import { convertToMs } from '../utils/helpers'

import { Panel } from "../components/generic/Panel";
import { Button, PlayPauseButton, FastForwardButton, ResetButton } from "../components/generic/Button";

import Stopwatch from "../components/timers/Stopwatch";
import CountdownDisplay from "../components/timers/display/CountdownDisplay";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";



interface Timer {
  type: string;
  settings: {
    totalSeconds?: number;
    rounds?: number;
    workSeconds?: number;
    restSeconds?: number;
  };
  state: 'not_started' | 'running' | 'completed';
}

// Workout Flow...
// click start workout: sets state = running, timer index is 0... then start first timer at index 0
// if timer is a countdown or stopwatch - count to totalSeconds
// if timer is XY - count to totalSeconds for x number of rounds (repeat/loop)
// if timer is Tabata - count work seconds + rest seconds for x number of rounds (repeat/loop)
// timer ends: mark as done, go to next timer. if no next timer, end workout

const WorkoutView = () => {
  const navigate = useNavigate();
  const {timers, removeTimer, running, timeInSeconds, currentTimer, currentTimerIndex, toggleRunning} = useContext(TimerContext)
  
  // max of 10 timers
  const MAX_TIMERS = 10;

  // get timer details and display it
  const displayTimerDetails = (timer: Timer) => {
    const { type, settings } = timer
    
    let details = `${type}: `;

    if (settings.totalSeconds) {
      details += `${Math.floor(settings.totalSeconds / 60)}min ${settings.totalSeconds % 60}sec `;
    }
    if (settings.rounds) {
      details += `${settings.rounds} rounds`
    }
    if (settings.workSeconds && settings.restSeconds) {
      details += ` (${settings.workSeconds}sec work / ${settings.restSeconds}sec rest)`;
    }

    return details;
  }

  const addTimer = () => {
    console.log("Open add timer")
    navigate('/add');
  }

  // edit a timer
  const editTimer = (index: number) => {
    console.log(`Open ${index} timer (for editing)`)
    navigate(`/edit/${index}`)
  }

  const runWorkout = () => {
    console.log("Start workout")
    toggleRunning()
  }

  const handleReset = () => {
    return
  }

  const handleFastForward = () => {
    return
  }

  // current timer display
  const renderCurrentTimer = () => {
    if (!currentTimer || !running) return null;

    const timeRemainingMs = (() => {
      if (currentTimer.type === 'Countdown') {
        return convertToMs(0, currentTimer.settings.totalSeconds || 0)
      }
    })();

    return (
      <Panel title={`Current: ${currentTimer.type}`}>
        <CountdownDisplay timeInMs={timeRemainingMs} />
        <div className="text-sm text-gray-400 mt-2">
          {displayTimerDetails(currentTimer)}
        </div>
      </Panel>
    )
  }
  

  // show queue of timers
  return (
    <div className="flex flex-col items-center">
      <h1>Workout</h1>

      {renderCurrentTimer()}

      <div>
        {timers.map((timer, index) => (
          <div key={index}>
              {displayTimerDetails(timer)} <Button onClick={() => editTimer(index)}>Edit</Button><Button onClick={() => removeTimer(index)}>Remove</Button><br />
          </div>
        ))}
               
      </div>
      <div>
        {timers.length >= MAX_TIMERS ? (
          <span className="text-gray-500"><i>You've added the maximum number of timers.</i></span>
        ) : (
          <Button onClick={addTimer}>+ Add Timer</Button>
        )}
      </div>
      <div>
        <ResetButton onClick={handleReset} disabled={timers.length === 0} />
        <PlayPauseButton onClick={runWorkout} disabled={timers.length === 0} />
        <FastForwardButton onClick={handleFastForward} disabled={timers.length === 0} />
      </div>
    </div>
  );
};

export default WorkoutView;
