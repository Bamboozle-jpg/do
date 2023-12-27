import "../App.css"
import { collection, limit, query, where, orderBy, doc, updateDoc, Timestamp } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import "./allBlock.css"

// A block of all the items
const AllByDueBlock = (user) => {
    // Setup email, and where it should find the items
    const userEmail = user ? user.email : 'kevin@bachelorclan.com';
    const tasksDocRef = doc(db, userEmail, 'tasks');
    const tasksCollectionRef = collection(tasksDocRef,  'tasksCollection');

    // Get the uncompleted items as a query
    const q = query( 
        tasksCollectionRef, 
        where( "Completed", "==", true), 
        orderBy("Completed" ),
        orderBy("CompletedDate", "desc")
    );

    // Get the completed items query
    const qComp = query(
        tasksCollectionRef,
        limit( 100 ),
        where( "Completed", "==", false),
        orderBy( "Completed" ),
        orderBy( "Due", "asc" )
    );
    
    // Convert querys to snapshots
    const [tasks, loading, error] = useCollection(q)
    const [compTasks, loadingC, errorComp] = useCollection(qComp)
    
    // Once the snapshot has returned
    if (!loading && !loadingC) {
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
        var uncompTasksList = addKeys(tasks); 
        var compTasksList = addKeys(compTasks); 
        
        // Combine the lists into 1
        var tasksList = compTasksList.concat(uncompTasksList)

        // Print it to the screen and make it look pretty :)
        return (buildDiv(tasksList));
    }
}

// A block of only incomplete items
const UncompleteByDueBlock = (user) => {
    // Setup email, and where it should find the items
    const userEmail = user ? user.email : 'kevin@bachelorclan.com';
    const tasksDocRef = doc(db, userEmail, 'tasks');
    const tasksCollectionRef = collection(tasksDocRef,  'tasksCollection');

    // Get the uncompleted items as a query
    const q = query(
        tasksCollectionRef,
        limit( 100 ),
        where( "Completed", "==", false),
        orderBy( "Completed" ),
        orderBy( "Due", "asc" )
    );
    
    // Convert querys to snapshots
    const [tasks, loading, error] = useCollection(q)
    
    // Once the snapshot has returned
    if (!loading) {
        // The first time you do this for a new query
        // you need to follow the link in the error message
        // This only needs to be done once and then it works for all users
        if (error) {
            console.log("ERROR : ", error.message);
        }
        // Add the firestore id to the objects as the firestoreKey field
        var tasksList = addKeys(tasks);

        // Print it to the screen and make it look pretty :)
        return (buildDiv(tasksList));
    }
}

// Actually puts things to the screen
function TaskPretty(props) {
    // Grabs them as variables out of props
    const text = props.name;
    const desc = props.description;
    const Key = props.firestoreKey;
    const completed = props.completed
    const author = props.createdBy;

    // The line with toggleComplete, creates a check box that watches if complete is true or false, and also can set it to be so
    return (<outer completed={completed} Key={Key} >
        <div class="title">
            <label class="switch">
                <label class={completed ? "customCheckboxOn" : "customCheckboxOff"}>
                <input type="checkbox" checked={completed} onClick={ () => toggleComplete(Key, author, completed) } class="hiddenCheckbox"  />
                </label>
            </label>
            <h2 class={ completed ? "completed" : "uncomplete"} >{text}</h2>
        </div>
        
        <div class={ completed ? "completed" : "uncomplete"} >{desc}</div>
        <div class={ completed ? "completed" : "uncomplete"} >{Key}</div>
        <div class={ completed ? "completed" : "uncomplete"} >Completed : {completed ? "true" : "false"}</div>
    </outer>)
}

// Set a task to complete
function toggleComplete(key, author, completed) {
    // Set up document you're looking at
    console.log(key)
    const outerDoc = doc(db, author, 'tasks');
    const outerCollection = collection(outerDoc, 'tasksCollection');
    const docToUpdate = doc(outerCollection, key);

    // update complete field
    if (completed) {
        updateDoc(docToUpdate, {
            Completed: false,
            CompletedDate: null
        });
    } else {
        const today = new Date();
        updateDoc(docToUpdate, {
            Completed: true,
            CompletedDate: Timestamp.fromDate(today)
        });
    }
}

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

// Builds object for TaskPretty to access
function buildDiv(tasksList) {
    return (
        <div class="glow-holder">
            <article data-glow>
                { tasksList && tasksList.map( tsk => <TaskPretty 
                    firestoreKey={tsk.Key} 
                    name={tsk.Name}  
                    description={tsk.Description}
                    due={tsk.Due}
                    do={tsk.Do}
                    duration={tsk.Duration}
                    priority={tsk.Priority}
                    fromRepeat={tsk.Priority}
                    completed={tsk.Completed}
                    children={tsk.Children}
                    tag={tsk.Tag}
                    createdBy={tsk.CreatedBy}
                /> ) }
            </article>
        </div>
    )
}

export { 
    AllByDueBlock,
    UncompleteByDueBlock
}