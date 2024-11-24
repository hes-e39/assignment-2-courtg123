import { DisplayTime } from '../../generic/DisplayTime'

interface StopwatchDisplayProps {
    timeInMs: number;
}

const StopwatchDisplay = ({ timeInMs }: StopwatchDisplayProps ) => {
    // display timer
    return (
        <div>
            <DisplayTime timeInMs={timeInMs} />
        </div>
    )
}

export default StopwatchDisplay;