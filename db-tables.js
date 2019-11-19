module.exports = {
    athletes: [
        {
            name: 'id',
            type: 'bigint UNIQUE',
            quote: false,
            stravaName: ['id']
        },
        {
            name: 'displayname',
            type: 'character',
            maxLength: 60,
            quote: true,
            stravaName: ['displayName']
        },
        {
            name: 'familyname',
            type: 'character',
            maxLength: 30,
            quote: true,
            stravaName: ['name','familyName']
        },
        {
            name: 'givenname',
            type: 'character',
            maxLength: 30,
            quote: true,
            stravaName: ['name','givenName']
        }
    ],
    activities: [
        {
            name: 'id',
            type: 'bigint UNIQUE',
            quote: false,
            stravaName: ['id']
        },
        {
            name: 'athlete_id',
            type: 'bigint',
            quote: false,
            stravaName: ['athlete','id']
        },
        {
            name: 'name',
            type: 'character',
            maxLength: 60,
            quote: true,
            stravaName: ['name']
        },
        {
            name: 'type',
            type: 'character',
            maxLength: 20,
            quote: true,
            stravaName: ['type']
        },
        {
            name: 'distance',
            type: 'real',
            quote: false,
            stravaName: ['distance']
        },
        {
            name: 'moving_time',
            type: 'integer',
            quote: false,
            stravaName: ['moving_time']
        },
        {
            name: 'elapsed_time',
            type: 'integer',
            quote: false,
            stravaName: ['elapsed_time']
        },
        {
            name: 'total_elevation_gain',
            type: 'integer',
            quote: false,
            stravaName: ['total_elevation_gain']
        },
        {
            name: 'start_date',
            type: 'timestamp',
            quote: true,
            stravaName: ['start_date']
        },
        {
            name: 'summary_polyline',
            type: 'geometry',
            quote: true,
            stravaName: ['map','summary_polyline'],
            conversion: 'ST_LineFromEncodedPolyline'
        },
        {
            name: 'average_speed',
            type: 'real',
            quote: false,
            stravaName: ['average_speed']
        },
        {
            name: 'max_speed',
            type: 'real',
            quote: false,
            stravaName: ['max_speed']
        },
        {
            name: 'average_cadence',
            type: 'real',
            quote: false,
            stravaName: ['average_cadence']
        },
        {
            name: 'average_heartrate',
            type: 'real',
            quote: false,
            stravaName: ['average_heartrate']
        },
        {
            name: 'elev_high',
            type: 'real',
            quote: false,
            stravaName: ['elev_high']
        },
        {
            name: 'elev_low',
            type: 'real',
            quote: false,
            stravaName: ['elev_low']
        }
    ],
    streams: [
        {
            name: 'id',
            type: 'bigint UNIQUE',
            quote: false,
            stravaName: ['id']
        },
        {
            name: 'athlete_id',
            type: 'bigint',
            quote: false,
            stravaName: ['athlete','id']
        },
        {
            name: 'time',
            type: 'integer[]',
            quote: false,
            stravaName: ['time']
        },/*
        {
            name: 'latlng',
            type: 'geometry',
            quote: false,
            stravaName: ['latlng'],
            conversion: '????'
        },*/
        {
            name: 'distance',
            type: 'real[]',
            quote: false,
            stravaName: ['distance']
        },
        {
            name: 'altitude',
            type: 'real[]',
            quote: false,
            stravaName: ['altitude']
        },
        {
            name: 'velocity_smooth',
            type: 'real[]',
            quote: false,
            stravaName: ['velocity_smooth']
        },
        {
            name: 'heartrate',
            type: 'integer[]',
            quote: false,
            stravaName: ['heartrate']
        },
        {
            name: 'cadence',
            type: 'integer[]',
            quote: false,
            stravaName: ['cadence']
        },
        {
            name: 'watts',
            type: 'integer[]',
            quote: false,
            stravaName: ['watts']
        },
        {
            name: 'temp',
            type: 'integer[]',
            quote: false,
            stravaName: ['temp']
        },
        {
            name: 'moving',
            type: 'boolean[]',
            quote: false,
            stravaName: ['moving']
        },
        {
            name: 'grade_smooth',
            type: 'real[]',
            quote: false,
            stravaName: ['grade_smooth']
        }
    ]
}
