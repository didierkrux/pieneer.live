// not used
exports.up = function(knex,Promise){
  return knex.schema.createTable('dk_users',(table)=>{
    table.increments();
    table.string('email');
    table.string('password');
    table.string('google_id');
    table.string('facebook_id');
    table.string('linkedin_id');
    table.string('first_name');
    table.string('last_name');
    table.integer('phone');
    table.string('company');
    table.timestamps(false,true);
  });
}

exports.down = function(knex,Promise){
  return knex.schema.dropTable('dk_users');
}