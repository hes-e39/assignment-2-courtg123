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



// "Start Workout" - cannot change timer settings at this point.
// Timers run in order one after another, when one ends next one starts automatically
// Can "fast forward" to next timer? Is that what Fast Forward is for? (confirm this)
  // confirmed per requirement: Controls to "fast-forward" - ends the current running timer and moves onto the next one
// Can pause/resume workout (pauses/resumes current timer only)
// Can end workout (fast forward through all timers in workout timer stack)

// UI: show which timer is currently running
// indicate progress...
// - show which timers have completed (maybe a checkmark in list or something to indicate?)
// - show how many timers remaining
// - maybe: total workout time remaining?

// additional requirements:
// Each timer can be in one of three states: running, completed, and not running. 
// You will need a way to keep track of what state the timer is in, so that you can display it accordingly (see the image above)
// During configuration, the user can remove any timer from the queue, so you will be supporting deleting
// While the timer is running, you will need to either store or dynamically calculate which timer is active.
// You don't want to clear the configurations as the timers are running. The user should be able to restart the entire workout at anytime

const WorkoutView = () => {
  const navigate = useNavigate();
  const {timers, removeTimer} = useContext(TimerContext)
  
  // max of 10 timers
  const MAX_TIMERS = 10;

  // REQS NOTES
  // Should be able to edit timer settings
  // Should be able to remove timer from workout timer queue
  // Maximum of 10 timers is reasonable

  // get timer details and display it
  const displayTimerDetails = (timer: Timer) => {
    return timer.type
  }

  const addTimer = () => {
    console.log("Open add timer")
    navigate('/add');
  }

  // edit a timer
  const editTimer = (index: number) => {
    console.log(`Open ${index} timer (for editing)`)
  }


  // show queue of timers
  return (
    <div>
      <h1>Setup Workout</h1>

      <div>
        {timers.map((timer, index) => (
          <div key={index}>
              {displayTimerDetails(timer)} <Button onClick={editTimer}>Edit</Button><Button onClick={() => removeTimer(index)}>Remove</Button><br />
          </div>
        ))}
               
      </div>
      <div>
        {timers.length >= MAX_TIMERS ? (
          <span class="text-gray-500"><i>You've added the maximum number of timers.</i></span>
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
