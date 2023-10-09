const MLKMeans = require('ml-kmeans');

function performKMeansClustering(data, k)
{
    for (let nbr = 0; nbr < 270; nbr++)
    {
        let sum = 0;
        for (const i in  k)
        {
            if ( k[i][nbr]) sum +=  k[i][nbr];
        }
        for (const i in  k)
        {
            if ( k[i][nbr])  k[i][nbr] = Math.floor( k[i][nbr] / sum * 30);
        }
    }

    for (const i in data) {
        for (const j in data[i]) {
            if (!data[i][j]) continue;
    
            // Ensure k[i][j] is within a valid range (1 to number of points)
            const maxK = Math.min(data[i][j].length, 30); // Set a maximum value for _k, in this case, 30
            const _k = Math.max(1, Math.min(k[i][j], maxK));
    
            const clusters = MLKMeans.kmeans(data[i][j], _k);
            data[i][j] = clusters.centroids;
        }
    }    

    return data;
}

module.exports = {
    performKMeansClustering
};
