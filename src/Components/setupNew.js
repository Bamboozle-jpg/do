import { useEffect } from "react";
import "../App.css"
import { collection, limit, query, onSnapshot, doc, setDoc } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";


const SetUp = () => {
  const [user] = useAuthState(auth)
 
  // For returning, and also 
  const userEmail = user ? user.email : '';
  console.log("here");
  console.log(user)

  // This lets us use async stuff like query without async
  useEffect( () => {

    // Makes sure we actually are using an email
    if (!(userEmail === '')) {

      // Gets all entries (MAX OF 1) from userEmail collection
      const q = query(
        collection( db, userEmail ),
        limit( 1 )
      );

      // How you access query result 
      onSnapshot( q, ( QuerySnapshot ) => {

        // Checks to see if there are no documents in collection (Then adds the setup ones)
        if (QuerySnapshot.docs.length <= 0) {

          // Set up the documents with their ids
          const accountConfig = doc(db, userEmail, 'accountConfig');
          const accountDict = { dailyReset: 0, tags: [], deleteAfter: 7 }

          const webConfig = doc(db, userEmail, 'webConfig');
          const webDict = { layout1: [], layout2: [], layout3: [], darkMode: true, }

          const appConfig = doc(db, userEmail, 'appConfig');
          const appDict = { layout1: [], layout2: [], layout3: [], darkMode: true, }

          const tasks = doc(db, userEmail, 'tasks');
          const tasksDict = {};

          const repeatTasks = doc(db, userEmail, 'repeatTasks');
          const repeatTasksDict = {};

          // Actually add the documents
          setDoc(accountConfig, accountDict);
          setDoc(webConfig, webDict);
          setDoc(appConfig, appDict);
          setDoc(tasks, tasksDict);
          setDoc(repeatTasks, repeatTasksDict);
        }
      });
    }
  });
};

export default SetUp
