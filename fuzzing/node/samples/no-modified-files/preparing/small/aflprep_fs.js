(function() {
  const fs = require('fs');
  if (fs.readFile) {
    process.stdout.write('fs loaded successfully');
  }
})();
