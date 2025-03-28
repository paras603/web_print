import React from "react";
import FollowingGrowthChart from "../components/FollowingAnalysis/FollowingGrowthChart";

function Home() {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}> Welcome to Web-Print</h1>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        minHeight: '100vh',
        padding: '20px',
    },
    heading: {
        color: '#2c3e50',
        fontSize: '2.5rem',
        marginBottom: '30px',
    },
};

export default Home;
