import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { Buffer } from "buffer";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.post("/send-sms", async (req, res) => {
  try {
    const authKey = process.env.SMS_AUTHKEY;
    const authToken = process.env.SMS_AUTHTOKEN;
    const authString = `${authKey}:${authToken}`;
    const base64AuthString = Buffer.from(authString).toString("base64");
    console.log("token ",base64AuthString);

    const response = await axios.post(
      `https://restapi.smscountry.com/v0.1/Accounts/${authKey}/SMSes/`,
      {
        Text: "0000 - OTP to verify your number to access the SuperJ App, powered by META JUPITER SOFTWARE SOLUTIONS PRIVATE LIMITED. Do not share.",
        Number: "918074015141",
        SenderId: "JMSPRJ",
        // DRNotifyUrl: "https://www.domainname.com/notifyurl",
        // DRNotifyHttpMethod: "POST",
        Tool: "API",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64AuthString}`,
        },
      }
    );
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    console.log("Response:", response.data);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).send("No response received from server.");
    } else {
      console.error("Error setting up the request:", error.message);
      res.status(500).send("Error setting up the request.");
    }
  }
});

app.listen(4000, () => console.log(`Server running`));
