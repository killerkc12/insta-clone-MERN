const express = require('express')
const cors = require("cors");
const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_URL}`);
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("connected MongoDB Yupppp!")
})

require('./models/user')
require('./models/post')

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

// if(process.env.NODE_ENV=="production"){
//     app.use(express.static('client/build'))
//     const path = require('path')
//     app.get("*",(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//     })
// }

// * Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "client", "build")));
  app.get("/*", function (req, res) {
    // this -->
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


app.listen(PORT,()=>{
    console.log("server running on ",PORT)
})