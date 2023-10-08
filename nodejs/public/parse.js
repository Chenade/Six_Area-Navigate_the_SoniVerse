let limit = {
    'optical': {ra: {min: null, max: null}, dec: {min: null, max: null}, mpro: {min: null, max: null}},
    'near-infrared': {ra: {min: null, max: null}, dec: {min: null, max: null}, mpro: {min: null, max: null}},
    'mid-infrared': {ra: {min: null, max: null}, dec: {min: null, max: null}, mpro: {min: null, max: null}},
    'far-infrared': {ra: {min: null, max: null}, dec: {min: null, max: null}, mpro: {min: null, max: null}},
};
let processedContents = {
    'optical': [],
    'near-infrared': [],
    'mid-infrared': [],
    'far-infrared': []
};

document.getElementById('parse_wise').addEventListener('change', handleWise, false);
document.getElementById('parse_ztf').addEventListener('change', handleZDF, false);
document.getElementById('parse_2mass').addEventListener('change', handle2mass, false);
document.getElementById('parse_spiter').addEventListener('change', handleSpiter, false);

function getLimit(value, _limit)
{
    if (_limit.ra.min == null || _limit.ra.min > value[0]) {
        _limit.ra.min = value[0];
    }
    if (_limit.ra.max == null || _limit.ra.max < value[0]) {
        _limit.ra.max = value[0];
    }

    if (_limit.dec.min == null || _limit.dec.min > value[1]) {
        _limit.dec.min = value[1];
    }
    if (_limit.dec.max == null || _limit.dec.max < value[1]) {
        _limit.dec.max = value[1];
    }

    if (_limit.mpro.min == null || _limit.mpro.min > value[2]) {
        _limit.mpro.min = value[2];
    }
    if (_limit.mpro.max == null || _limit.mpro.max < value[2]) {
        _limit.mpro.max = value[2];
    }
}

function parseWise(contents)
{
    const databaseLine = contents.match(/^\\DATABASE = (.+)$/m);
    const databaseValue = databaseLine ? databaseLine[1].trim() : null;
    
    if (!databaseValue || !databaseValue.includes("allwise_p3as_psd"))
    {
        alert("Database value does not contain 'allwise_p3as_psd'.");
    }
    else
    {
        const lines = contents.split('\n');
        let tables = '';

        for (const line of lines) {
            if (!line.startsWith('\\')) {
                tables += line + '\n';
            }
        }

        const rows = tables.split('\n');

        const headerRow = rows[0].trim().split('|');
        for(const i in headerRow) {
            headerRow[i] = headerRow[i].trim();
        }

        const raIndex = headerRow.indexOf('ra') - 1;
        const decIndex = headerRow.indexOf('dec') - 1;
        const ph_qualIndex = headerRow.indexOf('ph_qual') - 1;
        const cc_flagsIndex = headerRow.indexOf('cc_flags') - 1;

        const w1satIndex = headerRow.indexOf('w1sat') - 1;
        const w1snrIndex = headerRow.indexOf('w1snr') - 1;
        const w1mproIndex = headerRow.indexOf('w1mpro') - 1;

        const w2satIndex = headerRow.indexOf('w2sat') - 1;
        const w2snrIndex = headerRow.indexOf('w2snr') - 1;
        const w2mproIndex = headerRow.indexOf('w2mpro') - 1;

        const w3satIndex = headerRow.indexOf('w3sat') - 1;
        const w3snrIndex = headerRow.indexOf('w3snr') - 1;
        const w3mproIndex = headerRow.indexOf('w3mpro') - 1;

        const w4satIndex = headerRow.indexOf('w4sat') - 1;
        const w4snrIndex = headerRow.indexOf('w4snr') - 1;
        const w4mproIndex = headerRow.indexOf('w4mpro') - 1;

        for (let i = 4; i < rows.length; i++)
        {
            const columns = rows[i].trim().split(/\s+/);
            const ra = parseFloat(columns[raIndex]);
            const dec = parseFloat(columns[decIndex]);
            const ph_qual = columns[ph_qualIndex];
            const cc_flags = columns[cc_flagsIndex];

            const w1mpro = parseFloat(columns[w1mproIndex]);
            const w1sat = parseFloat(columns[w1satIndex]);
            const w1snr = parseFloat(columns[w1snrIndex]);

            const w2mpro = parseFloat(columns[w2mproIndex]);
            const w2sat = parseFloat(columns[w2satIndex]);
            const w2snr = parseFloat(columns[w2snrIndex]);

            const w3mpro = parseFloat(columns[w3mproIndex]);
            const w3sat = parseFloat(columns[w3satIndex]);
            const w3snr = parseFloat(columns[w3snrIndex]);

            const w4mpro = parseFloat(columns[w4mproIndex]);
            const w4sat = parseFloat(columns[w4satIndex]);
            const w4snr = parseFloat(columns[w4snrIndex]);

            if (processedContents['mid-infrared'] == null) {
                processedContents['mid-infrared'] = [];
            }
            // if (ph_qual != null && (ph_qual[0] == 'A')
            //     && cc_flags == "0000" && w1sat < 0.08 && w1snr > 5)
            // {
            //     processedContents['mid-infrared'].push({"ra":ra, "dec": dec, "wavelength": w1mpro});
            //     getLimit([ra, dec, w1mpro], limit['mid-infrared']);
            // }

            if (ph_qual != null && (ph_qual[1] == 'A')
                && cc_flags == "0000" && w2sat < 0.1 && w2snr > 5)
            {
                processedContents['mid-infrared'].push({"ra":ra, "dec": dec, "wavelength": w2mpro});
                getLimit([ra, dec, w2mpro], limit['mid-infrared']);
            }

            // if (ph_qual != null && (ph_qual[2] == 'A')
            //     && cc_flags == "0000" && w3sat < 0.1 && w3snr > 5)
            // {
            //     processedContents['mid-infrared'].push({"ra":ra, "dec": dec, "wavelength": w3mpro});
            //     getLimit([ra, dec, w3mpro], limit['mid-infrared']);
            // }

            // if (ph_qual != null && (ph_qual[3] == 'A')
            //     && cc_flags == "0000" && w4sat < 0.1 && w4snr > 5)
            // {
            //     processedContents['mid-infrared'].push({"ra":ra, "dec": dec, "wavelength": w4mpro});
            //     getLimit([ra, dec, w4mpro], limit['mid-infrared']);
            // }
        }
        printData(processedContents, limit, 'mid-infrared');
    }
}

function handleWise(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const contents = e.target.result;
        parseWise(contents);
    };
    reader.readAsText(file);
}

function handleZDF(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const contents = e.target.result;
        const databaseLine = contents.match(/^\\DATABASE = (.+)$/m);
        const databaseValue = databaseLine ? databaseLine[1].trim() : null;
        
        if (!databaseValue || !databaseValue.includes("ZTF"))
        {
            alert("Database value does not contain 'ZTF'.");
        }
        else
        {
            const lines = contents.split('\n');
            let tables = '';

            for (const line of lines) {
                if (!line.startsWith('\\')) {
                    tables += line + '\n';
                }
            }

            const rows = tables.split('\n');

            const headerRow = rows[0].trim().split('|');
            for(const i in headerRow) {
                headerRow[i] = headerRow[i].trim();
            }
            
            const raIndex = headerRow.indexOf('ra') - 1;
            const decIndex = headerRow.indexOf('dec') - 1;
            const refmagIndex = headerRow.indexOf('refmag') - 1;
            const refsnrIndex = headerRow.indexOf('refsnr') - 1;
            const nobsIndex = headerRow.indexOf('nobs') - 1;
            const ngoodobsIndex = headerRow.indexOf('ngoodobs') - 1;
            const astrometricrmsIndex = headerRow.indexOf('astrometricrms') - 1;
            const vonneumannratioIndex = headerRow.indexOf('vonneumannratio') - 1;
            const filtercodeIndex = headerRow.indexOf('filtercode') - 1;

            for (let i = 4; i < rows.length; i++)
            {
                const columns = rows[i].trim().split(/\s+/);
                const ra = parseFloat(columns[raIndex]);
                const dec = parseFloat(columns[decIndex]);
                const refmag = parseFloat(columns[refmagIndex]);

                const refsnr = parseFloat(columns[refsnrIndex]);
                const nobs = parseFloat(columns[nobsIndex]);
                const ngoodobs = parseFloat(columns[ngoodobsIndex]);
                const astrometricrms = parseFloat(columns[astrometricrmsIndex]);
                const vonneumannratio = parseFloat(columns[vonneumannratioIndex]);
                const filtercode = columns[filtercodeIndex];

                if (refsnr > 5 && nobs > 3 && ngoodobs > 3 && astrometricrms <= 0.3 && vonneumannratio > 0.7 && vonneumannratio < 1.3 && filtercode == 'zg')
                {
                    if (processedContents['optical'] == null) {
                        processedContents['optical'] = [];
                    }
                    processedContents['optical'].push({"ra":ra, "dec": dec, "wavelength": refmag});
                    getLimit([ra, dec, refmag], limit['optical']);
                }
            }
            printData(processedContents, limit, 'optical');
        }

    };
    reader.readAsText(file);
}

function handle2mass(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const contents = e.target.result;
        const databaseLine = contents.match(/^\\DATABASE = (.+)$/m);
        const databaseValue = databaseLine ? databaseLine[1].trim() : null;
        
        if (!databaseValue || !databaseValue.includes("2MASS"))
        {
            alert("Database value does not contain '2MASS'.");
        }
        else
        {
            const lines = contents.split('\n');
            let tables = '';

            for (const line of lines) {
                if (!line.startsWith('\\')) {
                    tables += line + '\n';
                }
            }

            const rows = tables.split('\n');

            const headerRow = rows[0].trim().split('|');
            for(const i in headerRow) {
                headerRow[i] = headerRow[i].trim();
            }
            
            const raIndex = headerRow.indexOf('ra') - 1;
            const decIndex = headerRow.indexOf('dec') - 1;
            const ph_qualIndex = headerRow.indexOf('ph_qual') - 1;
            const rd_flgIndex = headerRow.indexOf('rd_flg') - 1;
            const bl_flgIndex = headerRow.indexOf('bl_flg') - 1;
            const cc_flgIndex = headerRow.indexOf('cc_flg') - 1;
            const err_majIndex = headerRow.indexOf('err_maj') - 1;

            const j_snrIndex = headerRow.indexOf('j_snr') - 1;
            const j_cmsigIndex = headerRow.indexOf('j_cmsig') - 1;
            const j_mIndex = headerRow.indexOf('j_m') - 1;
            
            const h_snrIndex = headerRow.indexOf('h_snr') - 1;
            const h_cmsigIndex = headerRow.indexOf('h_cmsig') - 1;
            const h_mIndex = headerRow.indexOf('h_m') - 1;

            const k_snrIndex = headerRow.indexOf('k_snr') - 1;
            const k_cmsigIndex = headerRow.indexOf('k_cmsig') - 1;
            const k_mIndex = headerRow.indexOf('k_m') - 1;

            for (let i = 4; i < rows.length; i++)
            {
                const columns = rows[i].trim().split(/\s+/);
                const ra = parseFloat(columns[raIndex]);
                const dec = parseFloat(columns[decIndex]);
                const ph_qual = columns[ph_qualIndex];
                const rd_flg = columns[rd_flgIndex];
                const bl_flg = columns[bl_flgIndex];
                const cc_flg = columns[cc_flgIndex];
                const err_maj = parseFloat(columns[err_majIndex]);

                const j_snr = parseFloat(columns[j_snrIndex]);
                const j_cmsig = parseFloat(columns[j_cmsigIndex]);
                const j_m = parseFloat(columns[j_mIndex]);
                if (j_snr > 5 && j_cmsig < 0.1 && (ph_qual[0] == 'A' || ph_qual[0] == 'B') && rd_flg[0] <= 6 && bl_flg[0] <= 7 && cc_flg[0] == 0 && err_maj < 0.08)
                {
                    if (processedContents['near-infrared'] == null) {
                        processedContents['near-infrared'] = [];
                    }
                    processedContents['near-infrared'].push({"ra":ra, "dec": dec, "wavelength": j_m});
                    getLimit([ra, dec, j_m], limit['near-infrared']);
                }

                // const h_snr = parseFloat(columns[h_snrIndex]);
                // const h_cmsig = parseFloat(columns[h_cmsigIndex]);
                // const h_m = parseFloat(columns[h_mIndex]);
                // if (h_snr > 5 && h_cmsig < 0.1 && (ph_qual[1] == 'A' || ph_qual[1] == 'B' || ph_qual[1] == 'C') && rd_flg[1] <= 6 && bl_flg[1] <= 7 && cc_flg[1] == 0 && err_maj < 0.08)
                // {
                //     if (processedContents['near-infrared'] == null) {
                //         processedContents['near-infrared'] = [];
                //     }
                //     processedContents['near-infrared'].push({"ra":ra, "dec": dec, "wavelength": h_m});
                //     getLimit([ra, dec, h_m], limit['near-infrared']);
                // }

                // const k_snr = parseFloat(columns[k_snrIndex]);
                // const k_cmsig = parseFloat(columns[k_cmsigIndex]);
                // const k_m = parseFloat(columns[k_mIndex]);
                // if (k_snr > 5 && k_cmsig < 0.1 && (ph_qual[2] == 'A' || ph_qual[2] == 'B' || ph_qual[2] == 'C') && rd_flg[2] <= 6 && bl_flg[2] <= 7 && cc_flg[2] == 0 && err_maj < 0.08)
                // {
                //     if (processedContents['near-infrared'] == null) {
                //         processedContents['near-infrared'] = [];
                //     }
                //     processedContents['near-infrared'].push({"ra":ra, "dec": dec, "wavelength": k_m});
                //     getLimit([ra, dec, k_m], limit['near-infrared']);
                // }
            }
            printData(processedContents, limit, 'near-infrared');
        }

    };
    reader.readAsText(file);
}

function parseSpiter(contents)
{
    const databaseLine = contents.match(/^\\DATABASE = (.+)$/m);
    const databaseValue = databaseLine ? databaseLine[1].trim() : null;
    
    if (!databaseValue || !databaseValue.includes("iraspsc"))
    {
        alert("Database value does not contain 'iraspsc'.");
    }
    else
    {
        const lines = contents.split('\n');
        let tables = '';

        for (const line of lines) {
            if (!line.startsWith('\\')) {
                tables += line + '\n';
            }
        }

        const rows = tables.split('\n');

        const headerRow = rows[0].trim().split('|');
        for(const i in headerRow) {
            headerRow[i] = headerRow[i].trim();
        }
        
        const raIndex = headerRow.indexOf('ra');
        const decIndex = headerRow.indexOf('dec');
        const fqual_60Index = headerRow.indexOf('fqual_60');

        for (let i = 4; i < rows.length; i++)
        {
            const columns = rows[i].trim().split(/\s+/);
            const ra = parseFloat(columns[raIndex]);
            const dec = parseFloat(columns[decIndex]);
            const fqual_60 = parseFloat(columns[fqual_60Index]);

            processedContents['far-infrared'].push({"ra":ra, "dec": dec, "wavelength": fqual_60});
            getLimit([ra, dec, fqual_60 ], limit['far-infrared']);
        }
        printData(processedContents, limit, 'far-infrared');
    }
}

function handleSpiter(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const contents = e.target.result;
        parseSpiter(contents);
    };
    reader.readAsText(file);
}

function printData(processedContents, limit, category)
{
    let output = [];
    normalizeToUnitRange(processedContents, limit, output);
    sessionStorage.setItem(category, JSON.stringify(output[category]));
}

function normalizeToUnitRange(processedContents, limit, output)
{
    for (const i in processedContents)
    {
        output[i] = [];
        for (const j in processedContents[i])
        {
            let tmp = {};
            tmp.ra = (processedContents[i][j].ra - limit[i].ra.min) * 30 / (limit[i].ra.max - limit[i].ra.min) - 15;
            tmp.dec = (processedContents[i][j].dec - limit[i].dec.min) * 30 / (limit[i].dec.max - limit[i].dec.min) - 15;
            tmp.wavelength = (processedContents[i][j].wavelength - limit[i].mpro.min) * 30 / (limit[i].mpro.max - limit[i].mpro.min) - 15;
            output[i].push(tmp);
        }
    }
}
