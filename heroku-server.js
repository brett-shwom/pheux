var express = require("express"),
    app = express(),
    errorHandler = require('errorhandler'),
    port = parseInt(process.env.PORT, 10) || 4567;

app.get("/", function (req, res) {
  res.redirect("/index.html");
});

app.use(express.static(__dirname + '/dest-demo'));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Simple static server listening at http://localhost:" + port);
app.listen(port);
