import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { TimerContext } from '../context/TimerContext'

import { Panel } from "../components/generic/Panel";
import { Button } from "../components/generic/Button";

import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
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

const runWorkout = () => {
  console.log("Start workout")
}



// UI: show which timer is currently running
// indicate progress...
// - show which timers have completed (maybe a checkmark in list or something to indicate?)
// - show how many timers remaining
// - maybe: total workout time remaining?
// Can "fast forward" to next timer? Is that what Fast Forward is for? (confirm this)
  // confirmed per requirement: Controls to "fast-forward" - ends the current running timer and moves onto the next one
// Can pause/resume workout (pauses/resumes current timer only)
// Can end workout (fast forward through all timers in workout timer stack)

// additional requirements:
// Each timer can be in one of three states: running, completed, and not running. 
// You will need a way to keep track of what state the timer is in, so that you can display it accordingly (see the image above)
// While the timer is running, you will need to either store or dynamically calculate which timer is active.
// You don't want to clear the configurations as the timers are running. The user should be able to restart the entire workout at anytime

// Workout Flow...
// click start workout: sets state = running, timer index is 0... then start first timer at index 0
// if timer is a countdown or stopwatch - count to totalSeconds
// if timer is XY - count to totalSeconds for x number of rounds (repeat/loop)
// if timer is Tabata - count work seconds + rest seconds for x number of rounds (repeat/loop)
// timer ends: mark as done, go to next timer. if no next timer, end workout

const WorkoutView = () => {
  const navigate = useNavigate();
  const {timers, removeTimer} = useContext(TimerContext)
  
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


  // show queue of timers
  return (
    <div>
      <h1>Setup Workout</h1>

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
        <Button onClick={runWorkout}>Start Workout</Button>
      </div>
    </div>
  );
};

export default WorkoutView;
