const express = require('express');
require('dotenv').config({path:__dirname+'/.env'});
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const s3 = new AWS.S3();

const storage = multer.memoryStorage();
const upload = multer({ storage });

AWS.config.update({
    region: process.env.AWS_REGION
})

app.get('/', (req, res) => {
    console.log('env params', process.env, process.env.S3_BUCKET_NAME);
    res.send('Welcome to lambda-S3-APi demo');
});

app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    const fileName = `${uuidv4()}_${file.originalname}`;
    const params = {
        Bucket: process.env.S3_BUCKET_NAME || 'my-lmb-bucket',
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read'
    };
    console.log('upload - ',req.file , 'fileName', fileName, ' params', params);
    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error uploading image.' });
        } else {
            console.log('Image uploaded successfully:', data);
            res.json({ imageUrl: data.Location });
        }
    });
});
  
app.get('/images/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const params = {
        Bucket: process.env.S3_BUCKET_NAME || 'my-lmb-bucket',
        Key: fileName
    };
    console.log('images/:fileName',req.params.fileName, 'params', params, process.env.S3_BUCKET_NAME);
    s3.getObject(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error fetching image.' });
        } else {
            res.setHeader('Content-Type', data.ContentType);
            res.send(data.Body);
        }
    });
});

// app.listen(8080);
module.exports = app; 