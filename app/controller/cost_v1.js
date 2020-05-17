var mongoose = require('mongoose'),

Cost = mongoose.model('Cost');

CostService = {

  findAll : function(req, res){
    Cost.find({},function(err, results) {
      return res.send(results);
    });
  },

  findById : function(req, res){
    var id = req.params.id;
    Cost.findOne({'_id':id},function(err, result) {
      return res.send(result);
    });
  },

  add : function(req, res) {
    Cost.create(req.body, function (err, door) {
      if (err) return console.log(err);
      return res.send(door);
    });
  },

  insertBatch : function(req, res) {
    console.log('Insert batch');
    Cost.insertMany(req.body, function (err, door) {
      if (err) return console.log(err);
      return res.send(door);
    });
  },

  //update : function(req, res) {
  //  var id = req.params.id;
  //  //console.log(req.body);
  //  console.log('Updating ' + id);
  //  Cost.update({"_id":id}, req.body,
  //    function (err, numberAffected) {
  //      if (err) return console.log(err);
  //      console.log('Updated %s instances', numberAffected.toString());
  //      return res.sendStatus(202);
  //  });
  //},

  //update2 : function(req, res) {
  //  var id = req.params.id;
  //  //console.log(req.body);
  //  console.log('Updating ' + id);
  //  Cost.findOne({'_id':id},function(err, result) {
  //    if(result) {
  //      Cost.update({"_id":id}, req.body,
  //        function (err, numberAffected) {
  //          if (err) return console.log(err);
  //          console.log('Updated %s instances', numberAffected.toString());
  //          return res.sendStatus(202);
  //      });
  //    }
  //    else {
  //      Cost.create(req.body, function (err, instance) {
  //        if (err) return console.log(err);
  //        return res.send(instance);
  //      });
  //    }
  //  });
  //},

  update3 : function(req, res) {
    var id = req.params.id;
    //console.log(req.body);
    console.log('Updating ' + id);
    Cost.update({"_id":id}, req.body, {upsert:true},
      function (err, numberAffected) {
        if (err) return console.log(err);
        console.log('Updated %s instances', numberAffected.toString());
        return res.sendStatus(202);
    });
  },

  delete : function(req, res){
    var id = req.params.id;
    
    // Replace remove() with deleteOne() or deleteMany() -- https://stackoverflow.com/questions/51960171/node63208-deprecationwarning-collection-ensureindex-is-deprecated-use-creat#51962721

    Cost.remove({'_id':id},function(err,result) {
      return res.send(result);
    });
  },

  findAllForUnit : function(req, res){
    var uid = req.params.uid;
    Cost.find({'unit_id':uid},function(err, results) {
      return res.send(results);
    });
  },

  deleteAllForUnit : function(req, res){
    var uid = req.params.uid;

    // Replace remove() with deleteOne() or deleteMany() -- https://stackoverflow.com/questions/51960171/node63208-deprecationwarning-collection-ensureindex-is-deprecated-use-creat#51962721

    Cost.remove({'unit_id':uid},function(err, results) {
      return res.send(results);
    });
  }
};

module.exports = CostService;
