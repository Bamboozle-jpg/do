import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    ByDue,
    ByDo,
    ByPriority,
    Today,
    DueOverdue,
    MissingDo,
    OnlyItem,
    onlyCompletes
} from "../Components/blocks"
import { getAuth } from "firebase/auth";
import 'firebase/firestore';
import { doc, collection, limit, query, where, orderBy } from 'firebase/firestore'
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { db } from "../Firebase/Firebase";
import "./Layout.css"
import AddTask from "../Components/addTask"
import ChooseBlock from '../Components/chooseBlock';
import SetUp from '../Components/setupNew';
import logo from "./../assets/do.png"
import calendarImage from "./../assets/calendar.svg"

function Layout1() {

    SetUp();

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

    // Get the completed items query
    const qComp = query(
        tasksCollectionRef,
        limit( 100 ),
        where( "Completed", "==", true),
        orderBy( "Completed" ),
        orderBy( "CompletedDate", "desc" )
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
            const block = ChooseBlock(null);
            return (
                <h1 class="uncomplete">Loading</h1>
            )
        } else {
            // get their blocks key
            const layoutKey = webConfig.data().layout1
            const block = ChooseBlock(layoutKey);

            var root = document.querySelector(':root');
            root.style.setProperty('--userColor', webConfig.data().color)
            var layout = []
            // Loops through all blocks
            for (var i = 0; i < layoutKey.length; i++) {
                
                // Setup that block's information
                var id = "blockNumber" + i;
                var blockString = layoutKey[i];
                var blockType = parseInt(blockString.substring(0, 3));

                // Figure out which block to add and fill with parameters from the string
                // OnlyItem,
                switch(blockType) {
                    case 0:
                        // ByDue
                        var showComp = parseInt(blockString.substring(3, 4));
                        var showDetails = parseInt(blockString.substring(4, 5));
                        var tasksLimit = parseInt(blockString.substring(5, 8));
                        var name = blockString.substring(8);
                        layout.push(<div id={id} onClick={scrollTo} >{ByDue(compTasksList, incompTasksList, showComp, showDetails, tasksLimit, name, blockString)}</div>);
                        break;
                    case 1:
                        // ByDo
                        var showComp = parseInt(blockString.substring(3, 4));
                        var showDetails = parseInt(blockString.substring(4, 5));
                        var tasksLimit = parseInt(blockString.substring(5, 8));
                        var name = blockString.substring(8);
                        layout.push(<div id={id} onClick={scrollTo} >{ByDo(compTasksList, incompTasksList, showComp, showDetails, tasksLimit, name, blockString)}</div>);
                        break;
                    case 2:
                        // ByPriority
                        var showComp = parseInt(blockString.substring(3, 4));
                        var showDetails = parseInt(blockString.substring(4, 5));
                        var tasksLimit = parseInt(blockString.substring(5, 8));
                        var priorityLimit = parseInt(blockString.substring(8, 9));
                        var name = blockString.substring(9);
                        layout.push(<div id={id} onClick={scrollTo} >{ByPriority(compTasksList, incompTasksList, showComp, showDetails, tasksLimit, name, priorityLimit, blockString)}</div>);
                        break;
                    case 3:
                        // Today
                        var showComp = parseInt(blockString.substring(3, 4));
                        var showDetails = parseInt(blockString.substring(4, 5));
                        var tasksLimit = parseInt(blockString.substring(5, 8));
                        var name = blockString.substring(8);
                        layout.push(<div id={id} onClick={scrollTo} >{Today(compTasksList, incompTasksList, showComp, showDetails, tasksLimit, name, blockString)}</div>);
                        break;
                    case 4:
                        // DueOverdue
                        var showDetails = parseInt(blockString.substring(3, 4));
                        var tasksLimit = parseInt(blockString.substring(4, 7));
                        var name = blockString.substring(7);
                        layout.push(<div id={id} onClick={scrollTo} >{DueOverdue(incompTasksList, showDetails, tasksLimit, name, blockString)}</div>);
                        break;
                    case 5:
                        // MissingDo
                        var showComp = parseInt(blockString.substring(3, 4));
                        var showDetails = parseInt(blockString.substring(4, 5));
                        var tasksLimit = parseInt(blockString.substring(5, 8));
                        var name = blockString.substring(8);
                        layout.push(<div id={id} onClick={scrollTo} >{MissingDo(compTasksList, incompTasksList, showComp, showDetails, tasksLimit, name, blockString)}</div>);
                        break;
                    case 6:
                        // OnlyItem
                        var showComp = parseInt(blockString.substring(3, 4));
                        var showDetails = parseInt(blockString.substring(4, 5));
                        var itemID = blockString.substring(5, 25);
                        var name = blockString.substring(25);
                        layout.push(<div id={id} onClick={scrollTo} >{OnlyItem(compTasksList, incompTasksList, showComp, showDetails, itemID, name, blockString)}</div>);
                    case 7:
                        // OnlyCompletes
                        var showDetails = parseInt(blockString.substring(3, 4));
                        var tasksLimit = parseInt(blockString.substring(4, 7));
                        var name = blockString.substring(7);
                        layout.push(<div id={id} onClick={scrollTo} >{onlyCompletes(compTasksList, showDetails, tasksLimit, name, blockString)}</div>);
                    default:
                        break;
                }
            }

            // Return the blocks
            return (
                <div>
                    <div class="rowWrapperSplit" style={{marginTop: -20 + "px", marginBottom: 10 + "px", paddingRight: 0}}>
                        <div class="rowWrapperClose">
                            <img src={logo} width="100" height="100"/>
                            <div class="popupBlockTitle" style={{marginBottom: -25 + "px"}}>v0.1.2 (Alpha)</div>
                        </div>
                        <div class="rowWrapperClose" style={{paddingRight: 0}}>
                            {task}
                            <div class="defaultButton" style={{display: "flex", flexDirection: "row", alignContent: "center", marginLeft: 20 + "px"}} onClick={ () => nav( "/calendar" ) }> 
                                <img width="40" height="40" src={calendarImage} />
                                <div class="popupBlockTitle" style={{paddingLeft: 15 + "px", marginRight: -10 + "px", paddingTop: 5 + "px"}} >Assign Do Dates</div>
                            </div> 
                        </div>
                    </div>
                    <br></br>
                    <div id="blocksContainer">
                        { layout }
                        
                        { block }
                    </div>
                    
                </div>
            )
        }
    } else {
        const block = ChooseBlock(null);
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
    // Do 2 more times because otherwise it either jitters, or misses
    .then(sleep(2))
        .then(() => element.scrollIntoView())
        .then(() => newPos = element.getBoundingClientRect().top)
        .then(() => window.scrollBy(0, -1*topPos + newPos))
    .then(sleep(2))
        .then(() => element.scrollIntoView())
        .then(() => newPos = element.getBoundingClientRect().top)
        .then(() => window.scrollBy(0, -1*topPos + newPos))
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