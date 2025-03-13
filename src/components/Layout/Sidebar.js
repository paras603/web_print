import React from 'react';
import { Link } from "react-router-dom";

function Sidebar(){
    return (
        <div style={{
            width: '250px',
            padding: '20px',
            backgroundColor: '#333',
            color: '#fff',
            height: '100vh' 
        }}>
            <h2>Web-Print</h2>
            <nav>
                <ul style={{
                    listStyle: 'none',
                    padding: 0
                }}>
                    <li>
                        <Link to="/" style={{color: '#fff', textDecoration: 'none'}} >Home</Link>
                    </li>
                    <li>
                        <Link to="/following-analysis" style={{color: '#fff', textDecoration: 'none'}}>Following Analysis</Link>
                    </li>
                    <li>
                        <Link to="/chat-analysis" style={{ color: '#fff', textDecoration: 'none' }}>Chat Analysis</Link>
                    </li>

                </ul>
            </nav>
        </div>
    )
}

export default Sidebar;