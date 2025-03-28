import React from "react";

function Home() {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Welcome to Web-Print</h1>
            <p style={styles.description}>
                Web-Print is an insightful web application that helps you analyze your Facebook profile using data exported in .json format. Explore the following features:
            </p>
            <div style={styles.featureContainer}>
                <div style={styles.feature}>
                    <h2 style={styles.featureTitle}>Following Analysis</h2>
                    <p style={styles.featureDescription}>
                        View all the profiles you follow along with the dates when you started following them.
                    </p>
                </div>
                <div style={styles.feature}>
                    <h2 style={styles.featureTitle}>Friend Analysis</h2>
                    <p style={styles.featureDescription}>
                        See your friends list, track the "Friend Since" dates, and visualize your friend growth over time with a dynamic graph.
                    </p>
                </div>
            </div>
            <p style={styles.footer}>
                Get started by uploading your Facebook .json file and explore the insights of your social network.
            </p>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: "'Roboto', sans-serif",
        color: '#2c3e50',
    },
    heading: {
        fontSize: '3rem',
        marginBottom: '20px',
        color: '#2c3e50',
        textAlign: 'center',
        fontWeight: '600',
        letterSpacing: '1px',
    },
    description: {
        color: '#34495e',
        fontSize: '1.1rem',
        textAlign: 'center',
        maxWidth: '750px',
        marginBottom: '30px',
    },
    featureContainer: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px',
    },
    feature: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        margin: '10px',
        width: '280px',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
    },
    featureTitle: {
        fontSize: '1.5rem',
        color: '#2980b9',
        fontWeight: '500',
        marginBottom: '10px',
    },
    featureDescription: {
        fontSize: '1rem',
        color: '#7f8c8d',
    },
    footer: {
        fontSize: '1.1rem',
        marginTop: '30px',
        textAlign: 'center',
        maxWidth: '750px',
        color: '#7f8c8d',
    },
};


export default Home;
