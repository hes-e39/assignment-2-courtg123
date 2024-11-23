import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext'

import { Button } from "../components/generic/Button";
import { Select } from "../components/generic/Select";
import { Panel } from "../components/generic/Panel";

import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import { convertToMs } from '../utils/helpers';

interface Timer {
    type: string;
    settings: {
      totalSeconds?: number;
      rounds?: number;
      workSeconds?: number;
      restSeconds?: number;
    };
    state: 'not_started' | 'running' | 'completed';
  }

export default function AddTimer() {
    const navigate = useNavigate()
    const [selectedTimer, setSelectedTimer] = useState<string>('Stopwatch')
    const { addTimer } = useContext(TimerContext)

    // state for this timer
    const [minValue, setMinValue] = useState(0);
    const [secValue, setSecValue] = useState(0);
    const [workMinValue, setWorkMinValue] = useState(0);
    const [workSecValue, setWorkSecValue] = useState(0);
    const [restMinValue, setRestMinValue] = useState(0);
    const [restSecValue, setRestSecValue] = useState(0);
    const [roundsValue, setRoundsValue] = useState(0);

    const timerOptions = [
        { value: 'Stopwatch', label: 'Stopwatch' },
        { value: 'Countdown', label: 'Countdown' },
        { value: 'XY', label: 'XY' },
        { value: 'Tabata', label: 'Tabata' },
    ]

    const handleTimerChange = (value: string | number) => {
        if(typeof value === 'string') {
            setSelectedTimer(value)
        }
    }

    const displayTimer = () => {
        console.log('Timer selected: ', selectedTimer)
        if (selectedTimer === 'Stopwatch') {
            return (
            <Stopwatch
                minValue={minValue}
                secValue={secValue}
                setMinValue={setMinValue}
                setSecValue={setSecValue}
            />
            )
        }
        if (selectedTimer === 'Countdown') {
            return (
            <Countdown
                minValue={minValue}
                secValue={secValue}
                setMinValue={setMinValue}
                setSecValue={setSecValue}
            />
            )
        }
        if (selectedTimer === 'XY') {
            return (
            <XY
                minValue={minValue}
                secValue={secValue}
                roundsValue={roundsValue}
                setMinValue={setMinValue}
                setSecValue={setSecValue}
                setRoundsValue={setRoundsValue}
            />
            )
        }
        if (selectedTimer === 'Tabata') {
            return (
            <Tabata
                workMinValue={workMinValue}
                workSecValue={workSecValue}
                restMinValue={restMinValue}
                restSecValue={restSecValue}
                roundsValue={roundsValue}
                setWorkMinValue={setWorkMinValue}
                setWorkSecValue={setWorkSecValue}
                setRestMinValue={setRestMinValue}
                setRestSecValue={setRestSecValue}
                setRoundsValue={setRoundsValue}
            />
            )
        }
    }

    const handleSave = () => {
        let settings = {};

        if (selectedTimer === 'Countdown' || selectedTimer === 'Stopwatch') {
            const totalSeconds = convertToMs(minValue, secValue) / 1000;
            settings = { totalSeconds };
        }

        const newTimer: Timer = {
            type: selectedTimer,
            settings,
            state: 'not_started'
        }
        
        addTimer(newTimer)
        console.log('Save timer: ', selectedTimer)
        navigate('/')
    }

    return (
        <div>
            <h1>Add Timer</h1>

            <Select
                label="Timer Type"
                value={String(selectedTimer)}
                options={timerOptions}
                onChange={handleTimerChange}
            />

            <Panel
                title={String(selectedTimer)}
            >
                {displayTimer()}
            </Panel>

            <Button onClick={() => navigate('/')}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
        </div>
    )
     



}