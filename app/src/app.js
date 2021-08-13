const express = require('express');
const app = express();
let a;
const port = 3000;
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});

app.use((err, req, res, next) => {
  res.local.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});
