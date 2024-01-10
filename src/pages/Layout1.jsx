import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AllByDue, UncompleteByDue } from "../Components/blocks"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import 'firebase/firestore';
import { useAsync } from "react-async"
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, collection, limit, query, where, orderBy } from 'firebase/firestore'
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
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

    // Get config doc
    const configDocRef = doc(db, userEmail, 'webConfig');
    const [blocksGet, loading] = useDocument(configDocRef)

    // Get tasks collection
    const tasksDocRef = doc(db, userEmail, 'tasks');
    const tasksCollectionRef = collection(tasksDocRef,  'tasksCollection');

    // Get the uncompleted items as a query
    const q = query( 
        tasksCollectionRef, 
        where( "Completed", "==", false), 
        orderBy("Completed" ),
        orderBy("CompletedDate", "desc")
    );

    // Get the completed items query
    const qComp = query(
        tasksCollectionRef,
        limit( 100 ),
        where( "Completed", "==", true),
        orderBy( "Completed" ),
        orderBy( "Due", "asc" )
    );

    // Convert querys to snapshots
    const [tasks, loadingInc, error] = useCollection(q)
    const [compTasks, loadingC, errorComp] = useCollection(qComp)
    const nav = useNavigate();

    
    // Once the snapshot has returned
    if (!loadingInc && !loadingC) {

        // The first time you do this for a new query
        // you need to follow the link in the error message
        // This only needs to be done once and then it works for all users
        if (error) {
            console.log("ERROR : ", error.message);
        }
        if (errorComp) {
            console.log("ERROR : ", errorComp.message);
        }

        // Add the firestore id to the objects as the firestoreKey field
        var incompTasksList = addKeys(tasks); 
        var compTasksList = addKeys(compTasks); 

        // Check that it's ready
        if (loading) {
            return (
                <h1 class="uncomplete">Loading</h1>
            )
        } else {
            // get their blocks key
            const layoutKey = blocksGet.data().layout1
            var layout = []
            // Loops through all blocks
            for (var i = 0; i < layoutKey.length; i++) {
                
                // Setup that block's information
                var id = "blockNumber" + i;
                var blockString = layoutKey[i];
                var blockType = parseInt(blockString.substring(0, 3));
                console.log(blockType)

                // Figure out what that block is doing
                switch(blockType) {
                    case 0:
                        layout.push(<div id={id} onClick={scrollTo} >{UncompleteByDue(compTasksList, incompTasksList)}</div>);
                        break;
                    case 1:
                        layout.push(<div id={id} onClick={scrollTo} >{AllByDue(compTasksList, incompTasksList)}</div>);
                        break;
                    default:
                        break;
                }
            }
            // Return the blocks
            return (
                <div id="blocksContainer">
                    {layout}
                    <button onClick={ () => nav( "/" ) }>Landing Page</button>
                </div>
            )
        }
    } else {
        return (
            <h1 class="uncomplete">Loading</h1>
        )
    }
}

// Silliness to make it so when you click a checkbox it keeps the screen centered on the block you're looking at
const scrollTo = event => {
    // Gets the position of the element
    const element = document.getElementById(event.currentTarget.id);
    var topPos = element.getBoundingClientRect().top
    // Sets up to do some checking that the page being too short doesn't cause problems
    var newPos;

    // Scroll block to top of screen then scroll down however much the block was down
    sleep(4)
        .then(() => element.scrollIntoView())
        .then(() => newPos = element.getBoundingClientRect().top)
        .then(() => window.scrollBy(0, -1*topPos + newPos))
        .then(() => console.log("topPos : ", topPos, "newPos : ", newPos))
    // Do 2 more times because otherwise it either jitters, or misses
    .then(sleep(2))
        .then(() => element.scrollIntoView())
        .then(() => newPos = element.getBoundingClientRect().top)
        .then(() => window.scrollBy(0, -1*topPos + newPos))
        .then(() => console.log("topPos : ", topPos, "newPos : ", newPos))
    .then(sleep(2))
        .then(() => element.scrollIntoView())
        .then(() => newPos = element.getBoundingClientRect().top)
        .then(() => window.scrollBy(0, -1*topPos + newPos))
        .then(() => console.log("topPos : ", topPos, "newPos : ", newPos))
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

export default Layout1

// Adds the firestore ID to the object
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