import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'firebase/firestore';
import { doc, collection, limit, query, where, orderBy } from 'firebase/firestore'
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { db } from '../Firebase/Firebase';
import "../Components/Dnd/block.css";
import { block } from '../Components/Dnd/block';
import AddTask from '../Components/addTask';

function Dnd() {
  const task = AddTask();
  const auth = getAuth();
  const [user, setUser] = useState('');
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
      orderBy("Completed" ),
      orderBy("Due", "desc")
  );
  const [tasks, loadingInc, error] = useCollection(q)

  if(!loadingInc) {
    if (error) {
      console.log("ERROR : ", error.message);
    }
    var TaskList = addKeys(tasks);
    if (loading) {
      return (
          <h1 class="uncomplete">Loading</h1>
      )
    } else{
      var root = document.querySelector(':root');
      root.style.setProperty('--userColor', webConfig.data().color)
      var layout = []
    }
    layout.push(<div class = "main">{block(TaskList)}</div>);
  }

  return (
    <div>
      { layout }
    </div>
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