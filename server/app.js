const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use('/', routes);
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
