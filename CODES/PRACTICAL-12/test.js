const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const port = 3000;

// Your App ID public key URL for verifying the JWT signature
const APP_ID_PUBLIC_KEY_URL = 'https://au-syd.appid.cloud.ibm.com/management/v4/dc4c86a6-5729-4ec4-ae36-28d76456a9ee/config/idps/custom';

// Middleware to verify the JWT
async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Fetch the App ID public keys
    const response = await axios.get(APP_ID_PUBLIC_KEY_URL, {
      headers: {
          Authorization: `Bearer eyJraWQiOiIyMDI0MTEwMTA4NDIiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTMwMDA4WFNJIiwiaWQiOiJJQk1pZC02OTMwMDA4WFNJIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiMjVhNzUxZGEtMjg3NC00OWU2LTliYTYtZGFmMzliNTQxNjg0IiwiaWRlbnRpZmllciI6IjY5MzAwMDhYU0kiLCJnaXZlbl9uYW1lIjoiVHVzaGFyIiwiZmFtaWx5X25hbWUiOiJQYW5jaGFsIiwibmFtZSI6IlR1c2hhciBQYW5jaGFsIiwiZW1haWwiOiJ0dXNoYXJwYW5jaGFsMjFAZ251LmFjLmluIiwic3ViIjoidHVzaGFycGFuY2hhbDIxQGdudS5hYy5pbiIsImF1dGhuIjp7InN1YiI6InR1c2hhcnBhbmNoYWwyMUBnbnUuYWMuaW4iLCJpYW1faWQiOiJJQk1pZC02OTMwMDA4WFNJIiwibmFtZSI6IlR1c2hhciBQYW5jaGFsIiwiZ2l2ZW5fbmFtZSI6IlR1c2hhciIsImZhbWlseV9uYW1lIjoiUGFuY2hhbCIsImVtYWlsIjoidHVzaGFycGFuY2hhbDIxQGdudS5hYy5pbiJ9LCJhY2NvdW50Ijp7InZhbGlkIjp0cnVlLCJic3MiOiI5NTUzZjVmNzE4NGRkYjkyMmEwNTZmMjQwY2Y3OGVmNiIsImltc191c2VyX2lkIjoiMTE4MTc2MzAiLCJmcm96ZW4iOnRydWUsImltcyI6IjI3MTYwNjMifSwiaWF0IjoxNzMzMDc4MTA2LCJleHAiOjE3MzMwODE3MDYsImlzcyI6Imh0dHBzOi8vaWFtLmNsb3VkLmlibS5jb20vaWRlbnRpdHkiLCJncmFudF90eXBlIjoidXJuOmlibTpwYXJhbXM6b2F1dGg6Z3JhbnQtdHlwZTphcGlrZXkiLCJzY29wZSI6ImlibSBvcGVuaWQiLCJjbGllbnRfaWQiOiJkZWZhdWx0IiwiYWNyIjoxLCJhbXIiOlsicHdkIl19.W3963Zvr2FXFc2jkBtrcocxsuZKk-hMzdnmeFiMiSRF2gZRWjro1sF3g6QuACzhaqd_47ocxAcuM4KiWz_PT9IKx_f-db_d02p6PMrbhgxf1vTNjsK3k-nYvTEOkhzp424tvLd6GIUPetEAPso9yvwDhQvnXOqR_9NmoZG0vk7Hb2l6kxxlFx3AIuztTHWn_YzJgldkGnPT2q4EruSm4cMrIhVTGdd0IjAm8tFQ4syfm17PIJ7Y8-eX-Ry1J7p3bHwA3IraEuok77O-NWOld0B0GH9Ov2uaixYWcxHO07nzuJSXt2GCfs1yL4izYyRXSmxuUEusGYLsgnp40JbGx1g` // Pass the Bearer token here
      },
  });
  console.log(response)
    const publicKeys = response.data.config.publicKey;
console.log(publicKeys);
    if (!publicKeys || publicKeys.length === 0) {
      return res.status(500).json({ error: 'Failed to retrieve public keys' });
    }

    // Decode the JWT header to find the key ID (kid)
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader || !decodedHeader.header) {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    // Find the corresponding public key based on the kid
    //const key = publicKeys.find(k => k.kid === decodedHeader.header.kid);
    
    if (!publicKeys) {
      return res.status(400).json({ error: 'Public key not found for token' });
    }

    // Construct the PEM formatted public key
   // const publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKeys}\n-----END PUBLIC KEY-----`;
//console.log(publicKey);
    // Verify the token using the public key
    jwt.verify(token, publicKeys, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token verification failed', message: err.message });
      }

      // Token is valid, attach user info to request and proceed
      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify token', message: error.message });
  }
}

// Sample protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted to protected resource',
    user: req.user, // Include the decoded user details
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
