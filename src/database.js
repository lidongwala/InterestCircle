const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/interestcircle')
.then(() => console.log('Connected to database'))
.catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});

module.exports = mongoose;