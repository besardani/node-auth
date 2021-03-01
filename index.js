const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require('body-parser')
require("dotenv").config()

const auth = require('./middleware/auth')

// set up db
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err
    console.log("MongoDB connection established")
  }
)

// set up express
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// set up routes
app.use("/users", require("./routes/users"))
app.use("/movies", auth, require("./routes/movie"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`))