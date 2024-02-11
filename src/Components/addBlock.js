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
import "./addTask.css";
import dots from "./../assets/info.svg";

const AddBlock = (blocks, blockType = 1) => {

    let [optionsDiv, setOptions] = useState(<div></div>)
    const [taskLimit, setTaskLimit] = useState(8);
    const [itemID, setItemID] = useState("XXXXXXXXXXXXXXXXXXXX");

    let initBlockName;

    const completesDiv = 
    <div class="rowWrapperClose">
        <div class="popupBlockSubtitle">Show Completed Item: </div>
        <label class="switch" for="completesCheckbox">
            <input type="checkbox" id="completesCheckbox" />
            <div class="slider round"></div>
        </label>
    </div>
    const detailsDiv = 
    <div class="rowWrapperClose">
        <div class="popupBlockSubtitle">Show Details: </div>
        <label class="switch" for="detailsCheckbox">
            <input type="checkbox" id="detailsCheckbox" />
            <div class="slider round"></div>
        </label>
    </div>
    const taskLimitDiv =
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
    const priorityDiv = 
    <div class="rowWrapperClose">
        <div class="popupBlockSubtitle">Priority Cutoff: </div>
        <select class="defaultSelector" name="dropdown" id="prioritySelector">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3" selected="selected">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
    </div>
    const itemIDDiv = 
    <div class="rowWrapperClose">
        <div class="popupBlockSubtitle">Item ID:   </div>
        <input 
            class = "defaultInput"
            contenteditable="true"
            type = "text"
            value = {itemID}
            onChange = {(e) => setItemID(e.target.value)}
            placeholder="20 Character ID"
            id = "IDInput"
        />
    </div>

    switch(blockType) {
        // By Due
        case 0:
            optionsDiv = <>
                { completesDiv }
                { detailsDiv }
                { taskLimitDiv }
            </>
            initBlockName = "By Due Date"
            break;
        // By Do
        case 1:
            optionsDiv = <>
                { completesDiv }
                { detailsDiv }
                { taskLimitDiv }
            </>
            initBlockName = "By Do Date"
            break;
        // Priority 
        case 2:
            optionsDiv = <>
                { completesDiv }
                { detailsDiv }
                { taskLimitDiv }
                { priorityDiv }
            </>
            initBlockName = "By Priority"
            break;
        // Today
        case 3:
            optionsDiv = <>
                { completesDiv }
                { detailsDiv }
                { taskLimitDiv }
            </>
            initBlockName = "Today"
            break;
        // Due Overdue
        case 4:
            optionsDiv = <>
                { detailsDiv }
                { taskLimitDiv }
            </>
            initBlockName = "Due Now or Overdue"
            break;
        // Missing Do
        case 5:
            optionsDiv = <>
                { completesDiv }
                { detailsDiv }
                { taskLimitDiv }
            </>
            initBlockName = "Missing Do Date"
            break;
        // Item ID
        case 6:
            optionsDiv = <>
                { completesDiv }
                { detailsDiv }
                { itemIDDiv }
            </>
            initBlockName = "TASK NAME HERE"
            break;
        // Only Completes
        case 7:
            optionsDiv = <>
                { detailsDiv }
                { taskLimitDiv }
            </>
            initBlockName = "Completed Tasks"
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

        try {
            let priority = document.getElementById("prioritySelector");
            priority = 3;
        } catch (error) {
            console.log("priority not found")
        }
    }

    var blockTitle = "";
   
    switch (blockType) {
        case 0:
            blockTitle = "By Due Date";
            break;
        case 1:
            blockTitle = "By Do Date";
            break;
        case 2:
            blockTitle = "By Priority";
            break;
        case 3:
            blockTitle = "Today";
            break;
        case 4:
            blockTitle = "Due Now or Overdue";
            break;
        case 5:
            blockTitle = "Missing Do Date";
            break;
        case 6:
            blockTitle = "TASK NAME HERE";
            break;
        case 7:
            blockTitle = "Completed Tasks";
            break;
        default:
            blockTitle = "By Due Date";
            break;
    }

// Rest of the code...

    const [blockName, setName] = useState(initBlockName);

    const addBlockSubmit = async () => {
        let priorityCutoffStr = null;
        let showCompletesStr = null;
        let detailsStr = null;
        let taskLimitStr = null;

        if (blockName.trim() !== ''){
            try{
                const user = auth.currentUser
                const userEmail = user ? user.email : '';
                const taskRef = doc(db, userEmail, 'webConfig');
                let newItem;

                try {
                    const showCompletes = document.getElementById("completesCheckbox").checked;
                    showCompletesStr = showCompletes ? "1" : "0";
                } catch (error) {}

                try {
                    const details = document.getElementById("detailsCheckbox").checked;
                    detailsStr = details ? "1" : "0";
                } catch (error) {
                    console.log("no details?")
                }

                try {
                    taskLimitStr = Math.min(Math.max(Math.floor(taskLimit), 1), 999);
                    taskLimitStr = taskLimit.toString().padStart(3, "0");
                } catch (error) {
                    console.log(error.message)
                }

                try {
                    let priorityCutoff = document.getElementById("prioritySelector");
                    console.log(priorityCutoff);
                    priorityCutoffStr = priorityCutoff.value.toString();
                } catch (error) {}

                switch (blockType) {
                    // By Due Date
                    case 0:
                        // Takes for AAA B C DDD nameAsString
                        // A = block type = 000
                        // B = show incomplete tasks
                        // C = show details
                        // D = tasks limit
                        newItem = "000" + showCompletesStr + detailsStr + taskLimitStr + blockName;
                        break;
                    // By Do Date
                    case 1:
                        // Takes for AAA B C DDD nameAsString
                        // A = block type = 001
                        // B = show incomplete tasks
                        // C = show details
                        // D = tasks limit
                        newItem = "001" + showCompletesStr + detailsStr + taskLimitStr + blockName;
                        break;
                    // By Priority
                    case 2:
                        // Takes for AAA B C DDD E nameAsString
                        // A = block type = 002
                        // B = show incomplete tasks
                        // C = show details
                        // D = tasks limit
                        // E = Priority cutoff
                        newItem = "002" + showCompletesStr + detailsStr + taskLimitStr + priorityCutoffStr + blockName
                        break;
                    // Today
                    case 3:
                        // Takes for AAA B C DDD nameAsString
                        // A = block type = 003
                        // B = show incomplete tasks
                        // C = show details
                        // D = tasks limit
                        newItem = "003" + showCompletesStr + detailsStr + taskLimitStr + blockName;
                        break;
                    // Due Now or Overdue
                    case 4:
                        // Takes for AAA B CCC nameAsString
                        // A = block type = 004
                        // B = show details
                        // C = tasks limit
                        newItem = "004" + detailsStr + taskLimitStr + blockName;
                        break;
                    // Missing Do Date
                    case 5:
                        // Takes for AAA B C DDD nameAsString
                        // A = block type = 005
                        // B = show incomplete tasks
                        // C = show details
                        // D = tasks limit
                        newItem = "005" + showCompletesStr + detailsStr + taskLimitStr + blockName;
                        break;
                    // Only Item
                    case 6:
                        // Takes for AAA B C XXXXXXXXXXXXXXXXXXXX (x20) nameAsString
                        // A = block type = 006
                        // B = show incomplete tasks
                        // C = show details
                        // X = item ID
                        newItem = "006" + showCompletesStr + detailsStr + itemID + blockName;
                        break;
                    // Only Completes
                    case 7:
                        // Takes for AAA B CCC nameAsString
                        // A = block type = 007
                        // B = show details
                        // C = tasks limit
                        newItem = "007" + detailsStr + taskLimitStr + blockName;
                        break;
                    default:
                        break;
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
            <Popup trigger= {  <div class ="wideButton" style={{marginLeft: 100 + "px", marginRight: 100 + "px", fontSize: 30 + "px", textAlign: 'center'}} > {blockTitle} </div> }
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
                                        <button class="addTaskButton" onClick={() => addBlockSubmit().then( () => close())}>Add Block</button> : 
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
