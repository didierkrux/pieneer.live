
exports.up = function (knex, Promise) {
  return knex.schema.createTable('dk_presentation', (table) => {
    table.increments();
    table.integer('users_id').unsigned();
    table.foreign('users_id').references('users.id');
    table.string('title');
    table.text('json');
    table.timestamps(false, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('dk_presentation');
};