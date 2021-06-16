require("dotenv").config();
const router = require("express").Router();
const AWS = require("aws-sdk");

const credentials = new AWS.SharedIniFileCredentials({
  profile: "wahyuEndySantoso",
});
const sns = new AWS.SNS({ credentials, region: "ap-southeast-1" });
const topicArn = "arn:aws:sns:ap-southeast-1:010765115127:myStackAbuseTopic";

router.post("/http-subscribe", (req, res) => {
  let body = "";
  let payload = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    console.log(body);
    payload = JSON.parse(body);

    if (req.header["x-amz-sns-message-type"] == "SubscriptionConfirmation") {
      console.log(payload.SubscribeURL);
    }

    if (req.header["x-amz-sns-message-type"] === "Notification") {
      console.log(payload.Message);
    }
  });
});

module.exports = router;
