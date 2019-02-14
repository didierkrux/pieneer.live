const DatabaseAction = require('../databaseActions/knex')
const config = require('../knexfile').development;

describe('Testing knex result', function () {
    const knex = require('knex')(config);
    const database = new DatabaseAction(knex);

    it('would actually write into the database read from it', () => {
        expect(database.readChartInfo(3)).toEqual('3');
    })
})