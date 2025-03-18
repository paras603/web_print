import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import FollowingAnalysis from './pages/FollowingAnalysis';
import ChatAnalysis from './pages/ChatAnalysis';

function App() {
  return (
      <div style={{display: 'flex'}}>
        <Sidebar/>
        <div style={{ flex: 1, padding: '20px'}}>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/following-analysis' element={<FollowingAnalysis/>} />
            <Route path='/chat-analysis' element={<ChatAnalysis/>} />
          </Routes>
        </div>
      </div>
  );
}

export default App;
