import { createContext, useState } from 'react'

export const TimerContext = createContext({
    timers: [],
    addTimer: (timer: any) => {},
    removeTimer: (index: number) => {}
})

export function TimersListManager({ children }) {
    const [timers, setTimers] = useState([]);

    // add timer
    const addTimer = (timer) => {
        setTimers([...timers, timer])
    }

    // TO DO: index - removing wrong timer right now
    // remove timer
    const removeTimer = (index) => {
        const newTimers = [...timers];
        newTimers.splice(index, 1);
        setTimers(newTimers);
    }

    // return timer list
    return (
        <TimerContext.Provider value={{ timers, addTimer, removeTimer }}>
            {children}
        </TimerContext.Provider>
    )


}