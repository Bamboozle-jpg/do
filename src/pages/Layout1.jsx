import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AllBlock from "../Components/allBlock"
import { getAuth } from "firebase/auth";
import 'firebase/firestore';
import { useAsync } from "react-async"
import { useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from "../Firebase/Firebase";

function Layout1() {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user)
    const nav = useNavigate();
    const allBlock = AllBlock(user);
    const bruh = 0;
    return (
        <div>
            {allBlock}
            <button onClick={ () => nav( "/" ) }>Landing Page</button>
        </div>
    )
}

export default Layout1