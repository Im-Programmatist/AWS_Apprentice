const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.get('/', (req, res)=>{
    res.send({'message':'this is start page'});
});

app.get('/test', (req, res)=>{
    res.send({'message':'this is test 1 page'});
});

app.get('/test2', (req, res)=>{
    res.send({'message':'this is test 2 page'});
});

app.all('*', (req, res)=>{
    //throw new Error(`Requested URL '${req.originalUrl}' not found!`, 404);
    res.send({'message':`Requested URL '${req.originalUrl}' not found!`,'status_code': 404});
})
// app.listen('3030', '0.0.0.0', (err) => {
//     if(err) throw err;
//     console.log(`Lambda severless app listening at- localhost:3030`);
// })

module.exports = app;