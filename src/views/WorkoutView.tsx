import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { TimerContext } from '../context/TimerContext'
import { convertToMs } from '../utils/helpers'

import { Panel } from "../components/generic/Panel";
import { Button, PlayPauseButton, FastForwardButton, ResetButton } from "../components/generic/Button";

import StopwatchDisplay from "../components/timers/display/StopwatchDisplay";
import CountdownDisplay from "../components/timers/display/CountdownDisplay";
import XYDisplay from "../components/timers/display/XYDisplay";
import TabataDisplay from "../components/timers/display/TabataDisplay";


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


const WorkoutView = () => {
  const navigate = useNavigate();
  const {timers, removeTimer, running, timeInMs, currentTimer, currentTimerIndex, toggleRunning, currentPhase, currentRound, fastForward, resetWorkout} = useContext(TimerContext)
  
  // max of 10 timers
  const MAX_TIMERS = 10;

  // get timer details and display it
  const displayTimerDetails = (timer: Timer) => {
    const { type, settings } = timer
    
    let details = `${type}: `;

    
    if (settings.rounds) {
      details += `${settings.rounds} Rounds x `
    }
    if (settings.totalSeconds) {
      details += `${Math.floor(settings.totalSeconds / 60)} min ${settings.totalSeconds % 60} sec `;
    }
    if (settings.workSeconds && settings.restSeconds) {
      const workMin = Math.floor(settings.workSeconds / 60)
      const workSec = settings.workSeconds % 60
      const restMin = Math.floor(settings.restSeconds / 60)
      const restSec = settings.restSeconds % 60

      details += `(${workMin}min ${workSec} sec Work & ${restMin} sec ${restSec}sec Rest)`;
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
    resetWorkout()
  }

  const handleFastForward = () => {
    fastForward();
  }

  // current timer display
  const renderCurrentTimer = () => {
    if (!currentTimer || !running) return null;

    // time remaining calculation
    const timeRemainingMs = (() => {
      if (currentTimer.type === 'Countdown') {
        const totalMs = convertToMs(0, currentTimer.settings.totalSeconds || 0)
        return Math.max(0, totalMs - timeInMs)
      }
      else if (currentTimer.type === 'Stopwatch') {
        return timeInMs
      }
      else if (currentTimer.type === 'XY') {
        return timeInMs
      }
      else if (currentTimer.type === 'Tabata') {
        return timeInMs
      }
      return timeInMs
    })();


    
    const getTimerDisplay = () => {
      if (currentTimer.type === 'Countdown') {
        return <CountdownDisplay timeInMs={timeRemainingMs} />
      }
      if (currentTimer.type === 'Stopwatch') {
        return <StopwatchDisplay timeInMs={timeRemainingMs} />
      }
      if (currentTimer.type === 'XY') {
        return (
          <XYDisplay
            timeInMs={timeInMs}
            roundsValue={currentTimer.settings.rounds}
            currentRound={currentRound}
            minValue={Math.floor(currentTimer.settings.totalSeconds / 60)}
            secValue={currentTimer.settings.totalSeconds % 60}
          />
        )
      }
      if (currentTimer.type === 'Tabata') {
        return (
          <TabataDisplay
            timeInMs={timeInMs}
            roundsValue = {currentTimer.settings.rounds}
            currentRound={currentRound}
            currentPhase={currentPhase}
            workMinValue = {Math.floor(currentTimer.settings.workSeconds) / 60}
            workSecValue = {currentTimer.settings.workSeconds % 60}
            restMinValue = {Math.floor(currentTimer.settings.restSeconds) / 60}
            restSecValue = {currentTimer.settings.restSeconds % 60}
          />
        )
      }
      return null
    }

    return (
      <Panel title={`Current: ${currentTimer.type}`}>
        {getTimerDisplay()}
        <div className="text-sm text-gray-400 mt-2">
          {displayTimerDetails(currentTimer)}
        </div>
      </Panel>
    )
  }
  

  // show queue of timers
  return (
    <div className="flex flex-col items-center w-full max-w-3xl px-4 mx-auto">
      <h1>Workout</h1>

      {renderCurrentTimer()}

      <div className="w-full max-w-xl">
        {timers.map((timer, index) => (
          <div key={index}
          className={`
            flex
            justify-between
            items-center
            mb-2 
            p-2 
            rounded-lg
            bg-slate-900/50
            ${timer.state === 'completed' ? 'line-through text-gray-600' : ''}
            ${index === currentTimerIndex ? 'text-lime-200' : ''}
          `}>
            <div className="flex-grow text-center">
              {displayTimerDetails(timer)}
            </div>
            <div className="flex gap-2 ml-4">
              <Button onClick={() => editTimer(index)}>Edit</Button>
              <Button onClick={() => removeTimer(index)}>Remove</Button><br />
            </div>
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
