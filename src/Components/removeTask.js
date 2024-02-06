import * as React from 'react';
import "../App.css"
import 'firebase/firestore';
import Popup from 'reactjs-popup';
import { doc, deleteDoc } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";
import "./addTask.css"
import trash from "./../assets/trash.svg"

const RemoveTask = (task) => {

    const removeTaskItem = async (task) => {
        try {
            console.log("deleted?", task);
            const user = auth.currentUser
            const userEmail = user ? user.email : '';
            const taskRef = doc(db, userEmail, 'tasks', 'tasksCollection', task.firestoreKey);
            console.log("task reference: ", taskRef);
            await deleteDoc(taskRef);
        }catch(error){
            console.error('Error removing document:', error);
        }
    };

    const contentStyle = { background: 'transparent', border: '0px' };
    const overlayStyle = { background: 'rgba(0,0,0,0.5)' };

    const dueDate = task.due.toDate();
    const month = dueDate.getMonth() + 1;
    const day = dueDate.getDate();
    const year = dueDate.getFullYear();
    const due = `${month}/${day}/${year}`;

    const doDate = task.do.toDate();
    const Dmonth = doDate.getMonth() + 1;
    const Dday = doDate.getDate();
    const Dyear = doDate.getFullYear();
    const Do = `${Dmonth}/${Dday}/${Dyear}`;

    return (
        <div>
            <Popup trigger= 
                {task ? <img class="trash" width="35" height="35" src={trash} /> : <div class ="defaultButton" > Add Task </div> } 
                modal nested
                {...{contentStyle, overlayStyle}} contentStyle={{ width: '70%', backgroundColor: 'transparent', borderColor: 'transparent' }}>
                {
                    close => (
                        <div class="glow-holder">
                            <article data-glow-popup>
                                <div><br></br></div>
                                <div class={ task.completed ? "completedTitle" : "uncompleteTitle"} onClick={() => console.log("uh oh stinky") }>{task.name}</div>
                                <div class={ task.completed ? "completed" : "uncomplete"} >{task.description}</div>
                                <div class={ task.completed ? "completed" : "uncomplete"} >Duration : {task.duration}</div>
                                <div class={ task.completed ? "completed" : "uncomplete"} >Priority : {task.priority}</div>
                                { due != "1/1/3000" ? <div class={ task.completed ? "completed" : "uncomplete"} >Due : {due}</div> : <div class={ task.completed ? "completed" : "uncomplete"} >NO DUE DATE</div> }
                                { Do != "1/1/3000" ? <div class={ task.completed ? "completed" : "uncomplete"} >Do : {Do}</div> : <div class={ task.completed ? "completed" : "uncomplete"} >NO DO DATE</div> }

                                <div class="centerContents">
                                    <button class="addTaskButton" onClick={
                                            () => removeTaskItem(task).then( () => close())
                                        }>
                                        Delete Task
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

export default RemoveTask