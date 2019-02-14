
exports.up = function (knex, Promise) {
  return knex.schema.createTable('dk_q_a', (table) => {
    table.increments();
    table.integer("presentation_id").unsigned();
    table.foreign('presentation_id').references('dk_presentation.id');
    table.string('question');
    table.string('name');
    table.integer('likes');
    table.timestamps(false, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('dk_q_a');
};