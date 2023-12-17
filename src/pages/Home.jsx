import React from 'react'
import { useNavigate } from 'react-router-dom'
import Todo from '../Components/Todo';

function Home() {
  const nav = useNavigate();

  return (
    <div>
        <h1>
          Main Page
        </h1>
        Todo
        <br></br>
        <button onClick={ () => nav( "/" ) }>Landing Page</button>
    </div>
  )
}

export default Home