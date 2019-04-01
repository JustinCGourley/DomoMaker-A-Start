const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const _ = require('underscore');

let DomoModel = {};

const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  description: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  description: doc.description,
});

DomoSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return DomoModel.find(search).select('name age description').exec(callback);
};

DomoSchema.statics.remove = (data) => {
  DomoModel.deleteOne({ _id: data.id, name: data.name, age: data.age,
    description: data.description }, (err, done) => {
    if (err) {
      console.log(err);
    }
    return done;
  });

  return true;
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
