// Import the ml-kmeans library
import * as MLKMeans from 'ml-kmeans';

// Sample data points for clustering
const data = [
    [1, 2],
    [5, 8],
    [1.5, 1.8],
    [8, 8],
    [1, 0.6],
    [9, 11]
];

// Number of clusters (k)
const k = 2;

// Perform k-means clustering on the data
const clusters = MLKMeans.kmeans(data, k);

// Output the resulting clusters
console.log('Clusters:', clusters);
