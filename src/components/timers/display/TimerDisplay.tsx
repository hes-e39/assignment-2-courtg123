import { DisplayTime } from '../../generic/DisplayTime'
import { DisplayRounds } from '../../generic/DisplayRounds'

interface TimerDisplayProps {
    timeInMs: number;
    type: string;
    roundsValue?: number;
    currentRound?: number;
    currentPhase?: 'Work' | 'Rest';
    running: boolean;
    completed: boolean;
    onStart: () => void;
}

const TabataDisplay = ({ timeInMs, roundsValue, currentRound, currentPhase }: TabataDisplayProps) => {
    // display timer
    return (
        <div>
            <DisplayTime timeInMs={timeInMs} />
            <DisplayRounds currentRound={currentRound} totalRounds={roundsValue} phase={currentPhase} />
        </div>
    );
}

export default TabataDisplay;