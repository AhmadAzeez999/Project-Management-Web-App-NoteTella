import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import Board from './pages/Board/Board';
import Timeline from "./pages/Timeline";

function App()
{
    return (
        <Router>
            <Sidebar/>
            <div className='main-content'>
                <Routes>
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/board" element={<Board />} />
                    <Route path="/timeline" element={<Timeline/>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;