import { createContext, useState, useEffect } from 'react'
import { Timer } from '../types/timers'

// Global context for Timer
export const TimerContext = createContext({
    timers: [] as Timer[],
    timeInMs: 0,
    running: false,
    currentTimer: null as Timer | null,
    currentTimerIndex: 0,
    currentPhase: 'Work',
    currentRound: 1,
    addTimer: (_timer: Timer) => {},
    removeTimer: (_index: number) => {},
    updateTimer: (_index: number, _timer: Timer) => {},
    toggleRunning: () => {},
    fastForward: () => {},
    resetWorkout: () => {}
})

// Workout functionality
export function WorkoutProvider({ children }:  { children: React.ReactNode }) {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [running, setRunning] = useState(false);
    const [timeInMs, setTimeInMs] = useState(0);
    const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
    const [currentPhase, setCurrentPhase] = useState<'Work' | 'Rest'>('Work')
    const [currentRound, setCurrentRound] = useState(1)

    // Current timer by index
    const currentTimer = timers[currentTimerIndex] || null;

    // Add timer
    const addTimer = (timer: Timer) => {
        setTimers([...timers, timer])
    }

    // Remove timer
    const removeTimer = (index: number) => {
        const newTimers = [...timers];
        newTimers.splice(index, 1);
        setTimers(newTimers);
    }

    // Edit/update timer
    const updateTimer = (index: number, timer: Timer) => {
        setTimers(timers => {
            const newTimers = [...timers];
            newTimers[index] = timer;
            return newTimers;
        })
    }

    // Toggle running/paused
    const toggleRunning = () => {

        const newRunningState = !running;
        console.log('Workout running: ', newRunningState);
        console.log('Current timer index: ', currentTimerIndex);
        console.log('Current timer: ', currentTimer);
        setRunning(newRunningState)
    }

    // Fast forward
    const fastForward = () => {
        if (!currentTimer) return

        // Complete current timer
        const newTimers = [...timers]
        newTimers[currentTimerIndex].state = 'completed'
        setTimers(newTimers)

            // If no next timer, complete workout
            if (currentTimerIndex < timers.length - 1) {
                setCurrentTimerIndex(prev => prev +1)
                return 0
            } else {
                setRunning(false)
                alert('Workout complete!')
                return 0
            }
    }

    // Reset workout
    const resetWorkout = () => {
        setRunning(false)
        setTimeInMs(0)
        setCurrentTimerIndex(0)
        setCurrentRound(1)
        setCurrentPhase('Work')

        // Set all timers to not_started state
        const resetTimers = timers.map(timer => ({
            ...timer,
            state: 'not_started' as const
        }))
        setTimers(resetTimers)
    }

    // Workout timer hook
    useEffect(() => {
        // Interval
        let interval: number | undefined;

        if (running && currentTimer) {
            // Initialize timer
            if (currentTimer.state === 'not_started') {
                if (currentTimer.type === 'Tabata') {
                    setTimeInMs((currentTimer.settings.workSeconds || 0) * 1000);
                    setCurrentPhase('Work');
                    setCurrentRound(1);
                    const newTimers = [...timers];
                    newTimers[currentTimerIndex].state = 'running';
                    setTimers(newTimers);
                } else if (currentTimer.type === 'XY') {
                    setTimeInMs((currentTimer.settings.totalSeconds || 0) * 1000)
                    setCurrentRound(1)
                } else if (currentTimer.type === 'Countdown') {
                    setTimeInMs((currentTimer.settings.totalSeconds || 0) * 1000)
                } else {
                    setTimeInMs(0)
                }
                const newTimers = [...timers]
                newTimers[currentTimerIndex].state = 'running'
                setTimers(newTimers)
            }

            // Timer interval of 10ms
            interval = setInterval(() => {
                setTimeInMs(prevTime => {

                    // Complete timer
                    const completeCurrentTimer = () => {
                        const newTimers = [...timers]
                        newTimers[currentTimerIndex].state = 'completed'
                        setTimers(newTimers)

                        // If no more timers, complete workout
                        if (currentTimerIndex < timers.length - 1) {
                            setCurrentTimerIndex(prev => prev +1)
                            return 0
                        } else {
                            setRunning(false)
                            alert('Workout complete!')
                            return 0
                        }
                    }

                    if (currentTimer.type === 'Tabata') {
                        // Check if current interval completed
                        if (prevTime <= 0) {
                            // Flip between work and rest
                            if (currentPhase === 'Work') {
                                setCurrentPhase('Rest');
                                return (currentTimer.settings.restSeconds || 0) * 1000;
                            } else if (currentPhase === 'Rest') {
                                // Check if all rounds completed
                                if (currentRound >= (currentTimer.settings.rounds || 1)) {
                                    return completeCurrentTimer()
                                }
                                // Increment round and flip back to work
                                setCurrentRound(r => r + 1);
                                setCurrentPhase('Work');
                                return (currentTimer.settings.workSeconds || 0) * 1000;
                            }
                        }
                        return prevTime - 10;
                    } else if (currentTimer.type === 'XY') {
                        // XY timer
                        if (prevTime <=0) {
                            // Check if all rounds completed
                            if(currentRound >= (currentTimer.settings.rounds || 1)) {
                                return completeCurrentTimer();
                            }
                            // Increment round
                            setCurrentRound(r=> r+1)
                            return (currentTimer.settings.totalSeconds || 0) * 1000
                        }
                        return prevTime - 10
                    } else if (currentTimer.type === 'Stopwatch') {
                        // Count up for stopwatch
                        const newTime = prevTime + 10
                        if (newTime >= ((currentTimer.settings.totalSeconds || 0) * 1000)) {
                            return completeCurrentTimer()
                        }
                        return newTime
                    } else if (currentTimer.type === 'Countdown') {
                        // Count down for countdown
                        const newTime = prevTime - 10
                        if (newTime <= 0) {
                            return completeCurrentTimer()
                        }
                        return newTime
                    }
                    return prevTime;
                });
            }, 10);
        }

        // Clear the interval
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [
        running, 
        currentTimer, 
        currentTimerIndex, 
        timers, 
        currentPhase, 
        currentRound
    ]); // Dependencies for timers, current timer, timer state, phase and rounds

    // Return the timer context
    return (
        <TimerContext.Provider value={{ 
            timers,
            timeInMs,
            running,
            currentTimer,
            currentTimerIndex,
            currentPhase,
            currentRound,
            addTimer, 
            removeTimer, 
            updateTimer,
            toggleRunning,
            fastForward,
            resetWorkout
        }}>
            {children}
        </TimerContext.Provider>
    )


}