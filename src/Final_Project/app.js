const express = require('express');
const app = express();
const port = 3000;
const { eventRouter } = require('./routers');

app.use(express.json());
app.use('/events', eventRouter);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
