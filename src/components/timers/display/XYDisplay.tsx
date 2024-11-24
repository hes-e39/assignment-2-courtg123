import { DisplayTime } from '../../generic/DisplayTime'
import { DisplayRounds } from '../../generic/DisplayRounds'

interface XYDisplayProps {
    roundsValue: number;
    timeInMs: number;
    currentRound: number;
    minValue: number;
    secValue: number;
}

const XYDisplay = ({ roundsValue, timeInMs, currentRound, minValue, secValue }: XYDisplayProps) => {
    // display timer
    return (
        <div>
            <DisplayTime timeInMs={timeInMs} />
            <DisplayRounds currentRound={currentRound} totalRounds={roundsValue} />
        </div>
    );
}

export default XYDisplay;