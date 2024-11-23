import { useState, useRef, useEffect } from 'react';
import { PlayPauseButton, FastForwardButton, ResetButton } from '../generic/Button';
import { Input } from '../generic/Input';
import { DisplayTime } from '../generic/DisplayTime';
import { convertToMs } from '../../utils/helpers';

interface CountdownProps {
    minValue: number;
    secValue: number;
    setMinValue: (value: number) => void;
    setSecValue: (value: number) => void;
}

const Countdown = ({ minValue, secValue, setMinValue, setSecValue }: CountdownProps) => {
    const [countdownTime, setCountdownTime] = useState(0);
    const [isCountdownRunning, setIsCountdownRunning] = useState(false);
    const intervalIdRef = useRef<number | undefined>(undefined);

    // clear interval on unmount
    useEffect(() => {
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = undefined;
            }
        }
    }, []);

    // play/pause Countdown timer
    const handleStart = () => {
        const totalMs = convertToMs(minValue, secValue);

        if (!isCountdownRunning && totalMs > 0) {
            setIsCountdownRunning(true);
            setCountdownTime(totalMs);
            
            // interval updates every 10ms
            const interval = setInterval(() => {
                setCountdownTime(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(intervalIdRef.current);
                        setIsCountdownRunning(false);
                        return(0);
                    }
                    return prevTime - 10;
                });
            }, 10);

            // store the interval id
            intervalIdRef.current = interval;
        } else {
            // clear the interval id
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = undefined;
            setIsCountdownRunning(false);
        }
    };

    // reset Countdown timer - stopped, timer at 0, reset to initial state
    const handleReset = () => {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = undefined;
        setIsCountdownRunning(false);
        setCountdownTime(0);
    }

    // fast forward Countdown timer - stopped, timer at 0
    const handleFastForward = () => {
        setCountdownTime(0);
        setIsCountdownRunning(false);
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = undefined;
    }

    // display timer
    return (
        <div>
            <DisplayTime timeInMs={countdownTime} />
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
                    disabled={isCountdownRunning} />
                <Input
                    label="Sec"
                    value={secValue}
                    onChange={setSecValue}
                    placeholder="#"
                    disabled={isCountdownRunning} />
            </div>
        </div>
    );
};

export default Countdown;
