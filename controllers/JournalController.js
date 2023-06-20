const { DateTime } = require("luxon");
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

const now = new Date();
const JournalSchema = new Schema({
  date: {
    type: Date,
    default: `${now.getFullYear()}${now.getMonth()}${now.getDay()}`,
  },
  b64: String,
});

const Journal = new mongoose.model("Journal", JournalSchema);

const getIndexJournal = (req, res, next) => {
  Journal.find()
    .then((response) => res.json({ response }))
    .catch((error) => {
      res.json({
        message: "Error in searching in index of db",
      });
    });
};

const storeJournal = (b64) => {
  const journal = new Journal({
    date: `${now.getFullYear()}${now.getMonth()}${now.getDay()}`,
    b64: b64,
  });
  journal
    .save()
    .then((response) => console.log("journal saved " + response))
    .catch((error) => console.log(error));
};

const importJournal = async (now) => {
  try {
    const date = `${now.getFullYear()}${now.getMonth()}${now.getDay()}`;
    const response = await Journal.findOne({
      date: date,
    });
    return response.b64;
    // .then((response) => console.log({ response }))
    // .catch((error) => {
    //   console.log({
    //     message: "Error in searching for today's journal of db",
    //   });
    // });
  } catch (error) {
    console.log(error);
  }
};

const updateJournal = (now, ydoc) => {
  Journal.replaceOne(
    {
      date: `${now.getFullYear()}${now.getMonth()}${now.getDay()}`,
    },
    ydoc
  )
    .then((response) => console.log({ response }))
    .catch((error) => {
      console.log({
        message: "Error in updating today's journal of db",
      });
    });
};

module.exports = { storeJournal, importJournal, updateJournal };
