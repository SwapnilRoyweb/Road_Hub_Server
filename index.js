const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Road_Hub Started");
})

app.listen(port, () => {
    console.log(`Road_Hub is running at port ${port}`);
})