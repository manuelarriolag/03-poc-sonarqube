import 'dotenv/config'
import { getComponentList, getComponentMeasures } from './requests';
import jsonexport from 'jsonexport';
import fs from 'fs';
import { Component, Measure } from './types';

(async () => {

    try {
        const url: string = process.env.URL as string;

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: [
                ["Authorization", process.env.TOKEN as string],
            ]
        };

        fs.mkdirSync(`${__dirname}/out`);

        const listComponents: Component[] = await getComponentList(url, requestOptions)
            .then(comps => {
                comps = comps.filter(item => item.key.startsWith('gd-'));
                //console.log('Components------');
                jsonexport(comps, (err, csv) => {
                    if (err) return console.error(err);
                    const filename = `${__dirname}/out/components.csv`;
                    // fs.writeFile(filename, csv, function (err) {
                    //     if (err) return console.error(err);
                    //     console.log(filename + ' saved');
                    // });
                    fs.writeFileSync(filename, csv);                    
                    console.log(filename + ' saved');
                });

                return comps;
            });

        const allPromisesForMeasures: Promise<Measure[]>[] = [];
        listComponents.map(comp => {
            const prom = getComponentMeasures(url, requestOptions, comp.key)
                .then(measures => {
                    jsonexport(measures, (err, csv) => {
                        if (err) return console.error(err);
                        const filename = `${__dirname}/out/measures.${comp.key}.csv`;
                        fs.writeFileSync(filename, csv);                    
                        console.log(filename + ' saved');
                    });
                    return measures;
                });
            allPromisesForMeasures.push(prom);
        });

        await Promise.all(allPromisesForMeasures);
        console.log(':::: DONE ::::')

    } catch (error) {
        console.log('Errors: ', error);
    }

})();