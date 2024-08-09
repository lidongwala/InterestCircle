const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const app = express();
const authRoutes = require('./routes/auth');
const circleRoutes = require('./routes/circles');
const postRoutes = require('./routes/posts'); 
const notificationsRouter = require('./routes/notification');

require('./database');

app.use(cors());
app.use(bodyParser.json());
app.use(compression()); // Enable Gzip compression

app.use('/api', authRoutes);
app.use('/api', circleRoutes);
app.use('/api', postRoutes);
app.use('/api', notificationsRouter);

app.listen(3000, () => {
    console.log('服务器运行在端口 3000');
});