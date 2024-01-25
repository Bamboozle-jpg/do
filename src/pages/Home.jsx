import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddTask from "../Components/addTask"
import { doc } from 'firebase/firestore'
import { db, auth } from "../Firebase/Firebase";
import SetUp from "../Components/setupNew"
import { useDocument, useCollection } from "react-firebase-hooks/firestore";

function Home() {
    const nav = useNavigate();
    const task = AddTask();

    // Get user settings
    const [user, setUser] = useState('');
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('Current user:', user);
                console.log('User UID:', user.uid);
                console.log('User email:', user.email);
                setUser(user)
            } else {
                console.log('No user is currently signed in.');
            }
        });
        return unsubscribe;
    },[])
    const userEmail = user ? user.email : 'kevin@bachelorclan.com';
    const configDocRef = doc(db, userEmail, 'webConfig');
    const [webConfig, loading] = useDocument(configDocRef)
    if (!loading) {
        var root = document.querySelector(':root');
        root.style.setProperty('--userColor', webConfig.data().color)
    }

    // Sets up new user if necessary
    SetUp();

    if (!loading) {
        return (
            <div>
                <h1>
                    Main Page
                </h1>
                {task}
                <button onClick={ () => nav( "/" ) }>Landing Page</button>
                <button onClick={ () => nav( "/layout1" ) }>Layout1</button>
            </div>
        )
    } else {
        return (
            <h1 class="uncomplete">Loading</h1>
        )
    }
}

export default Home