import { useNavigate } from "react-router-dom";
import { Panel } from "../components/generic/Panel";
import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import { Button } from "../components/generic/Button";


// TODO: create timer settings modal component
// (modal or something else? probably modal is best, most similar to existing panel component...)
// Reqs:
// Add Timer - Path should be /add
// When user clicks "Add" from Home screen, they are routed to this page, where they can choose the type of timer
//  and configure all inputs for each timer. After configuring, the user confirms and the timer is added to the list.
// The /add page should allow the user to configure any of the four timers (stopwatch, countdown, XY, and tabata)
// The user should be able to go back to the home page from here


// "Save Timer" in modal adds it to workout with those settings
// Should be able to edit timer settings
// Should be able to remove timer from workout timer queue
// Maximum of 10 timers is reasonable

const editTimer = () => {
  console.log("Open add timer (for editing)")
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
  // confirmed per requirement: Controls to "fast-forward" - ends the current running timer and moves onto the next one
// Can pause/resume workout (pauses/resumes current timer only)
// Can end workout (fast forward through all timers in workout timer stack)

// UI: show which timer is currently running
// indicate progress...
// - show which timers have completed (maybe a checkmark in list or something to indicate?)
// - show how many timers remaining
// - maybe: total workout time remaining?

// additional requirements:
// Each timer can be in one of three states: running, completed, and not running. 
// You will need a way to keep track of what state the timer is in, so that you can display it accordingly (see the image above)
// During configuration, the user can remove any timer from the queue, so you will be supporting deleting
// While the timer is running, you will need to either store or dynamically calculate which timer is active.
// You don't want to clear the configurations as the timers are running. The user should be able to restart the entire workout at anytime

const WorkoutView = () => {
  const navigate = useNavigate();

  const addTimer = () => {
    console.log("Open add timer")
    navigate('/add');
  }
  

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
