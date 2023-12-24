import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AllBlock from "../Components/allBlock"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'firebase/firestore';
import { useAsync } from "react-async"
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from "../Firebase/Firebase";

function Layout1() {
    const auth = getAuth();
    const [user, setUser] = useState('');
    //these two logs return null on refresh, so it shows onAuthStateChanged 
    //is working correctly, but in allBlock, log(user.email) is null. Why?
    //to see null user.email log, change line 29 here back to allBlock = AllBlock(user)

    //console.log(user);
    //console.log(user.email);
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
    const nav = useNavigate();
    const allBlock = AllBlock(user);
    return (
        <div>
            {allBlock}
            {allBlock}
            <button onClick={ () => nav( "/" ) }>Landing Page</button>
        </div>
    )
}

export default Layout1