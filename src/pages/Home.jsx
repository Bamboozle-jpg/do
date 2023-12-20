import React from 'react'
import { useNavigate } from 'react-router-dom'
import AddTask from "../Components/addTask"
import SetUp from "../Components/setupNew"

function Home() {
  const nav = useNavigate();
  const task = AddTask();

  // Sets up new user if necessary
  SetUp();

  return (
    <div>
      <h1>
        Main Page
      </h1>
      {task}
      <button onClick={ () => nav( "/" ) }>Landing Page</button>
      <button onClick={ () => nav( "/layout1" ) }>Layout1</button>
    </div>
  )
}

export default Home