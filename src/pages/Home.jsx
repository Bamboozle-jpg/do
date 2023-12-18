import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AddTask from "../Components/addTask"
import SetUp from "../Components/setupNew"

function Home() {
  const nav = useNavigate();
  const task = AddTask();
  const setup = SetUp();

  return (
    <div>
        <h1>
          Main Page
        </h1>
        {setup}
        {task}
        <button onClick={ () => nav( "/" ) }>Landing Page</button>
    </div>
  )
}

export default Home