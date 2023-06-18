const { Server } = require("@hocuspocus/server");

const express = require("express");
const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200/",
  auth: {
    username: "elastic",
    password: "s*h7x*0pi9KTqPpkB7XP",
  },
});

// const app = express();

// const port = 3001;

// app.listen(port, () => {
//   console.log("Server running on port 3001");
// });

const server = Server.configure({
  name: "hp",
  port: 1234,
  // timeout: 30000,
  // debounce: 5000,
  // maxDebounce: 30000,
  // quiet: true,
  async onConnect(data) {
    // Output some information
    console.log(`New websocket connection`);
  },
  async connected() {
    console.log("connections:", server.getConnectionsCount());
  },
});

// … and run it!
server.listen();

const createTitle = async () => {
  const { response } = await client.create({
    index: "titles-from-node",
    id: 11,
    body: {
      title: "My First title",
      author: "Steevy",
      date: new Date(),
    },
  });
};

// createTitle().catch(console.log);

async function getTitle() {
  const mySearch = await client.get({
    index: "titles-from-node",
    id: 11,
  });
  console.log(mySearch);
}

// getTitle().catch(console.log);

async function updateTitle() {
  const { response } = await client.update({
    index: "titles-from-node",
    id: 11,
    body: {
      doc: {
        title: "Awsome title",
      },
    },
  });
}

// updateTitle().catch(console.log);
// getTitle().catch(console.log);

async function createTitles() {
  const { response } = await client.bulk({ body: body, refresh: true });

  if (response) {
    console.log(response.errors);
  }
}

// createTitles().catch(console.log);

async function countTitles() {
  const { body } = await client.count({
    index: "titles",
  });

  console.log(
    await client.count({
      index: "titles",
    })
  );
}

// countTitles().catch(console.log);

async function searchTitles() {
  const response = await client.search({
    index: "titles",
    body: {
      query: {
        match: {
          title: "Fashion",
        },
      },
    },
  });

  console.log(response.hits.hits);
}

// searchTitles().catch(console.log);
