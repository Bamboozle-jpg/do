import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import "../App.css"
import 'firebase/firestore';
import Popup from 'reactjs-popup';
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";
import { createTheme, ThemeProvider } from '@mui/material/styles'
import "./addTask.css"
import { newTheme } from "./dateTheme"
import dots from "./../assets/info.svg"

const AddTask = (task = null) => {

    
    const [name, setName] = useState(task ? task.name : '');
    const [description, setDescription] = useState(task ? task.description : '');
    const [dueDate, setDue] = React.useState(task ? task.due : null);
    const [doDate, setDo] = React.useState(task ? task.do : null);
    const [duration, setDuration] = useState(task ? task.duration : 1);
    const [tags, setTags] = useState(task ? task.tags : []);

    const reset = () => {
        setName(task ? task.name : '');
        setDescription(task ? task.description : '');
        const descriptionDoc = document.getElementById("descrpitionText")
        descriptionDoc.value = description;
        setDue(task && task.due.seconds != 32503708800 ? dayjs(task.due.seconds * 1000) : null);
        setDo(task && task.do.seconds != 32503708800 ? dayjs(task.do.seconds * 1000) : null);
        setDuration(task ? task.duration : 1);
        setTags(task ? task.tags : []);

        let priorityElement = document.getElementById("prioritySelector");
        priorityElement.value = task? task.priority : 3;
    }


    const addTaskItem = async () => {
        if (name.trim() !== ''){
            try{
                const priority = document.getElementById("prioritySelector");
                const description = document.getElementById("descrpitionText")
                const user = auth.currentUser
                const userEmail = user ? user.email : '';
                const taskRef = collection(db, userEmail, 'tasks', 'tasksCollection');
                const newTask = {
                    Name: name,
                    Description: description.value,
                    Due: dueDate ? Timestamp.fromDate(dueDate.toDate()) : Timestamp.fromDate(new Date(3000, 0, 1)),
                    Do: doDate ? Timestamp.fromDate(doDate.toDate()) : Timestamp.fromDate(new Date(3000, 0, 1)),
                    Duration: duration,
                    Priority: parseInt(priority.value),
                    FromRepeat: false,
                    Completed: false,
                    Children: [],
                    Tags: tags,
                    CreatedBy: userEmail,
                    CompletedDate: null
                };
                await addDoc(taskRef, newTask);
            }catch(error){
                console.error('Error adding document:', error);
            }
        }
        reset();
    };

    const updateTaskItem = async (task) => {
        if (name.trim() !== ''){
            try{
                const priority = document.getElementById("prioritySelector");
                const description = document.getElementById("descrpitionText")
                const user = auth.currentUser
                const userEmail = user ? user.email : '';
                const taskRef = doc(db, userEmail, 'tasks', 'tasksCollection', task.firestoreKey);
                console.log(name)
                console.log(task)
                await setDoc(taskRef, {
                    Name: name,
                    Description: description.value,
                    Due: dueDate ? Timestamp.fromDate(dueDate.toDate()) : Timestamp.fromDate(new Date(3000, 0, 1)),
                    Do: doDate ? Timestamp.fromDate(doDate.toDate()) : Timestamp.fromDate(new Date(3000, 0, 1)),
                    Duration: duration,
                    Priority: parseInt(priority.value),
                    FromRepeat: task.fromRepeat,
                    Completed: task.completed,
                    Children: task.children,
                    Tags: task.children ? task.children : null,
                    CreatedBy: userEmail,
                    CompletedDate: task.completedDate ? task.completedDate : null
                });
                console.log("success")
            }catch(error){
                console.error('Error adding document:', error);
            }
        }
    };

    const contentStyle = { background: 'transparent', border: '0px' };
    const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
    var color = getComputedStyle(document.documentElement).getPropertyValue('--userColor');

    const myTheme = newTheme
    const newerTheme = (theme) => createTheme({
        ...theme,
        components: {
            MuiFormControl: {
                styleOverrides: {
                    root: {
                        paddingRight: "30px",
                        width: "325px"
                    }
                }
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        color: "hsl("+color+", 50%, 65%)",
                        fontWeight: "bold",
                        fontSize: "20px",
                        '&.Mui-focused' : {
                            color: "hsl("+color+", 50%, 65%)",
                        }
                    }
                    
                }
            },
            MuIInputLabel: {
                styleOverrides: {
                    root: {
                        "&.Mui-focused" : {
                            color: "hsl("+color+", 50%, 65%)"
                        }
                    }
                }
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        borderColor: "hsl("+color+", 50%, 65%)",  
                        '&:hover': {
                            borderColor: "hsl("+color+", 50%, 65%)"
                        },
                        '&.Mui-focused' : {
                            borderColor: "hsl("+color+", 50%, 65%)",
                            color: "hsl("+color+", 50%, 65%)"
                        }

                    },
                    root: {
                        '&:hover': {
                            borderColor: "hsl("+color+", 50%, 65%)",
                            color: "hsl("+color+", 50%, 65%)"
                        },
                        '&.Mui-focused' : {
                            borderColor: "hsl("+color+", 50%, 65%)",
                            color: "hsl("+color+", 50%, 65%)"
                        }
                    }
                }
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        color: "hsl("+color+", 50%, 65%)",
                    }
                }
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        color: "hsl("+color+", 50%, 65%)",
                        fontWeight: "bold",
                        fontSize: "20px",
                        MuiOutlinedInput: {
                            root: {
                                '&.Mui-focused': {
                                    borderColor: "hsl("+color+", 50%, 65%)"
                                }
                            }
                            //     .MuiOutlinedInput-notchedOutline {
                            // border-color: #1976d2;
                            // border-width: 2px;
                        }
                    }
                }
            },
            MuiDateCalendar: {
                styleOverrides: {
                    root: {
                        color: "hsl("+color+", 50%, 65%)",
                        borderRadius: 4,
                        borderWidth: 3,
                        // borderColor: "hsl("+color+", 50%, 50%)",
                        border: "3px solid hsl("+color+", 50%, 65%)",
                        backgroundColor: "hsl("+color+", 20%, 20%)",
                    }
                }
            
            },
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        color: "hsl("+color+", 50%, 65%)",
                        '&.Mui-selected': {
                            backgroundColor: "hsl("+color+", 70%, 65%)",
                            color: "hsl("+color+", 40%, 25%)",
                            '&:hover': {
                                backgroundColor: "hsl("+color+", 30%, 25%)",
                                border: "1px solid hsl("+color+", 50%, 5%)",
                                color: "hsl("+color+", 50%, 65%)"
                            },
                        },
                        '&:hover': {
                            border: "1px solid hsl("+color+", 50%, 5%)",
                            backgroundColor: "hsl("+color+", 30%, 25%)"
                        },
                        backgroundColor: "transparent"
                    },
                }
            },
            MuiDayCalendar: {
                styleOverrides: {
                    weekDayLabel: {
                        color: "hsl("+color+", 50%, 65%)",
                        backgroundColor: "hsl("+color+", 30%, 30%)",
                        borderRadius: 5

                    }
                }
            },
        }
    })

    const input = document.getElementById("nameInput");
    const span = document.getElementById("nameSpan");

    if (input != null) {
        input.addEventListener('input', function (event) {
            span.innerHTML = this.value.replace(/\s/g, '&nbsp;');
            this.style.width = (span.offsetWidth * 1) + 'px';
        });
    }

    return (
        <div>
            <Popup trigger= 
                {task ? <img class="dots" width="60" height="16" src={dots} /> : <div class ="defaultButton" > Add Task </div> } 
                modal nested onOpen={() => reset()}
                {...{contentStyle, overlayStyle}} contentStyle={{ width: '70%', backgroundColor: 'transparent', borderColor: 'transparent' }}>
                {
                    close => (
                        <div class="glow-holder">
                            <article data-glow-popup>
                                <div class="rowWrapperSplit">
                                    <div class="popupBlockTitle"> Add Task</div>
                                </div>
                                <div>
                                    <div class="rowWrapperClose">
                                        <div class="popupBlockSubtitle">Name:   </div>
                                        <input 
                                            class = "defaultInput"
                                            contentEditable="true"
                                            type = "text"
                                            value = {name}
                                            onChange = {(e) => setName(e.target.value)}
                                            placeholder="Task Name"
                                            id = "nameInput"
                                        />
                                    <span id = "nameSpan" class = "defaultSpan" ></span>
                                    </div>
                                    <div class="popupBlockSubtitle">Description: </div>
                                    <textarea id="descrpitionText" class="defaultArea" cols="40" rows="5" placeholder='Any notes on the task'></textarea>
                                    <div class="rowWrapperClose">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                <ThemeProvider theme={newerTheme}>
                                                    <DatePicker
                                                    label="Due Date"
                                                    value={dueDate}
                                                    onChange={(newValue) => setDue(newValue)}
                                                    />
                                                </ThemeProvider>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        <div><br/></div>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                <ThemeProvider theme={newerTheme}>
                                                    <DatePicker
                                                    label="Do Date"
                                                    value={doDate}
                                                    onChange={(newValue) => setDo(newValue)}
                                                    />
                                                </ThemeProvider>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </div>
                                    <div><br/></div>
                                    <div class="rowWrapperClose">
                                        <div class="popupBlockSubtitle">Task Duration: </div>
                                        <input 
                                            class = "defaultNum"
                                            type = "number"
                                            min = "0"
                                            step = "0.5"
                                            value = {duration}
                                            onChange = {(e) => setDuration(e.target.value)}
                                            placeholder="Task Duration (hrs)"
                                        />
                                        <div class="popupBlockSubtitle"> hrs</div>
                                    </div>
                                    <div><br/></div>
                                    <div class="rowWrapperClose">
                                        <div class="popupBlockSubtitle">Priority: </div>
                                        <select class="defaultSelector" name="dropdown" id="prioritySelector">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3" selected="selected">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                    </div>
                                    <div><br/></div>

                                    {/* <input 
                                        type = "text"
                                        value = {tags}
                                        onChange = {(e) => setTags(e.target.value)}
                                        placeholder="Tags"
                                    /> */}
                                    <div class="centerContents">
                                        {task == null ? 
                                            <button class="addTaskButton" onClick={() => addTaskItem().then( () => close())}>Add Task</button> : 
                                            <button class="addTaskButton" onClick={() => updateTaskItem(task).then( () => close())}>Update Task</button>
                                        }
                                        
                                        <button class="addTaskButton" onClick=
                                        {() => close()}>
                                            Cancel
                                        </button>
                                    </div>
                                    <div><br/><br/><br/><br/><br/><br/></div>
                                </div>
                            </article>
                        </div>
                    )
                } 
            </Popup>
            
        </div>
    );
};

export default AddTask