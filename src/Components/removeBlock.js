import * as React from 'react';
import "../App.css"
import 'firebase/firestore';
import Popup from 'reactjs-popup';
import { doc, updateDoc, arrayRemove } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";
import "./addTask.css"
import trash from "./../assets/trash.svg"

const RemoveBlock = (itemString, blockName) => {

    const removeBlockConfirm = async (itemString) => {

        try {
            const user = auth.currentUser
            const userEmail = user ? user.email : '';
            const blocks = doc(db, userEmail, 'webConfig');

            await updateDoc(blocks, {
                layout1 : arrayRemove(itemString)
            });

        }catch(error){
            console.error('Error removing document:', error);
        }
    };

    const contentStyle = { background: 'transparent', border: '0px' };
    const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

    return (
        <div style={{marginLeft: 25 + "px"}}>
            <Popup trigger= 
                <img class="trash" width="35" height="35" src={trash} />
                modal nested
                {...{contentStyle, overlayStyle}} contentStyle={{ width: '70%', backgroundColor: 'transparent', borderColor: 'transparent' }}>
                {
                    close => (
                        <div class="glow-holder">
                            <article data-glow-popup>
                                <div><br></br></div>
                                <div class="blockTitleDelete">{blockName}</div>
                                <div class="centerContents">
                                    <button class="addTaskButton" onClick={
                                            () => removeBlockConfirm(itemString).then( () => close())
                                        }>
                                        Delete Block
                                    </button>
                                    <button class="addTaskButton" onClick={
                                            () => close()
                                        }>
                                        Cancel
                                    </button>
                                </div>
                            </article>
                        </div>
                    )
                } 
            </Popup>
            
        </div>
    );
};

export default RemoveBlock