
exports.up = function (knex, Promise) {
  return knex.schema.createTable('presentation', (table) => {
    table.increments();
    table.integer('users_id').unsigned();
    table.foreign('users_id').references('users.id');
    table.string('title');
    table.string('location');
    table.string('date');
    table.timestamps(false, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('presentation');
};