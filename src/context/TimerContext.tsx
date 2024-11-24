import { createContext, useState, useEffect } from 'react'


// additional requirements:
// Each timer can be in one of three states: running, completed, and not running. 
// You will need a way to keep track of what state the timer is in, so that you can display it accordingly (see the image above)
// While the timer is running, you will need to either store or dynamically calculate which timer is active. index?
// You don't want to clear the configurations as the timers are running. The user should be able to restart the entire workout at anytime
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
    timeInSeconds: 0,
    running: false,
    currentTimer: null as Timer | null,
    addTimer: (timer: Timer) => {},
    removeTimer: (index: number) => {},
    updateTimer: (index: number, timer: Timer) => {},
    toggleRunning: () => {}
})

// Workout functionality
export function WorkoutProvider({ children }:  { children: React.ReactNode }) {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [running, setRunning] = useState(false);
    const [timeInSeconds, setTimeInSeconds] = useState(0);
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

    // timer effect test with basic timer first before our queue
    useEffect(() => {
        let interval;

        if (running) {
            console.log('start workout with timers: ', timers)
            console.log('beginning with timer index: ', currentTimerIndex)
            interval = setInterval(() => {
                const newTime = t + 1;
                console.log('Timer tick: ', newTime)
                console.log('Current timer: ', currentTimer)
                setTimeInSeconds(t=> t + 1);

            }, 1000)
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
    }, [running, currentTimerIndex])

    // return timer list
    return (
        <TimerContext.Provider value={{ 
            timers,
            timeInSeconds,
            running,
            currentTimer,
            addTimer, 
            removeTimer, 
            updateTimer,
            toggleRunning
        }}>
            {children}
        </TimerContext.Provider>
    )


}