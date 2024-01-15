import React, { useState } from 'react'
import "../App.css"
import { collection, doc, updateDoc, Timestamp } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import "./allBlock.css"

// Actually puts things to the screen
function TaskPretty(props) {
    // Grabs them as variables out of props
    const text = props.name;
    const desc = props.description;
    const Key = props.firestoreKey;
    const completed = props.completed
    const author = props.createdBy;
    const shown = props.shown;

    // The line with toggleComplete, creates a check box that watches if complete is true or false, and also can set it to be so
    if (shown) {
    return (<outer completed={completed} Key={Key} >
        <div class="title">
            <label class="switch">
                <label class={completed ? "customCheckboxOn" : "customCheckboxOff"}>
                <input type="checkbox" checked={completed} onClick={ () => toggleComplete(Key, author, completed) } class="hiddenCheckbox"  />
                </label>
            </label>
            <div class={ completed ? "completedTitle" : "uncompleteTitle"} >{text}</div>
        </div>
        
        <div class={ completed ? "completed" : "uncomplete"} >{desc}</div>
        <div class={ completed ? "completed" : "uncomplete"} >{Key}</div>
        <div class={ completed ? "completed" : "uncomplete"} >Completed : {completed ? "true" : "false"}</div>
    </outer>)
    } else {
        return (<outer completed={completed} Key={Key} >
            <div class="title">
                <label class="switch">
                    <label class={completed ? "customCheckboxOn" : "customCheckboxOff"}>
                    <input type="checkbox" checked={completed} onClick={ () => toggleComplete(Key, author, completed) } class="hiddenCheckbox"  />
                    </label>
                </label>
                <div class={ completed ? "completedTitle" : "uncompleteTitle"} >{text}</div>
            </div>
        </outer>)
    }
}

// Set a task to complete
function toggleComplete(key, author, completed) {
    // Set up document you're looking at
    console.log(key)
    const outerDoc = doc(db, author, 'tasks');
    const outerCollection = collection(outerDoc, 'tasksCollection');
    const docToUpdate = doc(outerCollection, key);

    // update complete field
    if (completed) {
        updateDoc(docToUpdate, {
            Completed: false,
            CompletedDate: null
        });
    } else {
        const today = new Date();
        updateDoc(docToUpdate, {
            Completed: true,
            CompletedDate: Timestamp.fromDate(today)
        });
    }
}



// Builds object for TaskPretty to access
function buildDiv(tasksList, name, shown, i) {
    return (
        <div class="glow-holder">
            <article data-glow>
                <div class="blockTitle" onClick={() => console.log(i)}>{name}</div>
                { tasksList && tasksList.map( tsk => <TaskPretty 
                    firestoreKey={tsk.Key} 
                    name={tsk.Name}  
                    description={tsk.Description}
                    due={tsk.Due}
                    do={tsk.Do}
                    duration={tsk.Duration}
                    priority={tsk.Priority}
                    fromRepeat={tsk.Priority}
                    completed={tsk.Completed}
                    children={tsk.Children}
                    tag={tsk.Tag}
                    createdBy={tsk.CreatedBy}
                    shown={shown}
                /> ) }
            </article>
        </div>
    )
}

export {
    buildDiv
}