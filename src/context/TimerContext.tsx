import { createContext, useState, useEffect } from 'react'

interface Timer {
    type: string;
    settings: {
      currentPhase: string;
      totalSeconds?: number;
      rounds?: number;
      workSeconds?: number;
      restSeconds?: number;
    };
    state: 'not_started' | 'running' | 'completed';
  }

export const TimerContext = createContext({
    timers: [] as Timer[],
    timeInMs: 0,
    running: false,
    currentTimer: null as Timer | null,
    currentTimerIndex: 0,
    currentPhase: 'Work',
    currentRound: 1,
    addTimer: (timer: Timer) => {},
    removeTimer: (index: number) => {},
    updateTimer: (index: number, timer: Timer) => {},
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

    // current timer by index
    const currentTimer = timers[currentTimerIndex] || null;

    // add timer
    const addTimer = (timer: Timer) => {
        setTimers([...timers, timer])
    }

    // remove timer
    const removeTimer = (index: number) => {
        const newTimers = [...timers];
        newTimers.splice(index, 1);
        setTimers(newTimers);
    }

    // edit/update timer
    const updateTimer = (index: number, timer: Timer) => {
        setTimers(timers => {
            const newTimers = [...timers];
            newTimers[index] = timer;
            return newTimers;
        })
    }

    // toggle running/paused
    const toggleRunning = () => {

        const newRunningState = !running;
        console.log('Workout running: ', newRunningState);
        console.log('Current timer index: ', currentTimerIndex);
        console.log('Current timer: ', currentTimer);
        setRunning(newRunningState)
    }

    // fast forward
    const fastForward = () => {
        if (!currentTimer) return

        // complete current timer
        const newTimers = [...timers]
        newTimers[currentTimerIndex].state = 'completed'
        setTimers(newTimers)

        // next timer or complete workout
        if (currentTimerIndex <= timers.length -1) {
            setCurrentTimerIndex(prev => prev + 1)
            setCurrentRound(1)
            setCurrentPhase('Work')
        } else {
            setRunning(false)
            alert('Workout complete!')
        }
    }

    // reset workout
    const resetWorkout = () => {
        setRunning(false)
        setTimeInMs(0)
        setCurrentTimerIndex(0)
        setCurrentRound(1)
        setCurrentPhase('Work')

        // set all timers to not_started state
        const resetTimers = timers.map(timer => ({
            ...timer,
            state: 'not_started' as const
        }))
        setTimers(resetTimers)
    }

    // workout timer hook
    useEffect(() => {
        let interval: number | undefined;

        if (running && currentTimer) {
            // initialize timer
            if (currentTimer.state === 'not_started') {
                if (currentTimer.type === 'Tabata') {
                    setTimeInMs(currentTimer.settings.workSeconds * 1000);
                    setCurrentPhase('Work');
                    setCurrentRound(1);
                    const newTimers = [...timers];
                    newTimers[currentTimerIndex].state = 'running';
                    setTimers(newTimers);
                } else if (currentTimer.type === 'XY') {
                    setTimeInMs(currentTimer.settings.totalSeconds * 1000)
                    setCurrentRound(1)
                } else if (currentTimer.type === 'Countdown') {
                    setTimeInMs(currentTimer.settings.totalSeconds * 1000)
                } else {
                    setTimeInMs(0)
                }
                const newTimers = [...timers]
                newTimers[currentTimerIndex].state = 'running'
                setTimers(newTimers)
            }

            interval = setInterval(() => {
                setTimeInMs(prevTime => {

                    const completeCurrentTimer = () => {
                        const newTimers = [...timers]
                        newTimers[currentTimerIndex].state = 'completed'
                        setTimers(newTimers)

                        // are there more timers? if not workout complete
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
                        // check if current interval completed
                        if (prevTime <= 0) {
                            // flip between work and rest
                            if (currentPhase === 'Work') {
                                setCurrentPhase('Rest');
                                return currentTimer.settings.restSeconds * 1000;
                            } else if (currentPhase === 'Rest') {
                                // check if all rounds completed
                                if (currentRound >= (currentTimer.settings.rounds || 1)) {
                                    return completeCurrentTimer()
                                }
                                // increment round and flip back to work
                                setCurrentRound(r => r + 1);
                                setCurrentPhase('Work');
                                return currentTimer.settings.workSeconds * 1000;
                            }
                        }
                        return prevTime - 10;
                    } else if (currentTimer.type === 'XY') {
                        if (prevTime <=0) {
                            // check if all rounds completed
                            if(currentRound >= currentTimer.settings.rounds) {
                                return completeCurrentTimer();
                            }
                            // increment round
                            setCurrentRound(r=> r+1)
                            return currentTimer.settings.totalSeconds * 1000
                        }
                        return prevTime - 10
                    } else if (currentTimer.type === 'Stopwatch') {
                        // count up for stopwatch
                        const newTime = prevTime + 10
                        if (newTime >= (currentTimer.settings.totalSeconds * 1000)) {
                            return completeCurrentTimer()
                        }
                        return newTime
                    } else if (currentTimer.type === 'Countdown') {
                        // count down for countdown
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

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [running, currentTimer, currentPhase, currentRound]); // Added phase and round dependencies

    // return timer list
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