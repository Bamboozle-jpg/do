import { useState, useEffect } from "react";
import "../App.css"
import { collection, limit, query, getDocs, where, orderBy, doc } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { onAuthStateChanged } from 'firebase/auth'

let tasks = [];

// A block of all the items
const AllBlock = (user) => {
    // var user = null;
    // onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //         // User is signed in, see docs for a list of available properties
    //         // https://firebase.google.com/docs/reference/js/auth.user
    //         const uid = user.uid;
    //     } else {
    //       // User is signed out
    //       // ...
    //     }
    // });

    // console.log("2")
    // const userEmail = user ? user.email : '';

    console.log(user.email)

    const userEmail = user ? user.email : '';

    const tasksDocRef = doc(db, userEmail, 'tasks');
    const tasksCollectionRef = collection(tasksDocRef,  'tasksCollection');

    const q = query(
        tasksCollectionRef,
        limit( 100 )
    );
    const [tasks] = useCollectionData(q, {idField: 'id'});
    
    if (tasks !== undefined) {
        console.log("uhhhh")
        console.log(tasks)
        console.log()
        return (
            <div>
                { tasks && tasks.map( tsk => <Task key={tsk.key} task={tsk.text} /> ) }
            </div>
        )
    }
}

function Task(props) {
    console.log(props)
    const text = props.task;
    console.log(text)
    return <p>{text}</p>
}

export default AllBlock