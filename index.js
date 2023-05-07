
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const { set } = require("forever/lib/forever/cli");
const router = express.Router();

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}

const PORT = process.env.PORT || 8080

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).jason({});
  }
  next();
});

router.get("/", function (req, res) {
  res.sendFile(path.join("./public/index.html"));
});

//add the router
app.use("/", router);

console.log("Server Running");

// POST route from contact form
app.post("/contact", (req, res) => {
  // Instantiate the SMTP s erver
  const smtpTrans = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    tls: {
      rejectUnauthorized: false, //NOTE: you only need to set rejectUnauthorized to false if you are running on a local server, you can remove it after testing
    },
    auth: {
      user: "findcollinw@gmail.com",
      pass: "Ambercollinwisser24910!",
    },
  });

  // Specify what the email will look like
  const mailOpts = {
    from: `${req.body.email}`, // This is ignored by Gmail
    to: "wisser24910@gmail.com",
    subject: "New message from contact form at Findcollin.com",
    text: `Name: ${req.body.name}\nFrom: (${req.body.email})\nPhone: ${req.body.phone}\nMessage: ${req.body.message}`,
  };

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      console.log(error); // Show a page indicating failure
      res.sendStatus(400).send();
    } else {
      console.log("Successfully sent email"); // Show a page indicating success
      res.json({ success: "Email Successfully", status: 200 });
    }
  });
});

//const server = http.createServer(app);
//server.listen(PORT, () => {
//    console.log(`Server is running on port ${PORT}`);
//});

https.createServer(options, app).listen(PORT, console.log(`server runs on port ${PORT}`))
//app.listen(8080, function() {
//  console.log('Listening to port:  ' + 8080);
//});



