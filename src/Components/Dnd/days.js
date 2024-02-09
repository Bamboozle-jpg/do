import React, { useState } from 'react'
import { collection, doc, updateDoc, Timestamp, toDate } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from '../../Firebase/Firebase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Tasks } from './block';

function Days({tasksList}) {
    
    const [currentDate, setCurrentDate] = useState(new Date());

    const changeDate = (increment) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + increment);
        setCurrentDate(newDate);

    }
    
    const days = []

    for(let i = 0; i < 7; i++){
        const date = new Date(currentDate);
        date.setDate(date.getDate() + i)

        const formattedDate = `${date.getMonth()+ 1}/${date.getDate()}/${date.getFullYear()}`;

        const newList = tasksList.filter(tsk => {
            const doDate = tsk.Do.toDate();
            let day1 = doDate.getDate();
            let month1 = doDate.getMonth() + 1;
            let year1 = doDate.getFullYear();
            const formattedDate1 = `${month1}/${day1}/${year1}`;
            return formattedDate === formattedDate1;
        });

        days.push(
        <Droppable droppableId = {formattedDate}>
            {(provided) => (
                <div class = "day" className = 'day' key = {i} day = {formattedDate} {...provided.droppableProps} ref={provided.innerRef}>
                    <div>
                        {formattedDate}
                        { Array.isArray(newList) && newList.map( (tsk, index) => <Tasks
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
         );
    }
    return (
        <div class = 'days'>
            <button onClick={() => changeDate(-1)}>Previous Day</button>
            <button onClick={() => changeDate(1)}>Next Day</button>
             {days} 
             </div>
    )
}

export {
    Days
} 