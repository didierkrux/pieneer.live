
exports.up = function(knex,Promise){
  return knex.schema.createTable('users',(table)=>{
    table.increments();
    table.string('usersname', 50);
    table.string('password', 100);
    table.string('social_login');
    table.string('first_name', 50);
    table.string('last_name', 50);
    table.string('email', 100);
    table.integer('phone');
    table.string('company', 100);
    table.timestamps(false,true);
  });
}

exports.down = function(knex,Promise){
  return knex.schema.dropTable('users');
}