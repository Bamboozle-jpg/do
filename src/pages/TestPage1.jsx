import React from 'react'
import { useNavigate } from 'react-router-dom'

function TestPage1() {
  const nav = useNavigate();

  return (
    <div>
        <h1>
          TESTPAGE1
          {/* BEGIN YOUR TESTPAGE1 EDITING HERE */}
        </h1>

        <button onClick={ () => nav( "/" ) }>MainPage</button>
        <button onClick={ () => nav( "/2" ) }>Page 2</button>
        <button onClick={ () => nav( "/4" ) }>Test</button>
    </div>
  )
}

export default TestPage1