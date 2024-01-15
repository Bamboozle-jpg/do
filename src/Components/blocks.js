import "../App.css"
import { collection, doc, updateDoc, Timestamp } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import "./allBlock.css"
import { buildDiv } from "./blockBuilder"
// A block of all the items
const ByDue = (compTasks, incompTasks, showComp, showDetails, tasksLimit, name, i) => {
    // Takes for AAABCDDDnameAsString
    // A = block type
    // B = show incompletes
    // C = show details
    // D = tasks limit
    var tasksList;
        
    var retIncompTasks = incompTasks;

    // Combine the lists into 1
    if (showComp) {
        tasksList = retIncompTasks.concat(compTasks)
    } else {
        tasksList = retIncompTasks
    }

    // Print it to the screen and make it look pretty :)
    return (buildDiv(tasksList, name, showDetails, i));
}

const OnlyItem = (compTasks, incompTasks, showComp, shown, tasksLimit, index, extraParam, name, i) => {

    // Just have index mean index of task it's representing? Yes this is the best thing to do
    return buildDiv (compTasks, name, shown, i)
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