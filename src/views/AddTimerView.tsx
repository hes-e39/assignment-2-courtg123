import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/generic/Button";
import { Select } from "../components/generic/Select";
import { Panel } from "../components/generic/Panel";

import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

export default function AddTimer() {
    const navigate = useNavigate()
    const [selectedTimer, setSelectedTimer] = useState<string>('Stopwatch')

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
        if (selectedTimer === 'Stopwatch') return <Stopwatch />
        if (selectedTimer === 'Countdown') return <Countdown />
        if (selectedTimer === 'XY') return <XY />
        if (selectedTimer === 'Tabata') return <Tabata />
    }

    const handleSave = () => {
        // TO DO save timer with settings
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