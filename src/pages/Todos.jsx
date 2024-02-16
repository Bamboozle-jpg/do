import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddTask from "../Components/addTask"
import { doc } from 'firebase/firestore'
import { db, auth } from "../Firebase/Firebase";
import SetUp from "../Components/setupNew"
import "./Todos.css"
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import textFile from "./../TODO.txt"
import { getAuth } from "firebase/auth";

function Todos() {
    const nav = useNavigate();
    const auth = getAuth();
    const [user, setUser] = useState('');

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

    fetch(textFile)
    .then((r) => r.text())
    .then(text  => {
        console.log(text)
        sleep(10000).then(
            document.getElementById("text").innerHTML = text
        )
    })

    const userEmail = user ? user.email : 'emptyUser';
    if (userEmail == 'emptyUser') {
        nav("/")
    }
    // Get config doc


    const configDocRef = doc(db, userEmail, 'webConfig');
    const [webConfig, loading] = useDocument(configDocRef)
    if (!loading) {
        var root = document.querySelector(':root');
        root.style.setProperty('--userColor', webConfig.data().color)
    }

    return (
        <div style={{margin:10 + "px"}}>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", }}>
                <h1>
                    Version history and plans
                </h1>
                <button style={{marginLeft: 30 + "px", height: 50 + "px"}}class="greyDefaultButton" onClick={ () => nav( "/layout1" ) }>Back</button>
            </div>
            <div class="text" id="text" style={{whiteSpace: "pre-wrap"}} >
                loading...
            </div>
        </div>
    )
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

export default Todos