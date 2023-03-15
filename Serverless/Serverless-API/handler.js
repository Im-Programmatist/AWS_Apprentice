'use strict';

module.exports.demoFunc = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.userDetails = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: { 
          fname: "Chetan", 
          lname: "Korde",
          address: {
            city: "Amravati",
            state: "Maharashtra",
            country: "India"
          }
        }
      }
    ),
  };
};
