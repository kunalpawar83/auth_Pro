const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { connectDB } =  require('./utils/db.js');
const PORT = process.env.PORT;
const userRoute = require('./routes/userRoute.js')

const app = express()

app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user',userRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  });