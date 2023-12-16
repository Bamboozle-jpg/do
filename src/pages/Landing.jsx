import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Redirect } from "react-router-dom";

import { db } from '../Firebase/Firebase'
import { auth } from '../Firebase/Firebase'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function Landing() {
  const nav = useNavigate();
  const [user] = useAuthState(auth)
  if (user == null) {
    // return (
      

    //   <div>
    //     <h1>
    //       TESTPAGE1
    //     </h1>
    //     redirect("/")

    //     <button onClick={ () => nav( "/" ) }>Main Page</button>
    //   </div>
    // ) 
    // <div>uh</div>
    nav("/signIn");
    return <div>uh</div>
  } else {
    nav("/home");
    return <div>huh?</div>
  }
}

export default Landing