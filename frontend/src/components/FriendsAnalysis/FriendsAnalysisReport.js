import { Alert, Button, Card, CardContent, CircularProgress, Snackbar, TextField, Typography, Paper } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const FriendsAnalysisReport = () => {
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [searchQuery, setSearchQuery] = useState('')
    const [imageUrl, setImageUrl] = useState(null)


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

    const firstFriend = result?.friends_data?.friends[0]
    const friends = result?.friends_data?.friends

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredData = result?.friends_data?.friends.filter(item => {
        if(searchQuery && !item.name.toLowerCase().includes(searchQuery.toLocaleLowerCase())){
            return false;
        }
        return true;
    })

    const rowsWithId = filteredData?.map((item, index) => ({
        id: index,
        name: item.name,
        timestamp: item.timestamp
    }))

    const columns = [
        { field: 'name', headerName: 'Name', width: 400 },
        { field: 'timestamp', headerName: 'Friends Since', width: 200 },
      ];

    const handleChartClick = (chartType) => {
        if (chartType == 'growth'){
            setImageUrl(`http://localhost:8000/${result.friends_data.friends_growth_chart}`);
        }
    }

    return (
        <div style={styles.container}>
          <Typography variant="h4" gutterBottom>
            Generate Your Friends Report
          </Typography>

          <div style={styles.fileUpload}>
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
        </div>

            {/* first friend */}
            {firstFriend && (
                <Card style={styles.card}>
                    <CardContent>
                        <Typography variant="h6">First Friend</Typography>
                        <Typography>
                            Your first friend was <strong>{firstFriend.name}</strong> on <strong>
                                {new Date(firstFriend.timestamp).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year:'numeric'})}
                            </strong>
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* list of friends */}
            {friends && (
                <Card style={styles.card}>
                    <CardContent>
                        <div style={styles.searchContainer}>
                            <Typography variant="h6">Friends:</Typography>
                            {result && (
                                <div>
                                    <TextField
                                        label="Search"
                                        variant="outlined"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        style={styles.searchField}
                                        disabled={loading}
                                    />
                                </div>
                            )}
                        </div>
                        <Paper style={styles.paper}>
                            <DataGrid
                                rows={rowsWithId}
                                columns={columns}
                                pageSize={5}
                                disableRowSelectionOnClick
                            />
                        </Paper>
                    </CardContent>
                </Card>
            )}

            {/* chart Button */}
            {result && (
                <div style={styles.chartButtons}>
                    <Button variant="outlined" onClick={() => handleChartClick('growth')}>Show Growth Chart</Button>
                </div>
            )}

            {/* Display the Image */}
            {imageUrl && (
            <div style={styles.chartImage}>
                <Typography variant="h6">Chart:</Typography>
                <img src={imageUrl} alt="Chart" style={styles.image} />
            </div>
            )}


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
      );
};

const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f7f7f7',
      padding: '40px',
      minHeight: '100vh',
    },
    fileUpload: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'baseline',
      margin: '20px 20px 40px',
    },
    uploadButton: {
      marginTop: '10px',
      width: '200px',
    },
    card: {
      marginBottom: '20px',
      width: '80%',
      padding: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
    },
    paper: {
      height: 300,
      width: '100%',
      marginTop: '10px',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    searchContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      justifyContent: 'space-between',
      alignItems: "center",
      width: '100%',
    },
    searchField: {
      width: '300px',
    },
    chartButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '20px',
    },
    chartImage: {
      marginTop: '20px',
      textAlign: 'center',
    },
    image: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px',
      marginTop: '10px',
    },
  };

export default FriendsAnalysisReport;