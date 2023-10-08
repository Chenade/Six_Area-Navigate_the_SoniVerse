const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const MLKMeans = require('ml-kmeans');
const kmeansController = require('./kmeansController'); // Import the kmeansController module
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cube', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cube.html'));
});


app.get('/sound', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sound.html'));
});


const upload = multer({ dest: 'uploads/' });

app.post('/kmeans', upload.single('file'), (req, res) => {
    let fileContent;
    if (req.file) {
        const fs = require('fs');
        const content = fs.readFileSync(req.file.path, 'utf8');
        fileContent = JSON.parse(content);
    } else {
        fileContent = req.body.fileContent;
    }
    const dataset = fileContent.data;
    const k = fileContent.k;
    const centroids = kmeansController.performKMeansClustering(dataset, k);
    res.json({ centroids });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
