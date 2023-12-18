import React, { useEffect, useState } from "react";
import "../App.css"
// import 'firebase/firestore';
import { collection, getCountFromServer, limit, query } from "firebase/firestore"; 
import { db, auth, onSnapshot } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";


const SetUp = () => {
  const [user] = useAuthState(auth)
  const [task, setTodoTask] = useState('');
  //new to do item to firebase
  var returner = "hmm"
  var userEmail = ''
  const userRef = null;

  try{
    userEmail = user ? user.email : '';
    userRef = collection(db, userEmail);
    returner = userEmail
  }catch(error){
    returner = error.message;
    console.error('Error adding document:', error);
  }

  useEffect( () => {
    if (userEmail == '') {
      return <div>not working</div>
    }

    const q = query(
    collection( db, userEmail ),  // these messages are on cloud firestore
    limit( 1 )
    );

    // ??
    // const unsubscribe = onSnapshot( q, ( QuerySnapshot ) => {
    //   var messages = [];
      
    //   var a = localStorage.getItem( "UserID" );
    //   console.log( a );

    //   QuerySnapshot.

    // QuerySnapshot.forEach( ( doc ) => {
    // } );
    // });
    // return () => unsubscribe;
  }, [] );

  return (
    <div>
      <input 
       type = "text"
       value = {task}
       onChange = {(e) => setTodoTask(e.target.value)}
       placeholder="Enter a to-do item"
       />
       <div>{returner}</div>
    </div>
  );
};

export default SetUp
