const knex = require('fs');
const FolderActions = require('../databaseActions/folderActions');

describe('Folder', function () {
    const folderActions = new FolderActions();

    it('reads what it creates', () => {
        expect(folderActions.readdir()).toEqual();
    })
})