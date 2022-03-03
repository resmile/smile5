const aws = require('aws-sdk');

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});

/**
 * @type {import('@types/aws-lambda').PostConfirmationTriggerHandler}
 */
 exports.handler = async (event, context, callback) => {
  const cognitoProvider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });


  let groupName=event.request.userAttributes["custom:groupName"]
  const groupParams = {
    UserPoolId: event.userPoolId,
  }
  
  const userParams = {
    UserPoolId: event.userPoolId,
    Username: event.userName,
  }

  if (groupName=="admin" || groupName=="general" || groupName=="master" || groupName=="seller" || groupName=="buyer") {
    groupParams.GroupName = groupName,
    userParams.GroupName = groupName

    // first check to see if the groups exists, and if not create the group
    try {
      await cognitoProvider.getGroup(groupParams).promise();
    } catch (e) {
      await cognitoProvider.createGroup(groupParams).promise();
    }

    // the user is an administrator, place them in the Admin group
    try {
      await cognitoProvider.adminAddUserToGroup(userParams).promise();
      callback(null, event);
    } catch (e) {
      callback(e);
    }
  } else {
    // if the user is in neither group, proceed with no action
    callback(null, event)
  }
}
