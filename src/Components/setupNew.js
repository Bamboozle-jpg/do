import React, { useEffect, useState } from "react";
import "../App.css"
// import 'firebase/firestore';
import { collection, getCountFromServer, limit, query, onSnapshot } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";


const SetUp = () => {
  const [user] = useAuthState(auth)
  const [task, setTodoTask] = useState('');
  //new to do item to firebase
  const userEmail = user ? user.email : '';
  const err = user ? 0 : 1;

  useEffect( () => {
    if (!(userEmail === '')) {
      const q = query(
        collection( db, userEmail ),
        limit( 1 )
      );

      // what this???
      onSnapshot( q, ( QuerySnapshot ) => {
        if (QuerySnapshot.docs.length <= 0) {
          console.log("None found! Add config docs and holder docs for items here.")
        }
      });
    }
  });

  return err;
};

export default SetUp
