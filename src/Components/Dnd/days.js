import React, { useState } from 'react'
import { collection, doc, updateDoc, Timestamp, toDate } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from '../../Firebase/Firebase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function Days() {
    const days = []
    for(let i = 0; i < 7; i++){
        const date = new Date();
        let day = date.getDate() + i;
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        days.push(
        <Droppable droppableId = {formattedDate}>
            {(provided) => (
                <div class = "day" className = 'day' key = {i} day = {formattedDate} {...provided.droppableProps} ref={provided.innerRef}>
                    {formattedDate}
                    {provided.placeholder}
                </div> 
            )}

         </Droppable>
         );
    }
    return (
        <div class = 'days'> {days} </div>
    )
}

export {
    Days
} 