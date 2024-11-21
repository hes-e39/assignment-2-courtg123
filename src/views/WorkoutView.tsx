import { Panel } from "../components/generic/Panel";

import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import { Button } from "../components/generic/Button";

const addTimer = () => {
  console.log("Open timer settings modal")
}

// TODO: create timer settings modal component
// (modal or something else? probably modal is best, most similar to existing panel component...)
// "Save Timer" in modal adds it to workout with those settings
// Should be able to edit timer settings
// Should be able to remove timer from workout timer stack
// Maximum of 10 timers is reasonable

const editTimer = () => {
  console.log("Open timer settings modal (for editing)")
}

const removeTimer = () => {
  console.log("Remove timer")
}

const runWorkout = () => {
  console.log("Start workout")
}

// "Start Workout" - cannot change timer settings at this point.
// Timers run in order one after another, when one ends next one starts automatically
// Can "fast forward" to next timer? Is that what Fast Forward is for? (confirm this)
// Can pause/resume workout (pauses/resumes current timer only)
// Can end workout (fast forward through all timers in workout timer stack)

// UI: show which timer is currently running
// indicate progress...
// - show which timers have completed (maybe a checkmark in list or something to indicate?)
// - show how many timers remaining
// - maybe: total workout time remaining?

const WorkoutView = () => {

  return (
    <div>
      <h1>Setup Workout</h1>

      <div>
        [Timer 1] <Button onClick={editTimer}>Edit</Button><Button onClick={removeTimer}>Remove</Button><br />
        [Timer 2] <Button onClick={editTimer}>Edit</Button><Button onClick={removeTimer}>Remove</Button><br />
        [Timer 3] <Button onClick={editTimer}>Edit</Button><Button onClick={removeTimer}>Remove</Button><br />
        [Timer 4] <Button onClick={editTimer}>Edit</Button><Button onClick={removeTimer}>Remove</Button><br />
        [Timer 5] <Button onClick={editTimer}>Edit</Button><Button onClick={removeTimer}>Remove</Button><br />
        [Timer 6] <Button onClick={editTimer}>Edit</Button><Button onClick={removeTimer}>Remove</Button><br />        
      </div>
      <div>
        [timer type dropdown]
        <Button onClick={addTimer}>+ Add Timer</Button>
      </div>
      <div>
        <Button onClick={runWorkout}>Start Workout</Button>
      </div>
    </div>
  );
};

export default WorkoutView;
