
exports.up = function (knex, Promise) {
  return knex.schema.createTable('polls', (table) => {
    table.increments();
    table.string('polls_question');
    table.json('style');
    table.json('answers_content');
    table.timestamps(false, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('polls');
};