const path = require('path');

module.exports = {
    mode: 'development', // or 'production'
    entry: './public/kmeans.js',  // Specify the entry file of your k-means logic
    output: {
        filename: 'bundle.js',  // Output bundle file name
        path: path.resolve(__dirname, 'public')  // Output directory (same as your public folder)
    }
};
