const { Client, Query } = require('pg');
const dotenv = require('dotenv');

const dbInfo = require('./db-info');

dotenv.config();

// Setup connection
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const conString = `postgres://${username}:${password}@${host}/${database}`;


const addStreams = (activityID, athleteID, streams) => {
    return new Promise((resolve, reject) => { // NEED TO ADD reject HANDLER
        var client = new Client(conString);
        client.connect();
        client.query(new Query(dbInfo.addStreams(activityID, athleteID, streams)), (err, result) => {
            if ( err ) console.log(err);
            client.end();
            const streams = result && result.rows[0] && result.rows[0].json_build_object ? result.rows[0].json_build_object : {};
            resolve(streams);
        })
    })
}

const getStreams = (activityID, athleteID) => {
    return new Promise((resolve, reject) => { // NEED TO ADD reject HANDLER
        var client = new Client(conString);
        client.connect();
        client.query(new Query(dbInfo.getStreams(activityID, athleteID)), (err, result) => {
            if ( err ) console.log(err);
            client.end();
            const streams = result && result.rows[0] && result.rows[0].json_build_object ? result.rows[0].json_build_object : {};
            resolve(streams);
        })
    });
  };

const addActivities = (activities) => {
    return new Promise((resolve, reject) => { // NEED TO ADD reject HANDLER
        var client = new Client(conString);
        client.connect();
        client.query(new Query(dbInfo.addActivities(activities)), (err, result) => {
            if ( err ) console.log(err);
            client.end();
            const newActivities = result.rows[0].json_agg ? result.rows[0].json_agg : [];
            resolve(newActivities);
        })
    })
}

const getActivities = (athleteID) => {
    return new Promise((resolve, reject) => { // NEED TO ADD reject HANDLER
        var client = new Client(conString);
        client.connect();
        client.query(new Query(dbInfo.getActivities(athleteID)), (err, result) => {
            if ( err ) console.log(err);
            client.end();
            const newActivities = result && result.rows[0] && result.rows[0].json_agg ? result.rows[0].json_agg : {};
            resolve(newActivities);
        })
    });
  };

const addAthlete = (athlete) => {
    var client = new Client(conString);
    client.connect();
    client.query(new Query(dbInfo.addAthlete(athlete)), (err, result) => {
        if ( err ) console.log(err);
        client.end();
    })
}


module.exports = { addStreams, getStreams, addActivities, getActivities, addAthlete };