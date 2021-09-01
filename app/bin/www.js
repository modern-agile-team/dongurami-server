'use strict';

const app = require('../app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`${PORT}번에서 서버 시작`);
});
