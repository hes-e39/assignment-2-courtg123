import { createContext, useState } from 'react'

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
    addTimer: (timer: Timer) => {},
    removeTimer: (index: number) => {},
    updateTimer: (index: number, timer: Timer) => {}
})

export function TimersListManager({ children }:  { children: React.ReactNode }) {
    const [timers, setTimers] = useState<Timer[]>([]);

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

    // return timer list
    return (
        <TimerContext.Provider value={{ timers, addTimer, removeTimer, updateTimer }}>
            {children}
        </TimerContext.Provider>
    )


}