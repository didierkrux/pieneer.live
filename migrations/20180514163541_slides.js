
exports.up = function(knex, Promise) {
  return knex.schema.createTable('slides',(table)=>{
    table.increments();
    table.integer('presentation_id').unsigned();
    table.foreign('presentation_id').references('presentation.id');
    table.string('page_type');
    table.integer('order_index');
    table.string('img_url');
    table.integer('polls_id').unsigned();
    table.foreign('polls_id').references('polls.id');
    table.timestamps(false,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('slides');
};