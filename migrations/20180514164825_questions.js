
exports.up = function (knex, Promise) {
  return knex.schema.createTable('questions', (table) => {
    table.increments();
    table.integer("presentation_id").unsigned();
    table.string('question', 255);
    table.string('name', 255);
    table.integer('likes');
    table.timestamps(false, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('questions');
};