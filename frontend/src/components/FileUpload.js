import React, {useState} from "react";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try{
                const response = await axios.post('http://localhost:8000/upload/', formData);
                console.log(response.data);
                alert("File uploaded successfully!");
            } catch (error) {
                console.log("Error uploading file:", error);
                alert("Failed to upload file");
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept=".json" />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;