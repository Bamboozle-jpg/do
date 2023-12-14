import './App.css';

import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';

import TestPage1 from './pages/TestPage1';

import { AuthContextProvider } from './Firebase/Context';


function App() {
    return (
        <AuthContextProvider>  
          <div>
            <Routes>
              <Route path="/1" element={ <TestPage1/>} />
            </Routes>
          </div>
        </AuthContextProvider>
    );
}

export default App;
