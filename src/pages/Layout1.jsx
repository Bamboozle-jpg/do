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
            var id = "blockNumber" + i;
            console.log(id);
            layout.push(<div id={id} onClick={scrollTo} >{blocksDict[layoutKey[i]]}</div>);
        }
        return (
            <div id="blocksContainer">
                {layout}
                <button onClick={ () => nav( "/" ) }>Landing Page</button>
            </div>
        )
    }
}

const scrollTo = event => {
    const element = document.getElementById(event.currentTarget.id);
    var topPos = element.getBoundingClientRect().top
    var newPos;

    sleep(5)
        .then(() => element.scrollIntoView())
        .then(() => newPos = element.getBoundingClientRect().top)
        .then(() => window.scrollBy(0, -1*topPos + newPos))
        .then(() => console.log("topPos : ", topPos, "newPos : ", newPos));

    
    // element.scrollIntoView()
    // window.scrollBy(0, -1*topPos)
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

export default Layout1