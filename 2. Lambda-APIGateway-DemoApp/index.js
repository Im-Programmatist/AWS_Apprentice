const express = require('express');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/*Start normal routes*/
app.get('/', (req, res)=>{
    res.send({'message':'Welcome to serverless application'});
});

app.get('/1', (req, res)=>{
    res.send({'message':'this is 1 page'});
});

app.get('/test2', (req, res)=>{
    res.send({'message':'this is test 2 page'});
});

/*End normal routes*/

/*Start route with router middleware*/

router.get('/route1', (req, res) => {
    res.json({ message: 'Hello, this is route 1 middleware!' });
});

router.get('/route2', (req, res) => {
    res.json({ message: 'Hello, is is route 2 middleware!' });
});

app.use('/routers', router); // Update the base path if needed


/*End route with router middleware*/

app.all('*', (req, res)=>{
    //throw new Error(`Requested URL '${req.originalUrl}' not found!`, 404);
    res.send({'message':`Requested URL '${req.originalUrl}' not found!`,'status_code': 404});
})
// app.listen('3030', '0.0.0.0', (err) => {
//     if(err) throw err;
//     console.log(`Lambda severless app listening at- localhost:3030`);
// })

module.exports = app;