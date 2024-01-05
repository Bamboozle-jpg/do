import "../App.css"
import { collection, doc, updateDoc, Timestamp } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import "./allBlock.css"
import { buildDiv } from "./blockBuilder"
// A block of all the items
const AllByDue = (compTasks, incompTasks, showIncomp, showComp, tasksLimit, index, extraParam, name) => {
        
    // Combine the lists into 1
    var tasksList = incompTasks.concat(compTasks)

    // Print it to the screen and make it look pretty :)
    return (buildDiv(tasksList));
}

// A block of only incomplete items
const UncompleteByDue = (compTasks, incompTasks, showIncomp, showComp, tasksLimit, index, extraParam, name) => {

    return buildDiv(incompTasks)
}

const OnlyItem = (compTasks, incompTasks, showIncomp, showComp, tasksLimit, index, extraParam, name) => {

    // placeholder, SET THE NAME TO THE ITEM's INDEX?? extra param is an integer.... hmmmmm
    // Possibly no dual items, just have index mean index of task it's representing? Yes this is the best thing to do
    return buildDiv (compTasks)
}

const OnlyTag = (compTasks, incompTasks, showIncomp, showComp, tasksLimit, index, extraParam, name) => {

    // placeholder, TAG IS extraParam, it's an index
    return buildDiv (compTasks)
}

export { 
    AllByDue,
    UncompleteByDue
}