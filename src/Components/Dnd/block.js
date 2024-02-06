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

    return(
        <Draggable key = {Key} draggableId= {Key} index={index}>
            {(provided) => (
                <div Key = {Key} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <div class = "field">{title}</div>
                    <div class = "field">{desc}</div>
                    <div class = "field">{priority}</div>
                    
                    { due != "1/1/3000" ? <div>Due : {due}</div> : <div>NO DUE DATE</div> }
                </div>
            )}
        </Draggable>
        );
}

function block(tasksList) {

    const onDragEnd = result => {
        const{destination, source, draggableId} = result;

        if(!destination) {
            return;
        }

        if(
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ){
            return;
        }


    };

    return (
        //the div that contains the incompleted tasks
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='main'>
                {(provided) => (
                    <div class = "main" className='main' {...provided.droppableProps} ref={provided.innerRef}>
                        <div>
                        { tasksList && tasksList.map( (tsk, index) => <Tasks
                            firestoreKey = {tsk.Key}
                            index = {index}
                            name = {tsk.Name}
                            description = {tsk.Description}
                            priority={tsk.Priority}
                            due={tsk.Due}
                        />)}
                        </div>
                        {provided.placeholder}
                    </div>
                )}       
            </Droppable>
        </DragDropContext>
    )
}

export {
    block
}