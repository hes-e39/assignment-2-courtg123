import { DisplayTime } from '../../generic/DisplayTime'
import { DisplayRounds } from '../../generic/DisplayRounds'
import { Button, PlayPauseButton, FastForwardButton, ResetButton } from '../../generic/Button'

interface TimerDisplayProps {
    timeInMs: number;
    type: string;
    roundsValue?: number;
    currentRound?: number;
    currentPhase?: 'Work' | 'Rest';
    running: boolean;
    completed: boolean;
    hasStarted: boolean;
    isFirstTimer: boolean;
    handleStart: () => void;
    handleReset: () => void;
    handleFastForward: () => void;
}

const TimerDisplay = ({ timeInMs, roundsValue, currentRound, currentPhase, running, completed, type, hasStarted, isFirstTimer, handleStart, handleReset, handleFastForward }: TimerDisplayProps) => {
    const showRounds = type === 'XY' || type === 'Tabata'
    const showPhase = type === 'Tabata'

    // if on first timer and not running = workout not started yet
    if (isFirstTimer && !hasStarted) {
        return (
            <div className="text-center">
                <h2 className="text-xl">Ready to workout?</h2>
                <Button onClick={handleStart}>Start Workout</Button>
            </div>
        )
    }

    // if workout completed
    if (completed) {
        return (
            <div className="text-center">
                <h2 className="text-xl text-yellow-200">Workout complete! Way to go!</h2>
                <Button onClick={handleReset}>Reset Workout</Button>
            </div>
        )
    }

    // display timer
    return (
        <div>
            <div>
                <DisplayTime timeInMs={timeInMs} />
                {showRounds && roundsValue && currentRound && (
                    <DisplayRounds currentRound={currentRound} totalRounds={roundsValue} phase={showPhase ? currentPhase : undefined} />
                )}
            </div>
            <div>
                <ResetButton onClick={handleReset} />
                <PlayPauseButton onClick={handleStart} isRunning={running} />
                <FastForwardButton onClick={handleFastForward} />
            </div>
        </div>
    );
}

export default TimerDisplay;