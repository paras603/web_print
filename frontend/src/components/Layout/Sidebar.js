import React from 'react';
import { Link } from "react-router-dom";

function Sidebar(){
    return (
        <div style={styles.nav}>
            <h2 style={styles.title}>Web-Print</h2>
            <nav>
                <ul style={styles.links}>
                    <li>
                        <Link to="/" style={styles.link} >Home</Link>
                    </li>
                    <li>
                        <Link to="/following-analysis" style={styles.link}>Following Analysis</Link>
                    </li>
                    <li>
                        <Link to="/chat-analysis" style={styles.link}>Chat Analysis</Link>
                    </li>

                </ul>
            </nav>
        </div>
    )
}

const styles = {
    nav: {
        width: '250px',
        padding: '20px',
        backgroundColor: '#333',
        color: '#fff',
        height: 'auto' 
    },
    title: {
        margin: "0"
    },
    links: {
        listStyle: 'none',
        padding: 0
    },
    link: {
        color: "#fff",
        textDecoration: "none",
    }
}

export default Sidebar;


