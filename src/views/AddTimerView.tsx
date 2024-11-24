import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext'

import { Button } from "../components/generic/Button";
import { Select } from "../components/generic/Select";
import { Panel } from "../components/generic/Panel";

import StopwatchSettings from "../components/timers/settings/StopwatchSettings";
import CountdownSettings from "../components/timers/settings/CountdownSettings";
import XYSettings from "../components/timers/settings/XYSettings";
import TabataSettings from "../components/timers/settings/TabataSettings";
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
    const { index } = useParams()
    const [selectedTimer, setSelectedTimer] = useState<string>('Stopwatch')
    const { timers, addTimer, updateTimer } = useContext(TimerContext)

    // state for this timer
    const [minValue, setMinValue] = useState(0);
    const [secValue, setSecValue] = useState(0);
    const [workMinValue, setWorkMinValue] = useState(0);
    const [workSecValue, setWorkSecValue] = useState(0);
    const [restMinValue, setRestMinValue] = useState(0);
    const [restSecValue, setRestSecValue] = useState(0);
    const [roundsValue, setRoundsValue] = useState(1);

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
            <StopwatchSettings
                minValue={minValue}
                secValue={secValue}
                setMinValue={setMinValue}
                setSecValue={setSecValue}
            />
            )
        }
        if (selectedTimer === 'Countdown') {
            return (
            <CountdownSettings
                minValue={minValue}
                secValue={secValue}
                setMinValue={setMinValue}
                setSecValue={setSecValue}
            />
            )
        }
        if (selectedTimer === 'XY') {
            return (
            <XYSettings
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
            <TabataSettings
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

    useEffect(() => {
        if (index === undefined) {
            return;
        }

        const timer = timers[parseInt(index)]
        if (!timer) {
            return;
        }

        setSelectedTimer(timer.type)

        if (timer.type === 'Countdown' || timer.type === 'Stopwatch') {
            const totalSeconds = timer.settings.totalSeconds;
            setMinValue(Math.floor(totalSeconds / 60));
            setSecValue(totalSeconds % 60);
        }
        else if (timer.type === 'XY') {
            const totalSeconds = timer.settings.totalSeconds;
            setMinValue(Math.floor(totalSeconds / 60));
            setSecValue(totalSeconds % 60);
            setRoundsValue(timer.settings.rounds || 1);
        }
        else if (timer.type === 'Tabata') {
            const workSeconds = timer.settings.workSeconds;
            const restSeconds = timer.settings.restSeconds;
            setWorkMinValue(Math.floor(workSeconds / 60));
            setWorkSecValue(workSeconds % 60);
            setRestMinValue(Math.floor(restSeconds / 60));
            setRestSecValue(restSeconds % 60);
            setRoundsValue(timer.settings.rounds || 1);
        }
    }, [index, timers])

    const handleSave = () => {
        let settings = {};

        if (selectedTimer === 'Countdown' || selectedTimer === 'Stopwatch') {
            const totalSeconds = convertToMs(minValue, secValue) / 1000;
            settings = { totalSeconds };
        }
        else if (selectedTimer === 'XY') {
            const totalSeconds = convertToMs(minValue, secValue) / 1000;
            settings = {
                totalSeconds,
                rounds: roundsValue
            }
        }
        else if (selectedTimer === 'Tabata') {
            const workSeconds = convertToMs(workMinValue, workSecValue) / 1000;
            const restSeconds = convertToMs(restMinValue, restSecValue) / 1000;
            settings = {
                workSeconds,
                restSeconds,
                rounds: roundsValue
            }
        }

        const timerWithSettings: Timer = {
            type: selectedTimer,
            settings,
            state: 'not_started'
        }
        
        // if not editing an existing timer, add as new
        if (index !== undefined) {
            updateTimer(parseInt(index), timerWithSettings)
        } else {
            addTimer(timerWithSettings)
        }
        console.log('Save timer: ', selectedTimer)
        navigate('/')
    }

    return (
        <div className="flex flex-col items-center">
            <h1>Update Timer</h1>

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

            <div>
                <Button onClick={() => navigate('/')}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
     



}