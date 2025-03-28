import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaChartLine, FaCommentDots, FaUserFriends } from 'react-icons/fa'; // Import icons from react-icons

function Sidebar() {
    const location = useLocation(); // Get the current route to highlight the active link

    return (
        <div style={styles.nav}>
            <h2 style={styles.title}>Web-Print</h2>
            <nav>
                <ul style={styles.links}>
                    <li>
                        <Link to="/" style={{ ...styles.link, ...(location.pathname === '/' ? styles.activeLink : {}) }}>
                            <FaHome style={styles.icon} /> Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/following-analysis" style={{ ...styles.link, ...(location.pathname === '/following-analysis' ? styles.activeLink : {}) }}>
                            <FaChartLine style={styles.icon} /> Following Analysis
                        </Link>
                    </li>
                    <li>
                        <Link to="/friends-analysis" style={{ ...styles.link, ...(location.pathname === '/friends-analysis' ? styles.activeLink : {}) }}>
                            <FaUserFriends style={styles.icon}/> Friends Analysis
                        </Link>
                    </li>
                    <li>
                        <Link to="/chat-analysis" style={{ ...styles.link, ...(location.pathname === '/chat-analysis' ? styles.activeLink : {}) }}>
                            <FaCommentDots style={styles.icon} /> Chat Analysis
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

const styles = {
    nav: {
        width: '250px',
        padding: '20px',
        backgroundColor: '#333',
        color: '#fff',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
        // minHeight: '100vh',
    },
    title: {
        margin: "0 0 20px 0",
        fontSize: '24px',
        fontWeight: '600',
        letterSpacing: '1px',
    },
    links: {
        listStyle: 'none',
        padding: 0,
    },
    link: {
        color: "#fff",
        textDecoration: "none",
        display: 'flex',
        alignItems: 'center', // Align icon and text horizontally
        padding: '10px 15px',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
        fontSize: '16px',
        fontWeight: '500',
    },
    activeLink: {
        backgroundColor: '#444',
    },
    icon: {
        marginRight: '10px', // Space between icon and text
        fontSize: '18px', // Icon size
    }
};

export default Sidebar;
