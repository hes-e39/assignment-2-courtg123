import { useState, useRef, useEffect } from'react';
import { PlayPauseButton, FastForwardButton, ResetButton } from '../generic/Button';
import { Input } from '../generic/Input';
import { DisplayTime } from '../generic/DisplayTime';
import { DisplayRounds } from '../generic/DisplayRounds';
import { convertToMs } from '../../utils/helpers';

interface TabataProps {
    workMinValue: number;
    workSecValue: number;
    restMinValue: number;
    restSecValue: number;
    roundsValue: number;
    setWorkMinValue: (value: number) => void;
    setWorkSecValue: (value: number) => void;
    setRestMinValue: (value: number) => void;
    setRestSecValue: (value: number) => void;
    setRoundsValue: (value: number) => void;
}

const Tabata = ({ workMinValue, workSecValue, restMinValue, restSecValue, roundsValue, setWorkMinValue, setWorkSecValue, setRestMinValue, setRestSecValue, setRoundsValue }: TabataProps) => {
    const [tabataTime, setTabataTime] = useState(0);
    const [isTabataRunning, setIsTabataRunning] = useState(false);
    const [tabataRound, setTabataRound] = useState(1);
    const [isTabataCompleted, setIsTabataCompleted] = useState(false);
    const [currentPhase, setCurrentPhase] = useState<'Work' | 'Rest'>('Work');

    const tabataTimeRef = useRef(0);
    const tabataRoundRef = useRef(1);
    const tabataPhaseRef = useRef<'Work' | 'Rest'>('Work');

    // reset timer value to initial time
    const resetTimer = () => {
        const workTime = convertToMs(workMinValue, workSecValue);
        setTabataTime(workTime);
        tabataTimeRef.current = workTime;
        setCurrentPhase('Work');
        tabataPhaseRef.current = 'Work';
    }

    // play/pause Tabata timer
    const handleStart = () => {
        if (!isTabataRunning && (workMinValue > 0 || workSecValue > 0) && !isTabataCompleted) {
            // check if it is the first start
            if (tabataTime === 0 && currentPhase === 'Work' && tabataRound === 1) {
                resetTimer();
            }
            setIsTabataRunning(true);
        } else {
            setIsTabataRunning(false);
        }
    }

    // reset Tabata timer - stopped, round 1, work phase
    const handleReset = () => {
        setIsTabataRunning(false);
        setIsTabataCompleted(false);
        setTabataRound(1);
        tabataRoundRef.current = 1;
        resetTimer();
    }

    // fast forward Tabata timer - all rounds completed, timer at 0, rest phase
    const handleFastForward = () => {
        setIsTabataRunning(false);
        setIsTabataCompleted(true);
        setTabataRound(roundsValue);
        tabataRoundRef.current = roundsValue;
        setTabataTime(0);
        tabataTimeRef.current = 0;
        setCurrentPhase('Rest');
        tabataPhaseRef.current = 'Rest';
    }

    // timer hook
    useEffect(() => {
        // interval
        let interval: number;

        if(isTabataRunning) {
            // interval updates every 10ms
            interval = setInterval(() => {
                setTabataTime((prevTime) => {
                    // check if current interval completed
                    if (prevTime <= 0) {
                        // flip between work and rest
                        if (tabataPhaseRef.current === 'Work') {
                            tabataPhaseRef.current = 'Rest';
                            setCurrentPhase('Rest');
                            return convertToMs(restMinValue, restSecValue);
                        } else {
                            // check if all rounds completed
                            if (tabataRoundRef.current >= roundsValue) {
                                // completed - stop timer and update state
                                setIsTabataRunning(false);
                                setIsTabataCompleted(true);
                                return 0;
                            }
                            // increment round and flip back to work
                            tabataRoundRef.current += 1;
                            setTabataRound(tabataRoundRef.current);
                            tabataPhaseRef.current = 'Work';
                            setCurrentPhase('Work');
                            return convertToMs(workMinValue, workSecValue);
                        }
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
    }, [isTabataRunning, roundsValue, workMinValue, workSecValue, restMinValue, restSecValue]);

    // display timer
    return (
        <div>
            <DisplayTime timeInMs={tabataTime} />
            <DisplayRounds currentRound={tabataRound} totalRounds={roundsValue} phase={currentPhase} />
            <div className="mb-8">
                <PlayPauseButton onClick={handleStart} />
                <FastForwardButton onClick={handleFastForward} />
                <ResetButton onClick={handleReset} />
            </div>
            <hr className="opacity-10" />
            <div className="mt-8 flex flex-row justify-center items-center space-x-8">
                <div className="mb-6">
                    <p className="font-bold mb-2">Work</p>
                    <div className="flex flex-row justify-center items-center">
                        <Input
                            label="Min"
                            value={workMinValue}
                            onChange={setWorkMinValue}
                            placeholder="#"
                            disabled={isTabataRunning}
                        />
                        <Input
                            label="Sec"
                            value={workSecValue}
                            onChange={setWorkSecValue}
                            placeholder="#"
                            disabled={isTabataRunning}
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <p className="font-bold mb-2">Rest</p>
                    <div className="flex flex-row justify-center items-center">
                        <Input
                            label="Min"
                            value={restMinValue}
                            onChange={setRestMinValue}
                            placeholder="#" 
                            disabled={isTabataRunning}
                        />
                        <Input
                            label="Sec"
                            value={restSecValue}
                            onChange={setRestSecValue}
                            placeholder="#"
                            disabled={isTabataRunning}
                        />
                    </div>
                </div>
            </div>
                <Input
                    label="Rounds"
                    value={roundsValue}
                    onChange={setRoundsValue}
                    min={1}
                    placeholder="#"
                    disabled={isTabataRunning}
                />
            
        </div>
    );
};

export default Tabata;

