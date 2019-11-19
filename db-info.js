const dbTables = require('./db-tables');

const getValuesForInsert = (item, column) => {
    const rawValue = column.stravaName.length === 1 ? item[column.stravaName[0]] : item[column.stravaName[0]][column.stravaName[1]];
    const truncatedValue = column.maxLength ? rawValue.slice(0, column.maxLength) : rawValue;
    const value = ( truncatedValue == null || truncatedValue === '' ) ? 'NULL' : column.quote ? `'${truncatedValue.replace("'","''")}'` : truncatedValue;
    return column.hasOwnProperty('conversion') ? `${column.conversion}(${value})` : value;
}

module.exports = {
    getActivities: athleteID => (
        `SELECT json_agg(json_build_object('type','Feature','geometry',ST_AsGeoJSON(summary_polyline)::jsonb,'properties',to_jsonb(row)-'summary_polyline'))
         FROM (SELECT * FROM activities) row WHERE athlete_id=${athleteID};`),
    addAthlete: athlete => {
        const columns = `${dbTables.athletes.map(column => column.name).join(',')}`;
        const values = `(${dbTables.athletes.map(column => getValuesForInsert(athlete, column))})`
        return `INSERT INTO athletes (${columns}) VALUES ${values} ON CONFLICT (id) DO NOTHING;`
    },
    addActivities: activities => {
        const columns = `${dbTables.activities.map(column => column.name).join(',')}`;
        const mappedActivities = activities.filter(activity => activity.map.summary_polyline !== null);
        const values = mappedActivities.map(activity => (
            `(${dbTables.activities.map(column => getValuesForInsert(activity, column))})`
        )).join(',');
        return `WITH returned_data as (INSERT INTO activities (${columns}) VALUES ${values} ON CONFLICT (id) DO NOTHING RETURNING *)
        SELECT json_agg(json_build_object('type','Feature','geometry',ST_AsGeoJSON(summary_polyline)::jsonb,'properties',to_jsonb(returned_data)-'summary_polyline'))
        FROM returned_data;`
    },
    addStreams: (activityID, athleteID, streams) => {
        const columnArr = dbTables.streams.map(column => column.name)
        const columns = `${columnArr.join(',')}`;
        const values = dbTables.streams.map(column => {
            let streamVals = 'NULL';
            if ( column.type.indexOf('[]') > -1 ) {
                streams.forEach(stream => {
                    if ( stream.type === column.name ) {
                        streamVals = (`ARRAY[${stream.data.join(',')}]`);
                    }
                })
            } else {
                if ( column.name === 'id')  streamVals = activityID;
                if ( column.name === 'athlete_id')  streamVals = athleteID;
            }
            return streamVals;
        }).join(',');
        const streamNames = ['time','distance','altitude','velocity_smooth','heartrate','cadence','watts','temp','moving','grade_smooth']
        return `WITH returned_data as (INSERT INTO streams (${columns}) VALUES (${values}) ON CONFLICT (id) DO NOTHING RETURNING *)
        SELECT json_build_object(${streamNames.map(name => `'${name}', ${name}`).join(',')})
        FROM returned_data;`
    },
    getStreams: activityID => {
        const streamNames = ['time','distance','altitude','velocity_smooth','heartrate','cadence','watts','temp','moving','grade_smooth']
        return `SELECT json_build_object(${streamNames.map(name => `'${name}', ${name}`).join(',')})
        FROM (SELECT * FROM streams) row WHERE id=${activityID};`
    },
    createTable: tableName => (`CREATE TABLE ${tableName} (${dbTables[tableName].map(
        column => (`${column.name} ${column.type}${column.maxLength ? ` varying(${column.maxLength})` : ''}`)).join(', ')});`)
  }
