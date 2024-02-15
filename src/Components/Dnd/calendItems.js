import React, { useState } from 'react'
import { collection, doc, updateDoc, Timestamp, toDate } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from '../../Firebase/Firebase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


function Tasks( props ){
    //for name of tasks, description, due date, and priority
    //firestore key and createdby for identification
    var title = props.name;
    const Key = props.firestoreKey;
    //const author = props.createdBy;
    const dueDate = props.due.toDate();
    const month = dueDate.getMonth() + 1;
    const day = dueDate.getDate();
    const year = dueDate.getFullYear();
    const due = `${month}/${day}/${year}`;

    const priority = props.priority;
    const index = props.index;
    const duration = props.duration;
    const doDate = props.do.toDate();
    const Dmonth = doDate.getMonth() + 1;
    const Dday = doDate.getDate();
    const Dyear = doDate.getFullYear();
    const Do = `${Dmonth}/${Dday}/${Dyear}`;
    const length = duration * 100
    //different bg color if it is overdue/urgent/not urgent

    const short = length < 50
    const shortish = length < 75
    const medium = length >= 100
    const long = length >= 125
    console.log(long, length)

    return(
        <Draggable key = {Key} draggableId= {Key} index={index} >
            {(provided, snapshot) => (
                
                <div className = "task" 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    ref={provided.innerRef} 
                    style={{
                        ...provided.draggableProps.style,
                        backgroundColor: snapshot.isDragging ? "hsl(var(--userColor), 10%, 40%)" : "hsl(var(--userColor), 10%, 60%)",
                        height: Math.max(25, duration*100),
                        width: 10 + "vw",
                    }}
                >
                    <div class="title" style={{overflow: "clip", maxHeight: medium ? long ? 69 : 46 : 23}}>{title}</div>
                    {short ? <></> : <div class = "field"> Priority: {priority}</div>}
                    {shortish ? <></> : (due != "1/1/3000" ? <div class = "field">Due : {due}</div> : <div>NO DUE DATE</div>)}
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
      }
    }
    return (
        //the div that contains the incompleted tasks
        //droppableId needs to be made to scale with future blocks, probably with calendar ids
            <Droppable droppableId='NoDo'>
                {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}
                    style={{
                        ...provided.droppableProps.style,
                        backgroundColor: snapshot.isDraggingOver ? "hsl(var(--userColor), 10%, 60%)" : "hsl(var(--userColor), 20%, 40%)",
                        transition: 'background-color 0.4s ease',
                        borderRadius: '5px',
                        minWidth: '100%'}}>
                        <h4 style={{textAlign: 'center',
                        fontSize: '20px'}}>No Do</h4>
                        <div>
                        { NewList && NewList.map( (tsk, index) => <Tasks
                            firestoreKey = {tsk.Key}
                            index = {index}
                            name = {tsk.Name}
                            description = {tsk.Description}
                            priority={tsk.Priority}
                            due={tsk.Due}
                            duration = {tsk.Duration}
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