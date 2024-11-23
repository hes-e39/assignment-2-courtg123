import { useState } from 'react';
import { PlayPauseButton, FastForwardButton, ResetButton } from '../generic/Button';
import { Input } from '../generic/Input';
import { DisplayTime } from '../generic/DisplayTime';
import { convertToMs } from '../../utils/helpers';

interface StopwatchProps {
    minValue: number;
    secValue: number;
    setMinValue: (value: number) => void;
    setSecValue: (value: number) => void;
}

const Stopwatch = ({ minValue, secValue, setMinValue, setSecValue }: StopwatchProps) => {
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
    const [intervalId, setIntervalId] = useState(0);

    // play/pause Stopwatch timer
    const handleStart = () => {
        const totalMs = convertToMs(minValue, secValue);

        if (!isStopwatchRunning && totalMs > 0) {
            setIsStopwatchRunning(true);
            
            // interval updates every 10ms
            const interval = setInterval(() => {
                setStopwatchTime(prevTime => {
                    if (prevTime >= totalMs) {
                        clearInterval(interval);
                        setIsStopwatchRunning(false);
                        return totalMs;
                    }
                    return prevTime + 10;
                });
            }, 10);

            // store the interval id
            setIntervalId(interval);
        } else {
            // clear the interval id
            clearInterval(intervalId);
            setIsStopwatchRunning(false);
        }
    };

    // reset Stopwatch timer - stopped, timer at 0, reset to initial state
    const handleReset = () => {
        clearInterval(intervalId);
        setIsStopwatchRunning(false);
        setStopwatchTime(0);
    }

    // fast forward Stopwatch timer - stopped, timer at end time
    const handleFastForward = () => {
        setIsStopwatchRunning(false);
        const totalMs = convertToMs(minValue, secValue);
        setStopwatchTime(totalMs);
        return totalMs;
    }
    
    // display timer
    return (
        <div>
            <DisplayTime timeInMs={stopwatchTime} />
            <div className="mb-8">
                <PlayPauseButton onClick={handleStart} />
                <FastForwardButton onClick={handleFastForward} />
                <ResetButton onClick={handleReset} />
            </div>
            <hr className="opacity-10" />
            <div className="mt-8 flex flex-row justify-center items-center">
                <Input
                    label="Min"
                    value={minValue}
                    onChange={setMinValue}
                    placeholder="#"
                    disabled={isStopwatchRunning} />
                <Input
                    label="Sec"
                    value={secValue}
                    onChange={setSecValue}
                    placeholder="#"
                    disabled={isStopwatchRunning} />
            </div>

        </div>
    );
};

export default Stopwatch;
