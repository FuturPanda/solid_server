const createTitle = async (obj) => {
  const { response } = await client.create(obj);
};

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

async function countTitles(indexName) {
  const { body } = await client.count({
    index: indexName,
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
