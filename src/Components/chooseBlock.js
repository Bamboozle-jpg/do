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
import AddBlock from './addBlock';

const ChooseBlock = (blocks) => {

    const contentStyle = { background: 'transparent', border: '0px' };
    const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
    const block1 = AddBlock( blocks, 0);
    const block2 = AddBlock( blocks, 1);
    const block3 = AddBlock( blocks, 2);
    const block4 = AddBlock( blocks, 3);
    const block5 = AddBlock( blocks, 4);
    const block6 = AddBlock( blocks, 5);
    // const block7 = AddBlock( blocks, 6);
    const block8 = AddBlock( blocks, 7);

    var color = getComputedStyle(document.documentElement).getPropertyValue('--userColor');
    return (
        <div>
            <Popup trigger= {  <div class ="wideButton" style={{width: 100 + "%", paddingRight: 0, paddingLeft: 0, fontSize: 30 + "px", textAlign: 'center'}} > Add Block </div> }
                modal nested 
                {...{contentStyle, overlayStyle}} contentStyle={{ width: '70%', backgroundColor: 'transparent', borderColor: 'transparent' }}>
                {
                    close => (
                        <div class="glow-holder">
                            <article data-glow-popup>
                            <div class="rowWrapperSplit">
                                    <div class="popupBlockTitle" style={{margin: "auto", fontSize: 50 + "px"}}> Choose Block </div>
                                </div>
                                <div>
                                    <div class="rowWrapperSplit">
                                        {block1}
                                        {block2}
                                    </div>
                                    <div class="rowWrapperSplit">
                                        {block3}
                                        {block4}
                                    </div>
                                    <div class="rowWrapperSplit">
                                        {block5}
                                        {block6}
                                    </div> 
                                    <div class="rowWrapperSplit">
                                        {block8}
                                    </div> 
                                    <div><br/></div>
                                </div>
                                <div style={{margin: "auto", width: "min-content"}}>
                                    <button class="addTaskButton"  onClick=
                                    {() => close()}>
                                        Close
                                    </button>
                                </div>
                                <div><br/></div>
                            </article>
                        </div>
                    )
                } 
            </Popup>
            
        </div>
    );
}

export default ChooseBlock;
