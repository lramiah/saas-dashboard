// client/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://saas-dashboard-wydh.onrender.com"; 

  const handleUpload = async () => {
    if (!file) {
        alert("Please select a file first!");
        return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(API_URL, formData);
      setData(res.data.data);
      setInsights(res.data.insights);
    } catch (error) {
      console.error(error);
      alert("Error uploading. The Backend might be asleep. Wait 1 minute and try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1>📊 SaaS Analytics Dashboard</h1>
      
      <div style={{ background: "#f4f4f4", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Step 1: Upload Data</h3>
        <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
        <button 
          onClick={handleUpload} 
          disabled={loading} 
          style={{ padding: "10px 20px", marginLeft: "10px", cursor: "pointer", background: "black", color: "white", border: "none", borderRadius: "5px" }}
        >
          {loading ? "Processing..." : "Generate Dashboard"}
        </button>
      </div>

      {insights && (
        <div style={{ background: "#e3f2fd", padding: "15px", borderRadius: "8px", marginBottom: "20px", borderLeft: "5px solid #2196f3" }}>
          <strong>🤖 AI Executive Summary:</strong>
          <p>{insights}</p>
        </div>
      )}

      {data.length > 0 && (
        <div style={{ height: 300, width: "100%", marginTop: "30px" }}>
          <h3>Step 2: Visualization</h3>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Month" /> 
              <YAxis />
              <Tooltip />
              <Bar dataKey="Sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;