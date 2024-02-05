import "../App.css"
import { collection, doc, updateDoc, Timestamp } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import "./allBlock.css"
import { buildDiv } from "./blockBuilder"
// A block of all the items
// Parameter taken by buildDiv can either be null, "due", "do", "priority", or "duration"

const ByDue = (compTasks, incompleteTasks, showComp, showDetails, tasksLimit, name, i) => {
    // Takes for AAABCDDDnameAsString
    // A = block type
    // B = show incomplete tasks
    // C = show details
    // D = tasks limit
    let retTasks;

    // Sorts tasks by due date
    incompleteTasks.sort((a, b) => {
        return a.Due - b.Due;
    });

    // Combine the lists into 1
    if (showComp) {
        retTasks = incompleteTasks.concat(compTasks)
    } else {
        retTasks = incompleteTasks
    }

    // Print it to the screen and make it look pretty :)
    // build div takes in the tasks, name of block, whether or not the details will be shown, index for backend stuff, and extra detail to show
    return (buildDiv(retTasks, name, showDetails, tasksLimit, i, "due"));
}

const ByPriority = (compTasks, incompleteTasks, showComp, showDetails, tasksLimit, name, i) => {
    // Takes for AAABCDDDEnameAsString
    // A = block type
    // B = show incomplete tasks
    // C = show details
    // D = tasks limit
    // E = Priority cutoff
    let retTasks;

    incompleteTasks.sort((a, b) => {
        // First, descending order by priority (unless ties)
        if (a.Priority !== b.Priority) {
            return b.Priority - a.Priority; // Descending order based on 'priority'
        }
        // If ties, sort by due (ascending)
        return a.Due - b.Due;
    });

    // Filter out tasks with a priority of less than i 

    if (showComp) {
        retTasks = incompleteTasks.concat(compTasks)
    } else {
        retTasks = incompleteTasks
    }

    return (buildDiv(retTasks, name, showDetails, tasksLimit, i, "priority"));
}

const OnlyItem = (compTasks, incompTasks, showComp, showDetails, tasksLimit, index, extraParam, name, i) => {

    // Just have index mean index of task it's representing? Yes this is the best thing to do
    return buildDiv (compTasks, name, showDetails, i, "due")
}

const OnlyTag = (compTasks, incompTasks, showComp, shown, tasksLimit, index, extraParam, name, i) => {

    // placeholder, TAG IS extraParam, it's an index
    return buildDiv (compTasks, name, shown, i)
}

export { 
    ByDue,
    OnlyItem,
    OnlyTag,
    ByPriority
}