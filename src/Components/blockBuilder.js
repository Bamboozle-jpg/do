import React, { useState } from 'react'
import "../App.css"
import { collection, doc, updateDoc, Timestamp, toDate } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import "./allBlock.css"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

// Actually puts things to the screen
function TaskPretty(props) {
    // Grabs them as variables out of props
    var title = props.name;
    const desc = props.description;
    const Key = props.firestoreKey;
    const completed = props.completed
    const author = props.createdBy;
    const showDetails = props.showDetails;
    const detail = props.detail;
    const duration = props.duration;
    const dueDate = props.due.toDate();
    const month = dueDate.getMonth() + 1;
    const day = dueDate.getDate();
    const year = dueDate.getFullYear();
    const due = `${month}/${day}/${year}`;

    const doDate = props.do.toDate();
    const Dmonth = doDate.getMonth() + 1;
    const Dday = doDate.getDate();
    const Dyear = doDate.getFullYear();
    const Do = `${Dmonth}/${Dday}/${Dyear}`;

    const priority = props.priority;

    // See what we add to title
    switch(detail) {
        case "due":
            title = title + ": " + due.toString()
            break;
        case "do":
            title = title + ": " + Do.toString()
            break;
        case "duration":
            title = title + ": " + duration.toString()
            break;
        case "priority":
            title = title + ": " + priority.toString()
            break;
        default:
            break;
    }

    

    // The line with toggleComplete, creates a check box that watches if complete is true or false, and also can set it to be so
    if (showDetails) {
    return (<outer completed={completed} Key={Key} >
        <div class="title">
            <label class="switch">
                <label class={completed ? "customCheckboxOn" : "customCheckboxOff"}>
                <input type="checkbox" checked={completed} onClick={ () => toggleComplete(Key, author, completed) } class="hiddenCheckbox"  />
                </label>
            </label>
            <div class={ completed ? "completedTitle" : "uncompleteTitle"} onClick={() => console.log("uh oh stinky") }>{title}</div>
        </div>
        
        <div class={ completed ? "completed" : "uncomplete"} >{desc}</div>
        <div class={ completed ? "completed" : "uncomplete"} >Duration : {duration}</div>
        <div class={ completed ? "completed" : "uncomplete"} >Priority : {priority}</div>
        <div class={ completed ? "completed" : "uncomplete"} >Due : {due}</div>
        <div class={ completed ? "completed" : "uncomplete"} >Do : {Do}</div>

    </outer>)
    } else {
        return (<outer completed={completed} Key={Key} >
            <div class="title">
                <label class="switch">
                    <label class={completed ? "customCheckboxOn" : "customCheckboxOff"}>
                    <input type="checkbox" checked={completed} onClick={ () => toggleComplete(Key, author, completed) } class="hiddenCheckbox"  />
                    </label>
                </label>
                <div class={ completed ? "completedTitle" : "uncompleteTitle"} >{title}</div>
            </div>

        </outer>)
    }
}

// Set a task to complete
function toggleComplete(key, author, completed) {
    // Set up document you're looking at
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
function buildDiv(tasksList, name, showDetails, i, detail) {
    const contentStyle = { background: 'transparent', border: '0px' };
    const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
    return (
        <div class="glow-holder">
            <article data-glow>
                <Popup trigger=
                    {<div class ="blockTitle"> {name} </div>} 
                    modal nested
                    {...{contentStyle, overlayStyle}}>
                    {
                        close => (
                            <div class="glow-holder">
                            <article data-glow-popup>
                                <div class="rowWrapperSplit">
                                    <div class="popupBlockTitle"> {name}</div>
                                    <button class="defaultButton" onClick=
                                        {() => close()}>
                                            Close
                                    </button>
                                </div>
                                <div class="scrolling">
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
                                        showDetails={true}
                                        detail={detail}
                                    /> ) }
                                </div>
                            </article>
                            </div>
                            
                        )
                    }
                </Popup>
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
                    showDetails={showDetails}
                    detail={detail}
                /> ) }
            </article>
        </div>
    )
}

export {
    buildDiv
}