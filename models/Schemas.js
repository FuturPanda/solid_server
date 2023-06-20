const mongoose = require("mongoose");
const { Schema } = mongoose;

class Uint8Array extends mongoose.SchemaType {
  constructor(key, options) {
    super(key, options, "Uint8Array");
  }

  // `cast()` takes a parameter that can be anything. You need to
  // validate the provided `val` and throw a `CastError` if you
  // can't convert it.
  cast(val) {
    let _val = new Uint8Array(val);
    console.log(val);

    return _val;
  }
}

// Don't forget to add `Int8` to the type registry
mongoose.Schema.Types.Uint8Array = Uint8Array;

const UserSchema = new Schema({
  id: Number,
  username: String,
  date: { type: Date, default: Date.now },
});
const JournalSchema = new Schema({
  date: { type: Date, default: Date.now },
  ydoc: Uint8Array,
});

const YdocSchema = new Schema(
  {
    date: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", JournalSchema);
// title: String, // String is shorthand for {type: String}
// author: String,
// body: String,
// comments: [{ body: String, date: Date }],
// date: { type: Date, default: Date.now },
// hidden: Boolean,
// meta: {
//   votes: Number,
//   favs: Number,
// },
module.exports = Journal;
