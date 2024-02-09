import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'firebase/firestore';
import { doc, collection, limit, query, where, orderBy, setDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { db } from '../Firebase/Firebase';
import "../Components/Dnd/block.css";
import { block } from '../Components/Dnd/block';
import AddTask from '../Components/addTask';
import { DragDropContext } from 'react-beautiful-dnd';
import { Days } from '../Components/Dnd/days';

function Dnd() {

  const auth = getAuth();
  const [user, setUser] = useState('');
  const [items, setItems] = useState([]);

  //these two logs return null on refresh, so it shows onAuthStateChanged 
  //is working correctly, but in allBlock, log(user.email) is null. Why?
  //to see null user.email log, change line 29 here back to allBlock = AllBlock(user)

  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
              setUser(user)
          } else {
              console.log('No user is currently signed in.');
          }
      });
      return unsubscribe;
  },[])

  // User email shenanigans
  const userEmail = user ? user.email : 'kevin@bachelorclan.com';

  // Get config doc
  const configDocRef = doc(db, userEmail, 'webConfig');
  const [webConfig, loading] = useDocument(configDocRef)

  // Get tasks collection
  const tasksDocRef = doc(db, userEmail, 'tasks');
  const tasksCollectionRef = collection(tasksDocRef,  'tasksCollection');
  // Get the uncompleted items as a query

    const q = query( 
    tasksCollectionRef, 
    where( "Completed", "==", false), 
    //orderBy("Do" ),
    //orderBy("Due", "desc")
    );
  const [tasks, loadingInc, error] = useCollection(q)

if(!loadingInc) {
  if (error) {
    console.log("ERROR : ", error.message);
  }
  var TaskList = addKeys(tasks);

  //get list of tasks with no do date

  //should replace this with on input/on change
  if (items.length == 0) {
    setItems(TaskList)
  }
  if (loading) {
    return (
        <h1 class="uncomplete">Loading</h1>
    )
  } else{
    var root = document.querySelector(':root');
    root.style.setProperty('--userColor', webConfig.data().color)
    var layout = []
  }
  layout.push(<div class = "noDo">{block(items)}</div>);
}
const onDragEnd = async (result) => {
  const{destination, source, draggableId} = result;
  if(!destination) {
      return;
  }

  if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
  ){
      return;
  }   
  const start = source.droppableId;
  const finish = destination.droppableId;

  const newItems = Array.from(items);

  if(start === finish){
    const [removed] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removed);
    setItems(newItems);
    return;
  }
  //upon dropping into a day block, update the task's Do field
  else if (finish != "NoDo"){ 
    const taskId = draggableId;
    const taskRef = doc(db, userEmail, 'tasks', 'tasksCollection', taskId);
      await updateDoc(taskRef, {
        Do: strToTimestamp(finish)
      });
    
      

    const finishTime = strToTimestamp(finish)
    setItems(TaskList)
    const newTerm = TaskList.filter((tsk) => tsk.Key == draggableId);
    TaskList = TaskList.filter((tsk) => tsk.Key != draggableId);

    console.log("new Item : ", newTerm[0])
    newTerm[0]["Do"] = finishTime
    TaskList.push(newTerm)


    console.log(TaskList)
    console.log(items)
    console.log(draggableId)
    console.log(destination.droppableId)

    return;
  }
  
  else if (finish == "NoDo"){
    const taskId = draggableId;
    const taskRef = doc(db, userEmail, 'tasks', 'tasksCollection', taskId);
    await updateDoc(taskRef, {
      Do: strToTimestamp("1/1/3000")
    });
    setItems(TaskList)
    return;
  }

};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <Days tasksList = {items} />
    { layout }
    </DragDropContext>
  )
}

export default Dnd

function addKeys(tasks) {

  // Copies into array of dicts
  var taskList = []
  tasks.docs.forEach((doc) => {

      // Each document gets copied over, and so does it's key
      const newDict = { ...doc.data() };
      newDict['Key'] = doc._key.path.segments[doc._key.path.segments.length - 1];
      taskList.push(newDict)
  })
  return taskList;
}

//convert to timstamp
const strToTimestamp = (dateString) => {
  const dateParts = dateString.split('/');
  const month = parseInt(dateParts[0], 10) - 1; 
  const day = parseInt(dateParts[1], 10);
  const year = parseInt(dateParts[2], 10);
  const dateObject = new Date(year, month, day);

  const timestamp = Timestamp.fromDate(dateObject);

  return timestamp;
};