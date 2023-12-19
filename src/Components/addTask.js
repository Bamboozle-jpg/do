import React, { useState } from "react";
import "../App.css"
import 'firebase/firestore';
import { collection, addDoc } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";

const AddTask = () => {
  const [task, setTodoTask] = useState('');
  //new to do item to firebase

  const addTaskItem = async () => {
    if (task.trim() !== ''){
      try{
        const user = auth.currentUser
        const userEmail = user ? user.email : '';
        const taskRef = collection(db, userEmail, 'tasks', 'tasksCollection');
        const newTask = {
          text: task,
          completed: false,
          createdBy: userEmail,
        };
        await addDoc(taskRef, newTask);
        setTodoTask('');
      }catch(error){
        console.error('Error adding document:', error);
      }
    }
  };

  return (
    <div>
      <input 
       type = "text"
       value = {task}
       onChange = {(e) => setTodoTask(e.target.value)}
       placeholder="Enter a to-do item"
       />
       <button onClick={addTaskItem}>Add Task?</button>
    </div>
  );
};

export default AddTask
