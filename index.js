require("dotenv").config();
const express = require("express");

const smsRoutes = require("./routes/smsRoutes");
const emailRoutes = require("./routes/emailRoutes");
const httpRoutes = require("./routes/htppRoutes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(smsRoutes);
app.use(emailRoutes);
app.use(httpRoutes);
app.get("/status", (req, res) => res.json({ status: "ok", sns: sns }));

// ! subscribe endpoints
app.post("/subscribe", (req, res) => {
  let params = {
    Protocol: "EMAIL", // HTTP/S, EMAIL, SMS, SQS
    TopicArn: topicArn,
    Endpoint: req.body.email,
  };

  sns
    .subscribe(params)
    .promise()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err, err.stack);
    });
});

// ! publisher endpoints
app.post("/send", (req, res) => {
  let now = new Date().toString();
  let email = `${req.body.message} \n \n This was sent: ${now}`;
  let message = {
    default: "SNS Notification",
    email: "Hello from SNS on email",
    sms: "Hello from SNS on SMS",
  };

  let params = {
    Message: JSON.stringify(message),
    MessageStructure: "json",
    Subject: req.body.subject,
    TopicArn: topicArn,
  };

  sns
    .publish(params)
    .promise()

    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err, err.stack);
    });
});

app.listen(port, () => console.log(`SNS App listening on port ${port}!`));
