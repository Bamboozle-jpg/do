import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Redirect } from "react-router-dom";

import { firestore, auth } from '../Firebase/Firebase'

import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'


function SignIn() {
  const nav = useNavigate();
  const handleGoogle = () => {
    const provider = new GoogleAuthProvider();
    console.log(provider)
    try {
        signInWithPopup(auth, provider)
    } catch {
        signInWithRedirect(auth, provider)
    }
  }

  const [user] = useAuthState(auth)
  if (user == null) {
    return (
      <div>
        <h1>
          Sign in here!
        </h1>
        <button className="defaultButton" onClick= { handleGoogle }>Sign in with Google</button>
      </div>
    ) 
  } else {
    nav("/")
    return (
      <>
        <div>It worked!</div>
      </>
    )
  }
}

export default SignIn