import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Redirect } from "react-router-dom";

import { firestore, auth } from '../Firebase/Firebase'

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'


function SignIn() {
  const nav = useNavigate();
  const handleGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
  }

  const [user] = useAuthState(auth)
  if (user == null) {
    return (
      <div>
        <h1>
          Sign in here!
        </h1>
        <button className="sign-in" onClick= { handleGoogle }>Sign in with Google</button>
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