const axios = require("axios");

const BASE_URL = "https://love-calculator.p.rapidapi.com/";

module.exports = {
  getPercentage(yourName, partnerName) {
    return axios({
      "method":"GET",
      "url":"https://love-calculator.p.rapidapi.com/getPercentage",
      "headers":{
      "content-type":"application/octet-stream",
      "x-rapidapi-host":"love-calculator.p.rapidapi.com",
      "x-rapidapi-key":"96c9bf6464msh4a5d79f08aa2581p1822e4jsn13e047bf6b03"
      },"params":{
      "fname": yourName,
      "sname": partnerName
      }
      });
  }
};
