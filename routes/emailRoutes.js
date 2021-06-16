require("dotenv").config();
const router = require("express").Router();
const AWS = require("aws-sdk");

const credentials = new AWS.SharedIniFileCredentials({
  profile: "wahyuEndySantoso",
});
const sns = new AWS.SNS({ credentials, region: "ap-southeast-1" });
const topicArn = "arn:aws:sns:ap-southeast-1:010765115127:myStackAbuseTopic";

router.post("/subscribe-email", (req, res) => {
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
module.exports = router;
