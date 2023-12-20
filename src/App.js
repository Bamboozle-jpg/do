import './App.css';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { BrowserRouter } from "react-router-dom";

import { AuthContextProvider } from './Firebase/Context';
import MainPage from './pages/Home';
import SignIn from './pages/SignIn';
import Landing from './pages/Landing'
import Layout1 from './pages/Layout1'



function App() {
    return (
        // <AuthContextProvider>  
        //   <div>

        //     <Routes>
        //       <Route path="/1" element={ <TestPage1/>} />
        //     </Routes>
        //   </div>
        // </AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={ <MainPage/> } />
            <Route path="/" element={ <Landing/> } />
            <Route path="/signIn" element={ <SignIn/> } />
            <Route path='/layout1' element={ <Layout1/> } />
          </Routes>
        </BrowserRouter>
        // <div>hi!</div>
    );
}

export default App;
