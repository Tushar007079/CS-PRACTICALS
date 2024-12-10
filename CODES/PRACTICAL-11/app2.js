const express = require('express'); 						
const passport = require('passport');						
const APIStrategy = require('ibmcloud-appid').APIStrategy;		
const app = express();
app.use(passport.initialize());
passport.use(new APIStrategy({
	oauthServerUrl: "https://https://au-syd.appid.cloud.ibm.com/oauth/v4/dc4c86a6-5729-4ec4-ae36-28d76456a9ee",
}));

// Protect the whole app
app.use(passport.authenticate(APIStrategy.STRATEGY_NAME, {
	session: false
}));

// The /api/data API used to retrieve protected data
app.get('/api/data', (req, res) => {
	res.json({
		data: 12345
	});
});
app.listen(3001, () => {
    console.log('Listening on http://localhost:3001');
});
