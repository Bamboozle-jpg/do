import "../App.css"
import { collection, doc, updateDoc, Timestamp } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import "./allBlock.css"
import { buildDiv } from "./blockBuilder"
// A block of all the items
// Parameter taken by buildDiv can either be null, "due", "do", "priority", or "duration"

const ByDue = (compTasks, incompTasks, showComp, showDetails, tasksLimit, name, i) => {
    // Takes for AAABCDDDnameAsString
    // A = block type
    // B = show incompletes
    // C = show details
    // D = tasks limit
    let tasksList;
        
    let retIncompTasks = incompTasks;

    console.log(retIncompTasks[0])
    retIncompTasks.sort((a, b) => {
        // First, compare by 'duration'
        if (a.Priority !== b.Priority) {
            return b.Priority - a.Priority; // Descending order based on 'duration'
        }
        
        // // If 'do' is the same, break ties by 'age'
        return a.Due - b.Due; // Ascending order based on 'age'
    });

    console.log(retIncompTasks)

    // Combine the lists into 1
    if (showComp) {
        tasksList = retIncompTasks.concat(compTasks)
    } else {
        tasksList = retIncompTasks
    }

    // Print it to the screen and make it look pretty :)
    // build div takes in the tasks, name of block, whether or not the details will be shown, index for backend stuff, and extra detail to show
    console.log(showDetails)
    return (buildDiv(tasksList, name, showDetails, i, "priority"));
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
    OnlyTag
}