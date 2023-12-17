import React from 'react'
import { useNavigate } from 'react-router-dom'
import AddTask from "../Components/addTask"

function Home() {
  const nav = useNavigate();
  const task = AddTask();

  return (
    <div>
        <h1>
          Main Page
        </h1>
        {task}
        <button onClick={ () => nav( "/Landing" ) }>Landing Page</button>
    </div>
    
  )
}

export default Home