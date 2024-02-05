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

const AddBlock = () => {

    const [blockName, setName] = useState('');
    let [test, setTest] = useState(<div></div>)

    const reset = () => {
    }

    switch(blockName) {
        case "hi":
            test = <div>hi!!</div>;
            console.log("hi!!");
            break;
        case "bye":
            test = <div>bye!!</div>;
            console.log("bye!!");
            break;
        default:
            test = <div>{blockName}</div>
            break;
    }

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
                                        /> { test }
                                    </div>
                                    <div class="centerContents">
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
