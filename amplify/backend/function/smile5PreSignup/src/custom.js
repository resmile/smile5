/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event, context, callback) => {

  event.response.autoConfirmUser = true;

if (event.request.userAttributes.hasOwnProperty("email")) {
  event.response.autoVerifyEmail = true;
}
/*
if (event.request.userAttributes.hasOwnProperty("phone_number")) {
  event.response.autoVerifyPhone = true;
}*/

// Return to Amazon Cognito
callback(null, event);
};
