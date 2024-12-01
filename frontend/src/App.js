import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import Board from './pages/Board/Board';
import Timeline from "./pages/Timeline/Timeline";
import { GlobalStateProvider } from './contexts/GlobalStateProvider';
import Header from './components/Header/Header';
import { SocketProvider } from './contexts/SocketProvider';

function App()
{
    return (
        <GlobalStateProvider>
            <SocketProvider>
                <Router>
                    <Header/>
                    <Sidebar/>
                    <div className='main-content'>
                        <Routes>
                            <Route path="/" element={<Dashboard/>} />
                            <Route path="/board" element={<Board />} />
                            <Route path="/timeline" element={<Timeline/>} />
                        </Routes>
                    </div>
                </Router>
            </SocketProvider>
        </GlobalStateProvider>
    );
};

export default App;