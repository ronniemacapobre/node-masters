const express = require('express');
const app = express();
const port = 3000;
const { eventRouter, memberRouter, attendanceRouter } = require('./routers');
const appLogger = require('./utilities/appLogger');

app.use(express.json());
app.use(appLogger);
app.use('/events', eventRouter);
app.use('/members', memberRouter);
app.use('/attendance', attendanceRouter);
app.use((err, req, res, next) => {
  const { statusCode, errorMessage } = err;

  if (!statusCode)
    return res
      .status(500)
      .send(
        'Oopps! Something went wrong to the app. Please contact administrator.'
      );

  res.status(statusCode).send(errorMessage);
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
