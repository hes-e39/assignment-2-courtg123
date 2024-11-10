import { useState, useRef, useEffect } from'react';
import { PlayPauseButton, FastForwardButton, ResetButton } from '../generic/Button';
import { Input } from '../generic/Input';
import { DisplayTime } from '../generic/DisplayTime';
import { DisplayRounds } from '../generic/DisplayRounds';
import { convertToMs } from '../../utils/helpers';

const Tabata = () => {
    const [workMinTimeValue, setWorkMinTimeValue] = useState(0);
    const [workSecTimeValue, setWorkSecTimeValue] = useState(0);
    const [restMinTimeValue, setRestMinTimeValue] = useState(0);
    const [restSecTimeValue, setRestSecTimeValue] = useState(0);
    const [tabataRoundsValue, setTabataRoundsValue] = useState(1);
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
        const workTime = convertToMs(workMinTimeValue, workSecTimeValue);
        setTabataTime(workTime);
        tabataTimeRef.current = workTime;
        setCurrentPhase('Work');
        tabataPhaseRef.current = 'Work';
    }

    // play/pause Tabata timer
    const handleStart = () => {
        if (!isTabataRunning && (workMinTimeValue > 0 || workSecTimeValue > 0) && !isTabataCompleted) {
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
        setTabataRound(tabataRoundsValue);
        tabataRoundRef.current = tabataRoundsValue;
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
                            return convertToMs(restMinTimeValue, restSecTimeValue);
                        } else {
                            // check if all rounds completed
                            if (tabataRoundRef.current >= tabataRoundsValue) {
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
                            return convertToMs(workMinTimeValue, workSecTimeValue);
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
    }, [isTabataRunning, tabataRoundsValue, workMinTimeValue, workSecTimeValue, restMinTimeValue, restSecTimeValue]);

    // display timer
    return (
        <div>
            <DisplayTime timeInMs={tabataTime} />
            <DisplayRounds currentRound={tabataRound} totalRounds={tabataRoundsValue} phase={currentPhase} />
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
                            value={workMinTimeValue}
                            onChange={setWorkMinTimeValue}
                            placeholder="#"
                            disabled={isTabataRunning}
                        />
                        <Input
                            label="Sec"
                            value={workSecTimeValue}
                            onChange={setWorkSecTimeValue}
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
                            value={restMinTimeValue}
                            onChange={setRestMinTimeValue}
                            placeholder="#" 
                            disabled={isTabataRunning}
                        />
                        <Input
                            label="Sec"
                            value={restSecTimeValue}
                            onChange={setRestSecTimeValue}
                            placeholder="#"
                            disabled={isTabataRunning}
                        />
                    </div>
                </div>
            </div>
                <Input
                    label="Rounds"
                    value={tabataRoundsValue}
                    onChange={setTabataRoundsValue}
                    min={1}
                    placeholder="#"
                    disabled={isTabataRunning}
                />
            
        </div>
    );
};

export default Tabata;

