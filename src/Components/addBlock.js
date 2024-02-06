import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import "../App.css"
import "./addTask.css"
import "./addBlock.css"
import 'firebase/firestore';
import Popup from 'reactjs-popup';
import { collection, addDoc, Timestamp, doc, setDoc } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";
import "./addTask.css"
import dots from "./../assets/info.svg"

const AddBlock = (blocks, blockType = 0, block = null) => {

    let [optionsDiv, setOptions] = useState(<div></div>)
    const [taskLimit, setTaskLimit] = useState(8);
    let initBlockName;

    switch(blockType) {
        case 0:
            optionsDiv = <>
                <div class="rowWrapperClose">
                    <div class="popupBlockSubtitle">Show Completed Item: </div>
                    <label class="switch" for="completesCheckbox">
                        <input type="checkbox" id="completesCheckbox" />
                        <div class="slider round"></div>
                    </label>
                </div>
                <div class="rowWrapperClose">
                    <div class="popupBlockSubtitle">Show Details: </div>
                    <label class="switch" for="detailsCheckbox">
                        <input type="checkbox" id="detailsCheckbox" />
                        <div class="slider round"></div>
                    </label>
                </div>
                <div class="rowWrapperClose">
                    <div class="popupBlockSubtitle">Main View Task Limit: </div>
                    <input 
                        class = "defaultNum"
                        type = "number"
                        min = "1"
                        step = "1"
                        value = {taskLimit}
                        onChange = {(e) => setTaskLimit(e.target.value)}
                        placeholder="#"
                    />
                </div>
            </>
            initBlockName = "By Due Date"
            break;
        default:
            optionsDiv = <div>{blockType}</div>
            initBlockName = "By Due Date"
            break;
    }

    const reset = () => {
        setName(initBlockName);
        setTaskLimit(8);

        try {
            let completes = document.getElementById("completesCheckbox");
            completes = false;
        } catch (error) {
            console.log("completes not found")
        }

        try {
            let details = document.getElementById("detailsCheckbox");
            details = false;
        } catch (error) {
            console.log("details not found")
        }
    }

    const [blockName, setName] = useState(initBlockName);

    const addBlockSubmit = async () => {
        if (blockName.trim() !== ''){
            try{
                const user = auth.currentUser
                const userEmail = user ? user.email : '';
                const taskRef = doc(db, userEmail, 'webConfig');
                let newItem;

                switch (blockType) {
                    // By Due Date
                    case 0:
                        // Takes for AAA B C DDD nameAsString
                        // A = block type = 000
                        // B = show incomplete tasks
                        // C = show details
                        // D = tasks limit
                        const showCompletes = document.getElementById("completesCheckbox").checked;
                        let showCompletesStr = showCompletes ? "1" : "0";
                        const details = document.getElementById("detailsCheckbox").checked;
                        let detailsStr = details ? "1" : "0";
                        let taskLimitStr = Math.min(Math.max(Math.floor(taskLimit), 1), 999);
                        taskLimitStr = taskLimit.padStart(3, "0");

                        newItem = "000" + showCompletesStr + detailsStr + taskLimitStr + blockName;
                }
                
                let layout1 = blocks;
                layout1.push(newItem)

                const newBlock = {
                    layout1
                };

                await setDoc(taskRef, newBlock, { merge: true });
            } catch(error) {
                console.error('Error adding document:', error);
            }
        }
        reset();
    };

    const contentStyle = { background: 'transparent', border: '0px' };
    const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
    var color = getComputedStyle(document.documentElement).getPropertyValue('--userColor');
    return (
        <div>
            <Popup trigger= { <div class ="wideButton" > Add Block </div> }
                modal nested onOpen={() => reset()}
                {...{contentStyle, overlayStyle}} contentStyle={{ width: '70%', backgroundColor: 'transparent', borderColor: 'transparent' }}>
                {
                    close => (
                        <div class="glow-holder">
                            <article data-glow-popup>
                                <div class="rowWrapperSplit">
                                    <div class="popupBlockTitle"> Add Block</div>
                                </div>
                                <div>
                                    <div class="rowWrapperClose">
                                        <div class="popupBlockSubtitle">Block Name:   </div>
                                        <input 
                                            class = "defaultInput"
                                            contenteditable="true"
                                            type = "text"
                                            value = {blockName}
                                            onChange = {(e) => setName(e.target.value)}
                                            placeholder="Task Name"
                                            id = "blockNameInput"
                                        />
                                    </div>
                                    { optionsDiv }
                                    <div class="centerContents">
                                        {block == null ? 
                                            <button class="addTaskButton" onClick={() => addBlockSubmit().then( () => close())}>Add Block</button> : 
                                            // <button class="addTaskButton" onClick={() => updateTaskItem(task).then( () => close())}>Update Task</button>
                                            <></>
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
}

export default AddBlock;
