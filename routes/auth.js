var express = require('express');
const passport = require('passport');
var createError = require('http-errors');
var strava = require('strava-v3');
const StravaStrategy = require('passport-strava-oauth2').Strategy
const dotenv = require('dotenv');

const config = require('../env-config.js')

const db = require('../database');


dotenv.config();


var router = express.Router();

// Passport session setup.
passport.serializeUser(function(user, done) {
    //console.log('serializeUser', user)
    done(null, user)
});
passport.deserializeUser(function(obj, done) {
    //console.log('desearilizeUser', obj)
    done(null, obj)
});

passport.use(new StravaStrategy({
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: `${config.API_Domain}/auth/strava/callback`
  },
  // the 'verify callback'
  // typical purpose to find the user that possesses a set of credentials
  function(accessToken, refreshToken, profile, done) {
        db.addAthlete(profile);
        return done(null, profile);
  }
));

// Use passport.authenticate() as route middleware to authenticate the
// request.  Redirect user to strava, then strava will redirect user back to
// this application at /auth/strava/callback
router.get('/strava', passport.authenticate('strava', { scope: ['activity:read'], approval_prompt: ['force'] }),
  function(req, res){
    // The request will be redirected to Strava for authentication, so this
    // function will not be called.
  }
  );

// GET /auth/strava/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/strava/callback',
    passport.authenticate('strava', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect(`${config.APP_Domain}/StravaActivities`);
    }
);

router.get('/StravaPhoto', ensureAuthenticated, function(req, res){
    if ( req.user && req.user.photos && req.user.photos.length > 0 ) {
        res.json({ 'photo': req.user.photos[req.user.photos.length-1].value });
    } else {
        res.sendStatus(404);
    }
});


router.get('/logout', function(req, res){
  req.logout();
  res.cookie('connect.sid', '', { expires: new Date() });
  res.redirect(`${config.APP_Domain}`);
});


router.get('/getAllActivities*', ensureAuthenticated, (req, res) => {
    const { user } = req;
    const { page } = req.query;

    db.getActivities(user.id).then(dbActivities => {
        if ( page == 0 ) {
            res.json({activities: dbActivities, finished: false})
        } else {
            getActivitiesFromStrava(page, user.token, res)
        }
    })
})

router.get('/getStreams/:activityID', ensureAuthenticated, (req, res) => {
    const { activityID } = req.params;
    const { token, id } = req.user;
    getStreams(activityID, id, token, res)
})

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    console.log('NOT FOUND:', req.url)
  next(createError(404));
});

// error handler
router.use(function(err, req, res, next) {
    console.log('ERROR', err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    //console.log('ensureAuthenticated?', req.isAuthenticated())
    if (req.isAuthenticated()) { return next(); }
    res.redirect(`${config.API_Domain}/auth/strava`)
}


var getActivity = (id, token) => {
    strava.activities.get({ id: id, 'access_token': token },function(err, payload) {
        //console.log('payload',payload)
    })
}

var getStreams = (activityID, athleteID, token, res) => {

    db.getStreams(activityID, athleteID).then(dbStreams => {
        if ( Object.keys(dbStreams).length === 0 ) {
            const keys = ['time', 'latlng', 'distance', 'altitude', 'velocity_smooth', 'heartrate', 'cadence', 'watts', 'temp', 'moving', 'grade_smooth']
            strava.streams.activity({ id: activityID, access_token: token, resolution: 'high', types: keys }, function(err, payload, limits) {
                if ( err || payload.errors ) {
                    res.status(400).json({ msg: 'Error getting activities:' + err });
                } else {
                    db.addStreams(activityID, athleteID, payload).then(dbAddedStreams => {
                        res.json(dbAddedStreams)
                    })
                }
            })
        } else {
            res.json(dbStreams)
        }
    })

}

var getActivitiesFromStrava = (page, token, res) => {

    const options = {
        'before': Math.floor(Date.now() / 1000),
        'per_page': 50,
        'page': page,
        'access_token': token
    }
    strava.athlete.listActivities(options, function(err,payload,limits) {
        if ( err || payload.errors ) {
            res.status(400).json({ msg: 'Error getting activities:' + err });
        } else {
            const finished = payload.length < options.per_page; // Check here to ensure it picks up any old activities that the user only just added to strava
            db.addActivities(payload).then(newActivities => {
                //const finished = newActivities.length === 0;
                res.json({activities: newActivities, finished: finished})
            })
        }
    });
}

module.exports = router;