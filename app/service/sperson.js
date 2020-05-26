var Person = require('../models/Person');

module.exports.getPersonsByWildcard = function() {
  
var o = {},

self = this;

o.map = function () {
  //emit( this.address.locality, 1 );
  emit( this._id,
    this.firstname + this.lastname + this.email + this.telephone
    + this.street + this.streetnr + this.zip + this.city + this.country );
};

var target = 'search_for_me';

o.reduce = function (k, vals) {
  //return vals.length;
  var hit_counts = vals.map( (s) => { s.match( '/' + target + '/g' ).length; )
  return Array.sum(( hit_counts );
};

Person.mapReduce(o, function (err, results) {
  if(err) throw err;
  console.log(results);
});

    /*
var o = {};

o.map = function () {
  emit(Person.address.locality, 1);
}

o.reduce = function (k, vals) {
  return vals.length;
}

Person.collection.mapReduce(o, function (err, results) {
  if(err) throw err;
  console.log(results);
})
*/

};

db.people.mapReduce( 
  function() { emit( this._id,
    this.firstname + this.lastname + this.email + this.telephone
    + this.street + this.streetnr + this.zip + this.city + this.country ); }, 
	
  function(key, values)
  {
    var hit_counts = values.map( (s) => { s.match( '/odtmoo/g' ).length; )
    return Array.sum(( hit_counts ); },
  {  
      query:{status:"active"},  
      out:"hit_counts" 
   }
)
  
db.people.mapReduce( 
  function() { emit( this._id,
    this.firstname + this.lastname + this.email + this.telephone
    + this.street + this.streetnr + this.zip + this.city + this.country ); }, 
  function(key, values) {
    var hit_counts = values.map( (s) => { s.match( '/odtmoo/g' ).length; }
    return Array.sum( hit_counts ); },
  {  
      query:{units : "001",},  
      out:"hit_counts" 
   }  
)
    
    
db.posts.mapReduce( 
   function() { emit(this.user_id,1); }, 
	
   function(key, values) {return Array.sum(values)}, {  
      query:{units : "001",},  
      out:"post_total" 
   }
)


db.people.mapReduce(
  function() { emit(this.user_id,1); },
  function(key, values)
    {return Array.sum(values)},
    {query:{units : "001",}, out:"post_total" } )
{
	"result" : "post_total",
	"timeMillis" : 112,
	"counts" : {
		"input" : 13,
		"emit" : 13,
		"reduce" : 1,
		"output" : 1
	},
	"ok" : 1
}

db.people.mapReduce(
  function() { emit(this._id,1); },
  function(key, values)
    {return Array.sum(values)},
    {query:{units : "001",}, out:"post_total" } ).find()

db.people.mapReduce(
  function() {
    var s = this.firstname + this.lastname + this.email + this.telephone
    + this.street + this.streetnr + this.zip + this.city + this.country;
    emit(this._id,s.length); },
  function(key, values)
    {return Array.sum(values)},
  {query:{units : "001",}, out:"strlentotal" } ).find()


db.people.mapReduce(
  function() {
    var s = this.firstname + this.lastname + this.email + this.telephone
    + this.street + this.streetnr + this.zip + this.city + this.country;
    emit(this._id,/alexander/.test(s)); },
  function(key, values)
    {return Array.sum(values)},
  {query:{units : "001",}, out:"strlentotal" } ).find()

db.people.mapReduce(
  function() {
    var s = this.firstname + this.lastname + this.email + this.telephone
    + this.street + this.streetnr + this.zip + this.city + this.country;
    emit(this._id,/odtmoo/.test(s)); },
  function(key, values)
    {return Array.sum(values)},
  {query:{units : "001",}, out:"strlentotal" } ).find()

db.people.mapReduce(
...   function() {
...     var s = this.firstname + this.lastname + this.email + this.telephone
...     + this.street + this.streetnr + this.zip + this.city + this.country;
...     emit(this._id,/odtmoo/.test(s)); },
...   function(key, values)
...     {return Array.sum(values)},
...   {query:{units : "001",}, out:"strlentotal" } ).find()
{ "_id" : "alexander_kem", "value" : false }
{ "_id" : "erich_klimaczewski", "value" : false }
{ "_id" : "esref_esbah", "value" : false }
{ "_id" : "fabio_krueger", "value" : false }
{ "_id" : "herbert_braeuning", "value" : false }
{ "_id" : "horst_weidenmueller", "value" : false }
{ "_id" : "mandy_schmidt", "value" : false }
{ "_id" : "mandy_schmidt_2", "value" : false }
{ "_id" : "otto_froehlich", "value" : false }
{ "_id" : "sabine_diesslin", "value" : false }
{ "_id" : "scheuermann_hv", "value" : false }
{ "_id" : "weidenmueller_gmbh", "value" : true }
{ "_id" : "zebra_gbr", "value" : true }


db.people.mapReduce(
...   function() {
...     var s = this.firstname + this.lastname + this.email + this.telephone
...     + this.street + this.streetnr + this.zip + this.city + this.country;
...     emit(this._id,/odtmoo/.test(s)); },
...   function(key, values)
...     {return Array.sum(values)},
...   {query:{units : "001",}, out:"strlentotal" } ).find( {value: {$eq:true}} )


db.people.mapReduce(
...   function() {
...     var s = this.firstname + this.lastname + this.email + this.telephone
...     + this.street + this.streetnr + this.zip + this.city + this.country;
...     emit(this._id,/odtmoo/.test(s)); },
...   function(key, values)
...     {return Array.sum(values)},
...   {query:{units : "001"}, out:"match" } ).find( {value: {$eq:true}} )


