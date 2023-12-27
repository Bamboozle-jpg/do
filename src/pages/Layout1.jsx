import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AllByDueBlock, UncompleteByDueBlock } from "../Components/blocks"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'firebase/firestore';
import { useAsync } from "react-async"
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc } from 'firebase/firestore'
import { useDocument } from "react-firebase-hooks/firestore";
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

    // User email shenanigans
    const userEmail = user ? user.email : 'kevin@bachelorclan.com';

    // Where to find config doc
    const configDocRef = doc(db, userEmail, 'webConfig');
    
    // Get the doc
    const [blocksGet, loading] = useDocument(configDocRef)

    const nav = useNavigate();
    const allByDueBlock = AllByDueBlock(user);
    const uncompleteByDueBlock = UncompleteByDueBlock(user);
    const blocksDict = {
        0: uncompleteByDueBlock,
        1: allByDueBlock,
    }

    if (loading) {
        return (
            <h1 class="uncomplete">Loading</h1>
        )
    } else {
        const layoutKey = blocksGet.data().layout1
        var layout = []
        for (var i = 0; i < layoutKey.length; i++) {
            layout.push(blocksDict[layoutKey[i]]);
        }
        return (
            <div>
                {layout}
                <button onClick={ () => nav( "/" ) }>Landing Page</button>
            </div>
        )
    }
}

export default Layout1