import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, Card, CardContent, TextField, CircularProgress, Snackbar, Alert, Fade } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const FollowingGrowthChart = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const columns = [
    { field: 'name', headerName: 'Name', width: 400 },
    { field: 'timestamp', headerName: 'Following Date', width: 200 },
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadResponse = await axios.post('http://localhost:8000/upload/', formData);
        
        setSnackbarSeverity('success')
        setSnackbarMessage('File Uploaded Successfully')
        setSnackbarOpen(true)

        setLoading(true);

        const visualizeResponse = await fetch('http://localhost:8000/upload/visualize/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_name: file.name }),
        });

        const data = await visualizeResponse.json();

        setSnackbarSeverity('success')
        setSnackbarMessage('Report Generated Successfully!')
        setSnackbarOpen(true)

        setResult(data);
        setLoading(false);
      } catch (error) {
        setSnackbarSeverity('error');
        setSnackbarMessage("Failed to upload file or generate report");
        setSnackbarOpen(true);
        
      } finally {
        setLoading(false)
      }
    }
  };

  // Handle image display for charts
  const handleChartClick = (chartType) => {
    if (chartType === 'growth') {
      setImageUrl(`http://localhost:8000/${result.followers_data.follower_growth_chart}`);
    } else if (chartType === 'positive') {
      setImageUrl(`http://localhost:8000/${result.followers_data.positive_wc}`);
    } else if (chartType === 'negative') {
      setImageUrl(`http://localhost:8000/${result.followers_data.negative_wc}`);
    } else if (chartType === 'neutral') {
      setImageUrl(`http://localhost:8000/${result.followers_data.neutral_wc}`);
    } else if (chartType === 'wordcloud') {
      setImageUrl(`http://localhost:8000/${result.followers_data.wc}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const fetchSearchResults = async () => {
    if (searchQuery) {
      try {
        const response = await axios.get(`http://localhost:8000/search?query=${searchQuery}`);
        setSearchResult(response.data);
      } catch (error) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Error fetching search results.');
        setSnackbarOpen(true);
      }
    }
  };

  const filteredData = result?.followers_data?.following.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const rowsWithId = filteredData?.map((item, index) => ({
    id: index,
    name: item.name,
    timestamp: item.timestamp,
  }));

  const firstFollowing = result?.followers_data?.following[0];
  const following = result?.followers_data?.following.slice(0, 5);

  return (
    <div style={styles.container}>
      <Typography variant="h4" gutterBottom>
        Generate Your Following Report
      </Typography>

      <div style={styles.fileUpload}>
        <input type='file' onChange={handleFileChange} accept='.json' />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
          style={styles.uploadButton}
        >
          {loading ? <CircularProgress size={24} color="secondary" /> : 'Generate Report'}
        </Button>
      </div>

      {/* First Following (Unchanged by Search) */}
      {firstFollowing && (
        <Card style={styles.card}>
          <CardContent>
            <Typography variant="h6">First Following:</Typography>
            <Typography>
              Your first following was <strong>{firstFollowing.name}</strong> on <strong> {new Date(firstFollowing.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </strong>
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Followings */}
      {following && (
        <Card style={styles.card}>
          <CardContent>
            <div style={styles.searchContainer}>
              <Typography variant="h6">Profile that you are following:</Typography>
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
                disableSelectionOnClick
              />
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* Chart Buttons */}
      {result && (
        <div style={styles.chartButtons}>
          <Button variant="outlined" onClick={() => handleChartClick('growth')}>Show Growth Chart</Button>
          <Button variant="outlined" onClick={() => handleChartClick('positive')}>Show Positive Sentiment</Button>
          <Button variant="outlined" onClick={() => handleChartClick('negative')}>Show Negative Sentiment</Button>
          <Button variant="outlined" onClick={() => handleChartClick('neutral')}>Show Neutral Sentiment</Button>
          <Button variant="outlined" onClick={() => handleChartClick('wordcloud')}>Show Word Cloud</Button>
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
        anchorOrigin={{vertical: 'top',horizontal:'right'}}
        TransitionComponent={Fade}
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

export default FollowingGrowthChart;
