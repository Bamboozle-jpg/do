import React, { useState } from 'react'
import { collection, doc, updateDoc, Timestamp, toDate } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from '../../Firebase/Firebase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


function Tasks( props ){
    //for name of tasks, description, due date, and priority
    //firestore key and createdby for identification
    var title = props.name;
    const desc = props.description;
    const Key = props.firestoreKey;
    //const author = props.createdBy;
    const dueDate = props.due.toDate();
    const month = dueDate.getMonth() + 1;
    const day = dueDate.getDate();
    const year = dueDate.getFullYear();
    const due = `${month}/${day}/${year}`;

    const priority = props.priority;
    const index = props.index;

    const doDate = props.do.toDate();
    const Dmonth = doDate.getMonth() + 1;
    const Dday = doDate.getDate();
    const Dyear = doDate.getFullYear();
    const Do = `${Dmonth}/${Dday}/${Dyear}`;
    //different bg color if it is overdue/urgent/not urgent
    return(
        <Draggable key = {Key} draggableId= {Key} index={index} >
            {(provided, snapshot) => (
                <div className = "task" 
                {...provided.draggableProps} 
                {...provided.dragHandleProps} 
                ref={provided.innerRef} 
                style={{
                    ...provided.draggableProps.style,
                    backgroundColor: snapshot.isDragging ? "lightgreen" : "white"}}>
                    <div class = "title">{title}</div>
                    <div class = "field">Desc: {desc}</div>
                    <div class = "field">{priority}</div>
                    { due != "1/1/3000" ? <div>Due : {due}</div> : <div>NO DUE DATE</div> }
                    {console.log("Provided Style:", provided.draggableProps.style)}
                </div>
            )}
        </Draggable>
        );
}
export {
    Tasks
}

function block(tasksList) {

    var NewList = [];

    for(let i = 0; i < tasksList.length; i++){
      if(tasksList[i]["Do"]["seconds"] == "32503708800"){
        NewList.push(tasksList[i]);
        //console.log(tasksList[i])
      }
    }
    return (
        //the div that contains the incompleted tasks
        //droppableId needs to be made to scale with future blocks, probably with calendar ids
            <Droppable droppableId='NoDo'>
                {(provided, snapshot) => (
                    <div class = "tasks" className='tasks' {...provided.droppableProps} ref={provided.innerRef}
                    style={{
                        ...provided.droppableProps.style,
                        backgroundColor: snapshot.isDraggingOver ? "skyblue" : "white",
                        transition: 'background-color 0.4s ease'}}>
                        <h4>No Do</h4>
                        <div>
                        { NewList && NewList.map( (tsk, index) => <Tasks
                            firestoreKey = {tsk.Key}
                            index = {index}
                            name = {tsk.Name}
                            description = {tsk.Description}
                            priority={tsk.Priority}
                            due={tsk.Due}
                            do = {tsk.Do}
                        />)}
                        </div>
                        {provided.placeholder}
                    </div>
                )}       
            </Droppable>
    )
}

export {
    block
}