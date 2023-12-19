import React, { useEffect, useState } from "react";
import "../App.css"
// import 'firebase/firestore';
import { collection, getCountFromServer, limit, query, onSnapshot } from "firebase/firestore"; 
import { db, auth } from "../Firebase/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";


const SetUp = () => {
  const [user] = useAuthState(auth)
 
  // For returning, and also 
  const userEmail = user ? user.email : '';

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

        // Checks to see if there are no documents in collection
        if (QuerySnapshot.docs.length <= 0) {
          console.log("None found! Add config docs and holder docs for items here.")
        }
      });
    }
  });
};

export default SetUp
