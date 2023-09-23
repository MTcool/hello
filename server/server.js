const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors({ origin: true }));
app.use(express.static('build'));

app.get('/data', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Credentials", "true");
    // res.header("Access-Control-Allow-Headers", "token");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(hello());
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
})

function hello() {
    return 'Hello, World!';
}