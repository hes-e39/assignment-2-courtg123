import { DisplayTime } from '../../generic/DisplayTime'
import { DisplayRounds } from '../../generic/DisplayRounds'

interface XYDisplayProps {
    workMinValue: number;
    workSecValue: number;
    restMinValue: number;
    restSecValue: number;
    roundsValue: number;
    timeInMs: number;
    currentRound: number;
    currentPhase: 'Work' | 'Rest';
}

const XYDisplay = ({ workMinValue, workSecValue, restMinValue, restSecValue, roundsValue, timeInMs, currentRound, currentPhase }: TabataDisplayProps) => {
    // display timer
    return (
        <div>
            <DisplayTime timeInMs={timeInMs} />
            <DisplayRounds currentRound={currentRound} totalRounds={roundsValue} phase={currentPhase} />
        </div>
    );
}

export default XYDisplay;