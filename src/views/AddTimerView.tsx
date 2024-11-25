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
import { Timer } from '../types/timers'


export default function AddTimer() {
    const navigate = useNavigate()
    const [selectedTimer, setSelectedTimer] = useState<string>('Stopwatch')
    const { timers, addTimer, updateTimer } = useContext(TimerContext)

    // timer index from URL
    const { index } = useParams()

    // state for this timer
    const [minValue, setMinValue] = useState(0);
    const [secValue, setSecValue] = useState(0);
    const [workMinValue, setWorkMinValue] = useState(0);
    const [workSecValue, setWorkSecValue] = useState(0);
    const [restMinValue, setRestMinValue] = useState(0);
    const [restSecValue, setRestSecValue] = useState(0);
    const [roundsValue, setRoundsValue] = useState(1);

    // Timer types for dropdown
    const timerOptions = [
        { value: 'Stopwatch', label: 'Stopwatch' },
        { value: 'Countdown', label: 'Countdown' },
        { value: 'XY', label: 'XY' },
        { value: 'Tabata', label: 'Tabata' },
    ]

    // Change timer type when dropdown option selected
    const handleTimerChange = (value: string | number) => {
        if(typeof value === 'string') {
            setSelectedTimer(value)
        }
    }

    // Display timer settings by timer type
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

    // Load an existing timer
    useEffect(() => {
        // If not editing existing timer
        if (index === undefined) {
            return;
        }

        // existing timer from the array
        const timer = timers[parseInt(index)]
        if (!timer) {
            return;
        }

        setSelectedTimer(timer.type)

        // Settings for Countdown and Stopwatch
        if (timer.type === 'Countdown' || timer.type === 'Stopwatch') {
            const totalSeconds = timer.settings.totalSeconds;
            setMinValue(Math.floor((totalSeconds || 0) / 60));
            setSecValue((totalSeconds || 0) % 60);
        }
        // Settings for XY
        else if (timer.type === 'XY') {
            const totalSeconds = timer.settings.totalSeconds;
            setMinValue(Math.floor((totalSeconds || 0) / 60));
            setSecValue((totalSeconds || 0) % 60);
            setRoundsValue(timer.settings.rounds || 1);
        }
        // Settings for Tabata
        else if (timer.type === 'Tabata') {
            const workSeconds = timer.settings.workSeconds;
            const restSeconds = timer.settings.restSeconds;
            setWorkMinValue(Math.floor((workSeconds || 0) / 60));
            setWorkSecValue((workSeconds || 0) % 60);
            setRestMinValue(Math.floor((restSeconds || 0) / 60));
            setRestSecValue((restSeconds || 0) % 60);
            setRoundsValue(timer.settings.rounds || 1);
        }
    }, [index, timers]) // Added dependencies for timer index and timers = re-run if index or array changes

    // Save timer with settings
    const handleSave = () => {
        let settings = {};

        // if timer is Countdown or Stopwatch
        if (selectedTimer === 'Countdown' || selectedTimer === 'Stopwatch') {
            // minutes and seconds cannot be 0
            if (minValue === 0 && secValue === 0) {
                alert('Timer time must be greater than 0')
                return
            }
            const totalSeconds = convertToMs(minValue, secValue) / 1000;
            settings = { totalSeconds };
        }
        // if timer is XY
        else if (selectedTimer === 'XY') {
            // minutes and seconds cannot be 0
            if (minValue === 0 && secValue === 0) {
                alert('Timer time must be greater than 0')
                return
            }
            const totalSeconds = convertToMs(minValue, secValue) / 1000;
            settings = {
                totalSeconds,
                rounds: roundsValue
            }
        }
        // if timer is Tabata
        else if (selectedTimer === 'Tabata') {
            if ((workMinValue === 0 && workSecValue === 0) || (restMinValue === 0 && restSecValue === 0)) {
                alert('Timer work and rest times must be greater than 0')
                return
            }

            const workSeconds = convertToMs(workMinValue, workSecValue) / 1000;
            const restSeconds = convertToMs(restMinValue, restSecValue) / 1000;
            settings = {
                workSeconds,
                restSeconds,
                rounds: roundsValue
            }
        }

        // Create timer with settings
        const timerWithSettings: Timer = {
            type: selectedTimer,
            settings,
            state: 'not_started'
        }
        
        // If not editing an existing timer, add as new
        if (index !== undefined) {
            updateTimer(parseInt(index), timerWithSettings)
        } else {
            addTimer(timerWithSettings)
        }
        console.log('Save timer: ', selectedTimer)
        navigate('/')
    }

    // Display timer settings inputs
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