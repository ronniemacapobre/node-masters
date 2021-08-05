const express = require('express');
const app = express();
const port = 3000;
const { eventRouter, memberRouter } = require('./routers');

app.use(express.json());
app.use('/events', eventRouter);
app.use('/members', memberRouter);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
