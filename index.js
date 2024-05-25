require('dotenv').config();

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const express = require('express');
const app = express();

app.use(express.json());

app.get('/bank/:accountNumber', async (req, res) => {
  try {
    const result = await client.get({
      index: 'bank',
      id: req.params.accountNumber,
    });

    console.log(result);

    return res.status(200).json(result.body);
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.get('/bank', async (req, res) => {
  const { body } = await client.search({
    index: 'bank',
    body: {
      query: { match_all: {} },
      sort: [{ account_number: "asc" }]
    }
  });

  return res.status(200).json({ count: body.hits.total.value, data: body.hits.hits });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
