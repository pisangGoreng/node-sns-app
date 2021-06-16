require("dotenv").config();
const router = require("express").Router();
const AWS = require("aws-sdk");

const credentials = new AWS.SharedIniFileCredentials({
  profile: "wahyuEndySantoso",
});
const sns = new AWS.SNS({ credentials, region: "ap-southeast-1" });
const topicArn = "arn:aws:sns:ap-southeast-1:010765115127:myStackAbuseTopic";

router.post("/subscribe-sms", (req, res) => {
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

router.post("/send-sms", (req, res) => {
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

module.exports = router;
