const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080

app.listen(PORT,() => {
  console.log(`listening on *${PORT}`)
});


app.set("view engine", "ejs")

app.use(express.static(__dirname + "/public"));

app.get("/",(req,res) => {
  res.render("index");
})