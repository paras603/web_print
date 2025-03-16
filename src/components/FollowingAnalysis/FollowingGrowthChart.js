import React, { useState } from 'react';
import axios from 'axios';

const FollowingGrowthChart = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // To store the image URL of the plot
  const [loading, setLoading] = useState(false); // To handle loading state
  var fileName = ""

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleUpload = async () => {
    
    if(file) {
      const formData = new FormData();
      formData.append('file', file);
      // Log all key-value pairs in FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
        if (value instanceof File) {
          console.log("File Name:", value.name);
          fileName = value.name
          console.log("File Size:", value.size);
          console.log("File Type:", value.type);
        }
      }

      try{
        const response = await axios.post('http://localhost:8000/upload/', formData);
        console.log(response.data);
        alert("File uploaded successfully!");
        setLoading(true);

        try {
        // Send POST request to generate the plot
          const response = await fetch('http://localhost:8000/upload/visualize/', {
            method: 'POST', // Assume the backend will handle file retrieval
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ file_name: fileName }), // Send the file name
          });

          const result = await response.json();
          console.log(result)

          // Set the image URL received from the backend
          if (result.plot_image) {
            setImageUrl(`http://localhost:8000/media/${result.plot_image}`); // Full image URL
          } else {
            alert('Failed to generate plot');
          }
        
        } catch (error) {
          console.error('Error generating plot:', error);
          alert('Error generating plot');
        } finally {
          setLoading(false);
        }



      } catch (error) {
        console.log("Error uploading file:", error);
        alert("Failed to upload file");
      }
    }
  }

  // Handle visualization button click
  // const handleVisualization = async () => {
  //   setLoading(true);
  //   try {
  //     // Send POST request to generate the plot
  //     const response = await fetch('http://localhost:8000/upload/visualize/', {
  //       method: 'POST', // Assume the backend will handle file retrieval
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     const result = await response.json();
  //     console.log(result)

  //     // Set the image URL received from the backend
  //     if (result.plot_image) {
  //       setImageUrl(`http://localhost:8000/media/${result.plot_image}`); // Full image URL
  //     } else {
  //       alert('Failed to generate plot');
  //     }
  //   } catch (error) {
  //     console.error('Error generating plot:', error);
  //     alert('Error generating plot');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // return (
  //   <div>
  //     {/* Visualization Button */}
  //     <button onClick={handleVisualization} disabled={loading} style={styles.button}>
  //       {loading ? 'Generating Plot...' : 'Visualize Data'}
  //     </button>

  //     {/* Display the Plot Image */}
  //     {imageUrl && (
  //       <div>
  //         <h3>Cumulative Followers Growth</h3>
  //         <img src={imageUrl} alt="Cumulative Followers Growth" style={styles.image} />
  //       </div>
  //     )}
  //   </div>
  // );

  return(
    <>
      <h1 style={styles.container}>Generate your following report</h1>
      <div style={styles.fileUpload}>
        <input type='file' onChange={handleFileChange} accept='.json'/>
        <button onClick={handleUpload} disabled={loading} >{loading ? 'Generating Plot...' : 'Generate Report'}</button>
      </div>
      <div>
       {/* Display the Plot Image */}
       {imageUrl && (
         <div>
           <h3>Cumulative Followers Growth</h3>
           <img src={imageUrl} alt="Cumulative Followers Growth" style={styles.image} />
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
  }
}

export default FollowingGrowthChart;
