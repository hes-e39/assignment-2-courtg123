import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { TimerContext } from '../context/TimerContext'
import { convertToMs } from '../utils/helpers'

import { Panel } from "../components/generic/Panel";
import { Button } from "../components/generic/Button";

import TimerDisplay from "../components/timers/display/TimerDisplay";


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

  // get timer details and display it within queue
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

  // add a timer to the workout
  const addTimer = () => {
    navigate('/add');
  }

  // edit a timer
  const editTimer = (index: number) => {
    navigate(`/edit/${index}`)
  }

  // start workout
  const runWorkout = () => {
    toggleRunning()
  }

  // reset workout
  const handleReset = () => {
    resetWorkout()
  }

  // fast forward to next timer
  const handleFastForward = () => {
    fastForward();
  }

  // render current timer display
  const renderCurrentTimer = () => {
    if (!currentTimer) return null;

    const isCompleted = timers.every(timer => timer.state === 'completed')
    const isFirstTimer = currentTimerIndex === 0
    const hasStarted = currentTimer.state !== 'not_started'

    // time remaining calculation
    const timeRemainingMs = (() => {
      if (currentTimer.type === 'Countdown') {
        const totalMs = convertToMs(0, currentTimer.settings.totalSeconds || 0)
        return Math.max(0, totalMs - timeInMs)
      }
      return timeInMs
    })();


    // render timer panel
    return (
      <Panel title={(isFirstTimer && !hasStarted) || isCompleted ? undefined: `Current: ${currentTimer.type}`}>
        <TimerDisplay
          timeInMs={timeRemainingMs}
          type={currentTimer.type}
          roundsValue={currentTimer.settings.rounds}
          currentRound={currentRound}
          currentPhase={currentPhase}
          running={running}
          completed={isCompleted}
          isFirstTimer={isFirstTimer}
          hasStarted={hasStarted}
          handleStart={runWorkout}
          handleReset={handleReset}
          handleFastForward={handleFastForward}
        />
        {!((isFirstTimer && !hasStarted) || isCompleted) && (
          <div className="text-sm text-gray-400 mt-2">
            {displayTimerDetails(currentTimer)}
          </div>
        )}
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
              <Button
                onClick={() => editTimer(index)}
                disabled={index <= currentTimerIndex || timer.state === 'completed'}
              >
                Edit
              </Button>
              <Button
                onClick={() => removeTimer(index)}
                disabled={index <= currentTimerIndex || timer.state === 'completed'}
              >
                Remove
              </Button>
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
    </div>
  );
};

export default WorkoutView;
