import { Alert, Button, CircularProgress, Snackbar, Typography } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";

const FriendsAnalysisReport = () => {
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUpload = async () => {

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try{
                setLoading(true);

                await axios.post('http://localhost:8000/upload/', formData);

                setSnackbarMessage('suceess')
                setSnackbarMessage('File Uploaded Successfully')
                setSnackbarOpen(true)

                const visualizeFriendsResponse = await fetch('http://localhost:8000/friends/visualize/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({file_name: file.name}),
                });

                const data = await visualizeFriendsResponse.json();
                setResult(data)
                console.log(data)

                setSnackbarSeverity('success')
                setSnackbarMessage('Report Generated Successfully')
                setSnackbarOpen(true)

            }catch (error) {
                setSnackbarSeverity('error');
                setSnackbarMessage("failed to upload file of generate report")
                setSnackbarOpen(true)
            }finally{
                setLoading(false)
            }
            
        }else{
            setSnackbarSeverity('error');
            setSnackbarMessage('file upload error')
            setSnackbarOpen(true);
        }

    }

    return (
        <div style={styles.container}>
          <Typography variant="h4" gutterBottom>
            Generate Your Friends Report
          </Typography>

          <div>
            <input type="file" onChange={handleFileChange} accept=".json"/>
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
                style={styles.uploadButton}
            >
                {loading ? <CircularProgress size={24} color="secondary"/> : 'Generate Report'}
            </Button>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

          </div>
        </div>
      );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        padding: '40px',
        minHight: '100vh',
    },
    uploadButton: {
        marginTop: '10px',
        width: '200px',
    },
    
}

export default FriendsAnalysisReport;