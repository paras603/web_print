import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowingGrowthChart = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // To store the image URL of the plot
  const [loading, setLoading] = useState(false); // To handle loading state
  const [result, setResult] = useState(null); // Store the result from the backend
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality
  const [filterOption, setFilterOption] = useState(""); // For filtering by data option
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(50); // Rows per page (set limit to 50)

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadResponse = await axios.post('http://localhost:8000/upload/', formData);
        console.log(uploadResponse.data, 'response');
        alert("File uploaded successfully!");
        setLoading(true);

        const plotResponse = await fetch('http://localhost:8000/upload/visualize/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file_name: file.name }),
        });

        const data = await plotResponse.json();
        setResult(data); // Store the result data from the backend
        setLoading(false);
      } catch (error) {
        console.log("Error:", error);
        alert("Failed to upload file or generate plot");
        setLoading(false);
      }
    }
  };

  // Filter the following data based on search query and filter option
  const filteredData = result?.followers_data?.following.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterOption && item.someData < filterOption) { // Replace 'someData' with the actual field you want to filter
      return false;
    }
    return true;
  });

  // Paginate the filtered data (limit to 50 rows per page)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Display paginated data in table
  const renderTableRows = () => {
    return currentData?.map((item, index) => (
      <tr key={index}>
        <td>{item.name}</td>
        <td>{item.followers}</td>
        <td>{item.following}</td>
        {/* Add more data fields here */}
      </tr>
    ));
  };

  // Handle image display based on button clicks
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

  return (
    <>
      <h1 style={styles.container}>Generate your following report</h1>

      <div style={styles.fileUpload}>
        <input type='file' onChange={handleFileChange} accept='.json' />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Generating Plot...' : 'Generate Report'}
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />
      </div>

      {/* Filter Option */}
      <div>
        <input
          type="number"
          placeholder="Filter by data"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          style={styles.searchBar}
        />
      </div>

      {/* Data Table */}
      <div>
        {filteredData && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                {/* Add more columns as per your data structure */}
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        {Array.from({ length: Math.ceil(filteredData?.length / itemsPerPage) }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={styles.paginationButton}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Chart Buttons */}
      <div style={styles.chartButtons}>
        {result && (
          <>
            <button onClick={() => handleChartClick('growth')}>
              Show Growth Chart
            </button>
            <button onClick={() => handleChartClick('positive')}>
              Show Positive Sentiment Chart
            </button>
            <button onClick={() => handleChartClick('negative')}>
              Show Negative Sentiment Chart
            </button>
            <button onClick={() => handleChartClick('neutral')}>
              Show Neutral Sentiment Chart
            </button>
            <button onClick={() => handleChartClick('wordcloud')}>
              Show Word Cloud
            </button>
          </>
        )}
      </div>

      <div>
        {/* Display the Plot Image */}
        {imageUrl && (
          <div>
            <h3>Chart</h3>
            <img src={imageUrl} alt="Chart" style={styles.image} />
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: '20px',
  },
  fileUpload: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '20px',
    border: '1px solid grey',
    margin: '20px',
    borderStyle: 'dashed',
    borderColor: 'grey',
  },
  searchBar: {
    padding: '10px',
    margin: '10px',
    width: '200px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ccc',
  },
  chartButtons: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px',
    margin: '0 5px',
    cursor: 'pointer',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
  },
};

export default FollowingGrowthChart;
