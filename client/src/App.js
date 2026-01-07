import React, { useState } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import './App.css';

// Env variable for production vs local
const API_ENDPOINT = "https://saas-dashboard-wydh.onrender.com/api/upload";

function App() {
  const [file, setFile] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (!file) return alert("Please select a file first.");
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(API_ENDPOINT, formData);
      setChartData(response.data.data);
      setAiSummary(response.data.insights);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to process file. Check backend status.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="header">
        <h1>SaaS Analytics Engine</h1>
        <p>Enterprise-grade CSV analysis & visualization</p>
      </header>
      
      <div className="upload-zone">
        <label htmlFor="csvInput" className="file-label">
          {file ? `📄 ${file.name}` : "Select CSV Dataset"}
        </label>
        <input 
          id="csvInput" 
          type="file" 
          accept=".csv" 
          onChange={onFileChange} 
        />
        
        <button 
          className="btn-primary" 
          onClick={onUpload} 
          disabled={isLoading || !file}
        >
          {isLoading ? "Processing..." : "Generate Insights"}
        </button>
      </div>

      {aiSummary && (
        <div className="insights-panel">
          <strong>Executive Summary:</strong>
          <p style={{ marginTop: '0.5rem' }}>{aiSummary}</p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="chart-wrapper">
          <h3 style={{ color: '#475569', marginBottom: '1rem' }}>Revenue Trajectory</h3>
          <div style={{ height: 350, width: "100%" }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="Month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="Sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#chartFill)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;