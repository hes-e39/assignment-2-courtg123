import { DisplayTime } from '../../generic/DisplayTime'

interface CountdownDisplayProps {
    timeInMs: number;
}

const CountdownDisplay = ({ timeInMs }: CountdownDisplayProps ) => {
    // check that time is 

    // display timer
    return (
        <div>
            <DisplayTime timeInMs={timeInMs} />
        </div>
    )
}

export default CountdownDisplay;