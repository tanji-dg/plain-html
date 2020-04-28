const fs = require('fs');

fs.readFile('file.txt', 'utf8', function(err, data) {
    if (err) throw err;

    var count = (data.match(/,/g) || []).length + 1;

    console.log(count);
});