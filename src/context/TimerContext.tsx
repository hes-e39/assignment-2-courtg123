import { createContext, useState, useEffect } from 'react'

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

export const TimerContext = createContext({
    timers: [] as Timer[],
    timeInMs: 0,
    running: false,
    currentTimer: null as Timer | null,
    currentTimerIndex: 0,
    addTimer: (timer: Timer) => {},
    removeTimer: (index: number) => {},
    updateTimer: (index: number, timer: Timer) => {},
    toggleRunning: () => {}
})

// Workout functionality
export function WorkoutProvider({ children }:  { children: React.ReactNode }) {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [running, setRunning] = useState(false);
    const [timeInMs, setTimeInMs] = useState(0);
    const [currentTimerIndex, setCurrentTimerIndex] = useState(0);

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

    // workout timer hook
    useEffect(() => {
        let interval: number | undefined;

        if (running && currentTimer) {

            if (currentTimer.state === 'not_started') {
                // if tabata, start with work time
                if (currentTimer.type === 'Tabata') {
                    setTimeInMs(currentTimer.settings.workSeconds * 1000)
                } else {
                    setTimeInMs(0);
                }
                const newTimers = [...timers];
                newTimers[currentTimerIndex].state = 'running';
                setTimers(newTimers)
            }

            interval = setInterval(() => {
                setTimeInMs(currentTime => {
                    let newTime;

                    // only stopwatch counts up
                    if (currentTimer.type === 'Stopwatch') {
                        newTime = currentTime + 10
                    } else {
                        newTime = currentTime - 10
                    }
                    
                    console.log('Time: ', newTime)
                    console.log('Current timer: ', currentTimer)

                    // check if the current timer has completed
                    let isTimerComplete = false;
                    const timer = timers[currentTimerIndex];

                    if (timer.type === 'Tabata') {
                        const workTime = timer.settings.workSeconds * 1000
                        const restTime = timer.settings.restSeconds * 1000
                        const roundTime = workTime + restTime
                        const currentRound = Math.floor(timeInMs / roundTime) + 1
                        const timeInCurrentRound = timeInMs % roundTime
                        const isWorkPhase = timeInCurrentRound > restTime
                        
                        // if phase complete switch to next phase
                        if (newTime <= 0) {
                            if (isWorkPhase) {
                                return restTime
                            } else {
                                if (currentRound >= timer.settings.rounds) {
                                    isTimerComplete = true
                                } else {
                                    return workTime
                                }
                            }
                        }
                    }
                    if (timer.type === 'Stopwatch' || timer.type === 'Countdown') {
                        isTimerComplete = newTime >= (timer.settings.totalSeconds || 0) * 1000
                    }
                    if (timer.type === 'XY') {
                        const roundTime = timer.settings.totalSeconds * 1000
                        const totalTime = roundTime * (timer.settings.rounds)
                        isTimerComplete = newTime >= totalTime
                    }
                    

                    // if it has completed
                    if (isTimerComplete) {
                        // mark it as complete
                        const newTimers = [...timers];
                        newTimers[currentTimerIndex].state = 'completed';
                        setTimers(newTimers)

                        // if there is a next timer, go to it, if not, end workout
                        if (currentTimerIndex < timers.length - 1) {
                            setCurrentTimerIndex(prev => prev + 1)
                            return;
                        } else {
                            // end workout
                            setRunning(false);
                            clearInterval(interval);
                            return newTime;
                        }
                    }

                    return newTime
                })
            }, 10)
        } else {
            console.log('workout paused or stopped')
        }

        // clear interval
        return () => {
            if (interval) {
                console.log('cleaning up interval')
                clearInterval(interval);
            }
        }
    }, [running, currentTimerIndex, timers])

    // return timer list
    return (
        <TimerContext.Provider value={{ 
            timers,
            timeInMs,
            running,
            currentTimer,
            currentTimerIndex,
            addTimer, 
            removeTimer, 
            updateTimer,
            toggleRunning
        }}>
            {children}
        </TimerContext.Provider>
    )


}