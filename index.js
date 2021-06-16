require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");

const app = express();
const credentials = new AWS.SharedIniFileCredentials({
  profile: "wahyuEndySantoso",
});
const sns = new AWS.SNS({ credentials, region: "ap-southeast-1" });
const port = 3000;
const topicArn = "arn:aws:sns:ap-southeast-1:010765115127:myStackAbuseTopic";

app.use(express.json());
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
  let params = {
    Message: req.body.message,
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

app.post("/subscribe-email", (req, res) => {
  let params = {
    Protocol: "EMAIL",
    TopicArn: topicArn,
    Endpoint: req.body.email,
  };

  let promiseResult = sns.subscribe(params).promise();

  promiseResult
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err, err.stack);
    });
});

app.post("/subscribe-sms", (req, res) => {
  let params = {
    Protocol: "SMS",
    TopicArn: topicArn,
    Endpoint: req.body.number || "+6281310338777",
  };

  let promiseResult = sns.subscribe(params).promise();

  promiseResult
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err, err.stack);
    });
});

app.post("/send-sms", (req, res) => {
  let message = `${req.body.message}`;
  let params = {
    Message: message || "hai ini cuma test sms dengan SNS",
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
