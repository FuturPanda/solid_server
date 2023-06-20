const { Server } = require("@hocuspocus/server");
const { debounce } = require("debounce");
const { TiptapTransformer } = require("@hocuspocus/transformer");
const Y = require("yjs");
const { fromUint8Array, toUint8Array } = require("js-base64");
// const Journal = require("../models/Schemas");
const { Database } = require("@hocuspocus/extension-database");
const {
  storeJournal,
  importJournal,
  updateJournal,
} = require("../controllers/JournalController");
const { DateTime } = require("luxon");

const { Client } = require("@elastic/elasticsearch");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
const utils = require("y-websocket/bin/utils.js");
const uri =
  "mongodb+srv://solidadmin:ntj4dOYCwMCe7GY4@solid.08pw4vb.mongodb.net/solid-content?retryWrites=true&w=majority";

//Elastic
const client = new Client({
  node: "http://localhost:9200/",
  auth: {
    username: "elastic",
    password: "s*h7x*0pi9KTqPpkB7XP",
  },
});
//

//Hocus Pocus Server
let debounced;
const now = new Date();
const server = Server.configure({
  name: `${now.getFullYear()}${now.getMonth()}${now.getDay()}`,
  port: 1234,
  timeout: 30000,
  debounce: 5000,
  maxDebounce: 30000,
  async onConnect(data) {
    // Output some information
    console.log(`New websocket connection`);
  },
  async connected() {
    console.log("connections:", server.getConnectionsCount());
  },
  // async onAuthenticate(data) {
  //   const { token } = data;
  //   console.log(token);

  //   // Example test if a user is authenticated using a
  //   // request parameter
  //   if (token !== "hey") {
  //     throw new Error("Not authorized!");
  //   }

  //   // Example to set a document to read only for the current user
  //   // thus changes will not be accepted and synced to other clients
  //   // if (user not in array user editor) {
  //   //   data.connection.readOnly = true;
  //   // }

  //   // You can set contextual data to use it in other hooks
  //   return {
  //     user: {
  //       id: 1234,
  //       name: "John",
  //     },
  //   };
  // },
  // async onDisconnect(data) {
  //   // Output some information
  //   console.log(`"${data.context.user.name}" has disconnected.`);
  // },
  async onLoadDocument(data) {
    // fetch the Y.js document from somewhere
    // return loadFromDatabase(data.documentName) ||
    // createInitialDocTemplate();
    console.log("onload");
    const now = new Date();
    const b64 = await importJournal(now);
    console.log(b64 + " onload");
    if (b64) {
      var u8 = new Uint8Array(Buffer.from(b64, "base64"));
      const ydoc = new Y.Doc();
      Y.applyUpdate(ydoc, u8);
      return ydoc;
    } else return new Y.Doc();
  },
  async onStoreDocument(data) {
    console.log("onstore");
    const documentState = Y.encodeStateAsUpdate(data.document);
    var b64 = Buffer.from(documentState).toString("base64");
    console.log(b64);
    const now = new Date();
    const journal = await importJournal(now);
    console.log("is journal ? " + journal);
    if (journal) {
      updateJournal(now, documentState);
    }
    if (!journal) {
      storeJournal(b64);
    }
  },

  // async onChange(data) {
  //   const save = () => {
  //     // Convert the y-doc to something you can actually use in your views.
  //     // In this example we use the TiptapTransformer to get JSON from the given
  //     // ydoc.
  //     const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document);
  //     console.log("change");

  //     // Save your document. In a real-world app this could be a database query
  //     // a webhook or something else
  //     // console.log(prosemirrorJSON);

  //     // Maybe you want to store the user who changed the document?
  //     // Guess what, you have access to your custom context from the
  //     // onConnect hook here. See authorization & authentication for more
  //     // details
  //   };

  //   debounced?.clear();
  //   debounced = debounce(save, 4000);
  //   debounced();
  // },
});

const runMongoose = async () => {
  try {
    const response = await mongoose.connect(uri);
    if (response) {
      console.log("connected : running hocuspocus");
      server.listen();
    }
  } catch (error) {
    console.log(error);
  }
  // console.log(response.JSON());
};
runMongoose();
