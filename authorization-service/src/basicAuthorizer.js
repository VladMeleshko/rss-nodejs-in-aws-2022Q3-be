export const basicAuthorizer = async (event, ctx, cb) => {
  if (event.type !== process.env.AUTH_TYPE || !event.identitySource || !event.identitySource.length) {
    cb('Unauthorized');
  }

  try {
    const {identitySource, routeArn} = event;
    const [authSchemeAndToken] = identitySource;
    const [authScheme, authToken] = authSchemeAndToken.split(' ');

    if (authScheme !== process.env.AUTH_SCHEME || !authToken) {
      throw new Error('Incorrect authentication scheme');
    }

    const buff = Buffer.from(authToken, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');

    const predefinedPassword = process.env[username];
    const policyEffect = !predefinedPassword || predefinedPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(authToken, routeArn, policyEffect);

    cb(null, policy);
  } catch (error) {
    cb(`Unauthorized: ${error.message}`);
  }
};

const generatePolicy = (principalId, resource, policyEffect) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: policyEffect,
          Resource: resource
        }
      ]
    }
  };
}
