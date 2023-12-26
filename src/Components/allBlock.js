import "../App.css"
import { collection, limit, query, where, orderBy, doc, updateDoc } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import "./allBlock.css"

// A block of all the items
const AllBlock = (user) => {
    // Setup email, and where it should find the items
    const userEmail = user ? user.email : 'kevin@bachelorclan.com';
    const tasksDocRef = doc(db, userEmail, 'tasks');
    const tasksCollectionRef = collection(tasksDocRef,  'tasksCollection');

    // Get the items as a query
    const q = query(
        tasksCollectionRef,
        limit( 100 )
    );
    
    // Convert query to snapshot
    const [tasks, loading] = useCollection(q)
    
    // Once the snapshot has returned
    if (!loading) {

        // Add the firestore id to the object as the firestoreKey field
        var tasksList = addKeys(tasks); 
        console.log(tasksList)

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
    updateDoc(docToUpdate, {
        Completed: !completed
    });
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

export default AllBlock