// server/server.js
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Ensure uploads directory exists (Double check fix)
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// UPLOAD ENDPOINT
app.post('/api/upload', upload.single('file'), (req, res) => {
    const results = [];
    
    // Check if file was actually uploaded
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Read the uploaded CSV
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            // Delete the temp file
            fs.unlinkSync(req.file.path);

            // SIMULATED AI RESPONSE (Free Mode)
            const mockAiResponse = "Based on the dataset, Q3 revenue increased by 24% compared to Q2. Recommendation: Optimize inventory for Q4 high-traffic periods.";

            // Send back data + insights
            res.json({ 
                data: results, 
                insights: mockAiResponse 
            });
        });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));