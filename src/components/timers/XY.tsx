import { useState, useEffect, useRef } from 'react';
import { FastForwardButton, PlayPauseButton, ResetButton } from '../generic/Button';
import { Input } from '../generic/Input';
import { DisplayTime } from '../generic/DisplayTime';
import { DisplayRounds } from '../generic/DisplayRounds';
import { convertToMs } from '../../utils/helpers';

interface XYProps {
    minValue: number;
    secValue: number;
    roundsValue: number;
    setMinValue: (value: number) => void;
    setSecValue: (value: number) => void;
    setRoundsValue: (value: number) => void;
}

const XY = ({ minValue, secValue, roundsValue, setMinValue, setSecValue, setRoundsValue }: XYProps) => {
    const [xyTime, setXYTime] = useState(0);
    const [isXYRunning, setIsXYRunning] = useState(false);
    const [xyRound, setXYRound] = useState(1);
    const [isXYCompleted, setIsXYCompleted] = useState(false);

    const xyTimeRef = useRef(0);
    const xyRoundRef = useRef(1);

    // reset timer value to initial time
    const resetTimer = () => {
        const totalMs = convertToMs(minValue, secValue);
        setXYTime(totalMs);
        xyTimeRef.current = totalMs;
    }

    // play/pause XY timer
    const handleStart = () => {
        if (!isXYRunning && (minValue > 0 || secValue > 0) && !isXYCompleted) {
            // check if it is the first start
            if (xyTime === 0 && xyRound === 1) {
                resetTimer();
            }
            setIsXYRunning(true);
        } else {
            setIsXYRunning(false);
        }
    }

    // reset XY timer - stopped, round 1, initial time
    const handleReset = () => {
        setIsXYRunning(false);
        setIsXYCompleted(false);
        setXYRound(1);
        resetTimer();
    }

    // fast forward XY timer - all rounds completed, timer at 0
    const handleFastForward = () => {
        setIsXYRunning(false);
        setIsXYCompleted(true);
        setXYRound(roundsValue);
        xyRoundRef.current = roundsValue;
        setXYTime(0);
        xyTimeRef.current = 0;
    }

    // timer hook 
    useEffect(() => {
        // interval
        let interval: number;

        if(isXYRunning) {
            // interval updates every 10ms
            interval = setInterval(() => {
                setXYTime((prevTime) => {
                    // check if current interval completed
                    if (prevTime <= 0) {
                        // check if all rounds completed
                        if (xyRound >= roundsValue) {
                            // completed - stop timer
                            setIsXYRunning(false);
                            return 0;
                        }
                        // increment round
                        setXYRound((prevRound) => prevRound + 1);
                        return convertToMs(minValue, secValue);
                    }
                    // decrease timer by 10ms
                    return prevTime - 10;
                })
            }, 10)
        }

        // clean up setInterval
        return () => {
            if (interval) clearInterval(interval);
        }
    }, [isXYRunning, xyRound, roundsValue, minValue, secValue]);

    // display timer
    return (
        <div>
            <DisplayTime timeInMs={xyTime} />
            <DisplayRounds currentRound={xyRound} totalRounds={roundsValue} />
            <div className="mb-8">
                <PlayPauseButton onClick={handleStart} />
                <FastForwardButton onClick={handleFastForward} />
                <ResetButton onClick={handleReset} />
            </div>
            <hr className="opacity-10" />
            <div className="mt-8">
                    <p className="font-bold mb-2">Time</p>
            </div>
            <div className="flex flex-row justify-center items-center mb-6">
                <Input
                    label="Min"
                    value={minValue}
                    onChange={setMinValue}
                    placeholder="#"
                    disabled={isXYRunning}
                />
                <Input
                    label="Sec"
                    value={secValue}
                    onChange={setSecValue}
                    placeholder="#"
                    disabled={isXYRunning}
                />
            </div>
            <Input
                label="Rounds"
                value={roundsValue}
                onChange={setRoundsValue}
                min={0}
                placeholder="#"
                disabled={isXYRunning}
            />

        </div>
    );
};

export default XY;

