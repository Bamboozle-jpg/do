import React, { useState } from 'react'
import { collection, doc, updateDoc, Timestamp, toDate } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from '../../Firebase/Firebase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Tasks } from './calendItems';
import './block.css'

function Days({tasksList}) {
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const nav = useNavigate();
    const changeDate = (increment) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + increment);
        setCurrentDate(newDate);
    }

    const currDate = new Date();
    const fcurrDate = `${currDate.getMonth()+1}/${currDate.getDate()}/${currDate.getFullYear()}`
    console.log(fcurrDate)
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
        //for having a unique color for the current day
        console.log(formattedDate)
        days.push(
            <Droppable droppableId = {formattedDate}>
                {(provided, snapshot) => (
                    <div class = "day" className = 'day' key = {i} 
                    day = {formattedDate} {...provided.droppableProps} ref={provided.innerRef}
                    style={{
                        ...provided.droppableProps.style,
                        backgroundColor: snapshot.isDraggingOver ? "hsl(var(--userColor), 10%, 50%)" : (fcurrDate == formattedDate ?  "hsl(var(--userColor), 20%, 20%)" :"hsl(var(--userColor), 10%, 20%)") ,
                        transition: 'background-color 0.4s ease'}}>
                            <h4 style={{textAlign: 'center', fontSize: '20px'}}>{formattedDate}</h4>
                            <div>
                                { Array.isArray(newList) && newList.map( (tsk, index) => <Tasks
                                firestoreKey = {tsk.Key}
                                index = {index}
                                name = {tsk.Name}
                                description = {tsk.Description}
                                priority={tsk.Priority}
                                due={tsk.Due}
                                do = {tsk.Do}
                                duration = {tsk.Duration}
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
                <div class = 'bruhcontainer'>
                    <div class = "left-buttons">
                        <button class = 'bruh' onClick={() => changeDate(-7)}>&#8592;&#8592;</button>
                        <button class = 'bruh' onClick={() => changeDate(-1)}>&#8592;</button>

                    </div>               
                    <div class = "right-buttons">
                        <button class = 'bruh' onClick={() => changeDate(1)}>&#8594;</button> 
                        <button class = 'bruh' onClick={() => changeDate(7)}>&#8594;&#8594;</button> 
                    </div>

                </div>
                <button className='navButton' onClick={ () => nav( "/layout1" )}>Layout</button>
                {days} 
             </div>
    )
}

export {
    Days
} 