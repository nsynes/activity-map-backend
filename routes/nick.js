var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const db = require('../database');

const nickID = process.env.STRAVA_NICK_ID;

router.get('/getActivities', (req, res) => {
    db.getActivities(nickID).then(dbActivities => {
        res.json({activities: dbActivities, finished: true})
    })
})

router.get('/getStreams/:activityID', (req, res) => {
    const { activityID } = req.params;
    db.getStreams(activityID, nickID).then(dbStreams => {
        res.json(dbStreams)
    })
})

module.exports = router;