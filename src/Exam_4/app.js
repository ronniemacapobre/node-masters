const express = require('express');
const app = express();
const port = 3000;
const { userRouter } = require('./routers');

app.use(express.json());
app.use('/users', userRouter);
app.use((err, req, res, next) => {
  if (req.xhr) res.status(500).send({ error: 'Something failed!' });
  else next(err);
});
app.use((err, req, res, next) => {
  res.status(500);
  res.render('error'), { error: err };
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
