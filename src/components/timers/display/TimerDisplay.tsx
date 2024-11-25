import { DisplayTime } from '../../generic/DisplayTime'
import { DisplayRounds } from '../../generic/DisplayRounds'

interface TimerDisplayProps {
    timeInMs: number;
    type: string;
    roundsValue?: number;
    currentRound?: number;
    currentPhase?: 'Work' | 'Rest';
    running: boolean;
}

const TimerDisplay = ({ timeInMs, roundsValue, currentRound, currentPhase, running, type }: TimerDisplayProps) => {
    const showRounds = type === 'XY' || type === 'Tabata'
    const showPhase = type === 'Tabata'

    // display timer
    return (
        <div>
            <DisplayTime timeInMs={timeInMs} />
            {showRounds && roundsValue && currentRound && (
                <DisplayRounds currentRound={currentRound} totalRounds={roundsValue} phase={showPhase ? currentPhase : undefined} />
            )}
        </div>
    );
}

export default TimerDisplay;