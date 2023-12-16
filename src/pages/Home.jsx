import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const nav = useNavigate();

  return (
    <div>
        <h1>
          Main Page
        </h1>

        <button onClick={ () => nav( "/" ) }>Landing Page</button>
    </div>
  )
}

export default Home