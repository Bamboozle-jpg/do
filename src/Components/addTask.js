import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import "../App.css"
import 'firebase/firestore';
import { collection, addDoc, Timestamp } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";

const AddTask = () => {
    const today = new Date();

    const [name, setName] = useState('');
    const [complete, setComplete] = useState(false);
    const [description, setDescription] = useState('');
    const [dueDate, setDue] = React.useState(dayjs(today));
    const [doDate, setDo] = React.useState(dayjs(today));
    const [duration, setDuration] = useState(1);
    const [tag, setTag] = useState('');
    //new to do item to firebase

    
    console.log(dayjs(today));
    const handleToggle = () => {
        setComplete(!complete);
    };

    const addTaskItem = async () => {
        if (name.trim() !== ''){
            try{
                const priority = document.getElementById("prioritySelector");
                const user = auth.currentUser
                const userEmail = user ? user.email : '';
                const taskRef = collection(db, userEmail, 'tasks', 'tasksCollection');
                const newTask = {
                    Name: name,
                    Description: description,
                    Due: Timestamp.fromDate(dueDate.toDate()),
                    Do: Timestamp.fromDate(doDate.toDate()),
                    Duration: duration,
                    Priority: parseInt(priority.value),
                    FromRepeat: false,
                    Completed: complete,
                    Children: [],
                    Tag: tag,
                    CreatedBy: userEmail,
                };
                await addDoc(taskRef, newTask);
                setName('');
                setDescription('');
                setTag('');
                setDue(dayjs(today));
                setDo(dayjs(today));
                setDuration(1);
                setComplete(false);
                priority.value = 3;
            }catch(error){
                console.error('Error adding document:', error);
            }
        }
    };

  return (
    <div>
        <input 
            type = "text"
            value = {name}
            onChange = {(e) => setName(e.target.value)}
            placeholder="Enter a to-do item name"
        />
        <div><br/></div>
        <input 
            type = "text"
            value = {description}
            onChange = {(e) => setDescription(e.target.value)}
            placeholder="Description"
        />
        <div><br/></div>
        <button onClick={handleToggle}>{ complete ? "Pre-Completed" : "incomplete" }</button>
        <dib><br/><br/></dib>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={(newValue) => setDue(newValue)}
                />
            </DemoContainer>
        </LocalizationProvider>
        <div><br/></div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                label="Do Date"
                value={doDate}
                onChange={(newValue) => setDo(newValue)}
                />
            </DemoContainer>
        </LocalizationProvider>
        <div><br/></div>
        <input 
            type = "number"
            value = {duration}
            onChange = {(e) => setDuration(e.target.value)}
            placeholder="Task Duration (hrs)"
        />
        <div><br/></div>
        <select name="dropdown" id="prioritySelector">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3" selected="selected">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <div><br/></div>

        <input 
            type = "text"
            value = {tag}
            onChange = {(e) => setTag(e.target.value)}
            placeholder="Tag"
        />
        <div><br/></div>

        <button onClick={addTaskItem}>Add Task?</button>
        <div><br/><br/><br/><br/><br/><br/></div>
        
    </div>
  );
};

export default AddTask
