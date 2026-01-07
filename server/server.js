const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();


const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());


app.post('/api/upload', upload.single('file'), (req, res) => {
    const results = [];
    

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            
            fs.unlinkSync(req.file.path);

            const mockAiResponse = "Based on the dataset, Q3 revenue increased by 24% compared to Q2. Recommendation: Optimize inventory for Q4 high-traffic periods.";

            res.json({ 
                data: results, 
                insights: mockAiResponse 
            });
        });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));