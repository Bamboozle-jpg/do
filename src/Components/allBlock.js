import "../App.css"
import { collection, limit, query, where, orderBy, doc } from "firebase/firestore"; 
import { db } from "../Firebase/Firebase";
import { useCollection } from "react-firebase-hooks/firestore";

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

        // Print it to the screen and make it look pretty :)
        return (buildDiv(tasksList));
    }
}

// Actually puts things to the screen
function TaskPretty(props) {
    const text = props.name;
    const desc = props.description;
    const key = props.firestoreKey;
    const completed = props.completed
    return (<outer completed={completed} >
        <h1>{text}</h1>
        <div>{desc}</div>
        <div>{key}</div>
    </outer>)
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
        <div>
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
            /> ) }
        </div>
    )
}

export default AllBlock