import "../App.css"
import "./allBlock.css"
import { buildDiv } from "./blockBuilder"
import dayjs from 'dayjs';
// A block of all the items
// Parameter taken by buildDiv can either be null, "due", "do", "priority", or "duration"

var isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

// 000
const ByDue = (compTasks, incompleteTasks, showComp, showDetails, tasksLimit, name, i) => {
    // Takes for AAA B C DDD nameAsString
    // A = block type = 000
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

// 001
const ByDo = (compTasks, incompleteTasks, showComp, showDetails, tasksLimit, name, i) => {
    // Takes for AAA B C DDD nameAsString
    // A = block type = 001
    // B = show incomplete tasks
    // C = show details
    // D = tasks limit
    let retTasks;

    // Sorts tasks by due date
    incompleteTasks.sort((a, b) => {
        return a.Do - b.Do;
    });

    // Combine the lists into 1
    if (showComp) {
        retTasks = incompleteTasks.concat(compTasks)
    } else {
        retTasks = incompleteTasks
    }

    // Print it to the screen and make it look pretty :)
    // build div takes in the tasks, name of block, whether or not the details will be shown, index for backend stuff, and extra detail to show
    return (buildDiv(retTasks, name, showDetails, tasksLimit, i, "do"));
}

// 002
const ByPriority = (compTasks, incompleteTasks, showComp, showDetails, tasksLimit, name, priorityLimit, i) => {
    // Takes for AAA B C DDD E nameAsString
    // A = block type = 002
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

    if (showComp) {
        retTasks = incompleteTasks.concat(compTasks)
    } else {
        retTasks = incompleteTasks
    }

    // Filter out tasks with a priority of less than i 
    retTasks = retTasks.filter(task => task.Priority >= priorityLimit);

    return (buildDiv(retTasks, name, showDetails, tasksLimit, i, "priority"));
}

// 003
const Today = (compTasks, incompleteTasks, showComp, showDetails, tasksLimit, name, i) => {
    // Takes for AAA B C DDD nameAsString
    // A = block type = 003
    // B = show incomplete tasks
    // C = show details
    // D = tasks limit
    let retTasks;

    incompleteTasks.sort((a, b) => {
        // sort by due (ascending)
        return a.Due - b.Due;
    });

    if (showComp) {
        retTasks = incompleteTasks.concat(compTasks)
    } else {
        retTasks = incompleteTasks
    }

    // Filter only tasks with today's do date
    var now = new Date();
    var today = dayjs(now).startOf('day')
    retTasks = retTasks.filter(task => dayjs(task.Do.toDate()).isSame(today));

    return (buildDiv(retTasks, name, showDetails, tasksLimit, i, "due"));
}

// 004
const DueOverdue = (incompleteTasks, showDetails, tasksLimit, name, i) => {
    // Takes for AAA B CCC nameAsString
    // A = block type = 004
    // B = show details
    // C = tasks limit
    let retTasks;

    incompleteTasks.sort((a, b) => {
        // Sort by due (ascending)
        return a.Due - b.Due;
    });

    retTasks = incompleteTasks

    // Filter only tasks with today or earlier's due date
    var now = new Date();
    var today = dayjs(now).startOf('day')
    retTasks = retTasks.filter(task => dayjs(task.Due.toDate()).isSameOrBefore(today));

    return (buildDiv(retTasks, name, showDetails, tasksLimit, i, null));
}

// 005
const MissingDo = (compTasks, incompleteTasks, showComp, showDetails, tasksLimit, name, i) => {
    // Takes for AAA B C DDD nameAsString
    // A = block type = 005
    // B = show incomplete tasks
    // C = show details
    // D = tasks limit
    let retTasks;

    incompleteTasks.sort((a, b) => {
        // Sort by due (ascending)
        return a.Due - b.Due;
    });

    if (showComp) {
        retTasks = incompleteTasks.concat(compTasks)
    } else {
        retTasks = incompleteTasks
    }

    // Filter only tasks with today's do date
    let empty = new Date(3000, 0, 1);
    var emptyDate = dayjs(empty).startOf('day')
    retTasks = retTasks.filter(task => dayjs(task.Do.toDate()).isSame(emptyDate));
    retTasks = retTasks.filter(task => !dayjs(task.Due.toDate()).isSame(emptyDate));

    return (buildDiv(retTasks, name, showDetails, tasksLimit, i, "priority"));
}

// 006
const OnlyItem = (compTasks, incompleteTasks, showComp, showDetails, tasksLimit, index, name, i) => {
    // Takes for AAA B C XXXXXXXXXXXXXXXXXXXX (x20) nameAsString
    // A = block type = 006
    // B = show incomplete tasks
    // C = show details
    // X = item ID
    let retTasks;

    if (showComp) {
        retTasks = incompleteTasks.concat(compTasks);
    } else {
        retTasks = incompleteTasks;
    }
    // SOMEHOW INCLUDE CHILDREN TOO WITHOUT SHOWING THEM SEPARATELY
    retTasks = retTasks.filter(task => task.Key == index);

    // Just have index mean index of task it's representing? Yes this is the best thing to do
    return buildDiv (retTasks, name, showDetails, tasksLimit, i, "due")
}

// 007
const onlyCompletes = (compTasks, showDetails, tasksLimit, name, i) => {
    // Takes for AAA B CCC nameAsString
    // A = block type = 007
    // B = show details
    // C = tasks limit
    
    let retTasks = compTasks;

    return buildDiv (retTasks, name, showDetails, tasksLimit, i, "do")
}

// const OnlyTag = (compTasks, incompTasks, showComp, shown, tasksLimit, index, extraParam, name, i) => {
//     // placeholder, TAG IS extraParam, it's an index
//     return buildDiv (compTasks, name, shown, i)
// }

export { 
    ByDue,
    ByDo,
    ByPriority,
    Today,
    DueOverdue,
    MissingDo,
    OnlyItem,
    onlyCompletes
}