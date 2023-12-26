import 'dotenv/config'
import { getComponentList, getComponentMeasures } from './requests';
import jsonexport from 'jsonexport';
import fs from 'fs';
import { Component, Measure } from './types';


(async () => {

    try {
        const url = 'https://sonar-digital.gc.gentera.com.mx';

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: [
                ["Authorization", process.env.TOKEN as string],
            ]
        };

        const listComponents = await getComponentList(url, requestOptions)
            .then(comps => {
                comps = comps.filter(item => item.key.startsWith('gd-'));

                console.log('Components------');
                jsonexport(comps, (err, csv) => {
                    if (err) return console.error(err);
                    const filename = 'components.output.csv';
                    fs.writeFile(filename, csv, function (err) {
                        if (err) return console.error(err);
                        console.log(filename + ' saved');
                    });
                });

                return comps;
            });

        const allPromisesForMeasures: Promise<Component>[] = [];
        listComponents.map(comp => {
            const prom = getComponentMeasures(url, requestOptions, comp.key)
                .then(data => {
                    jsonexport(data.measures, (err, csv) => {
                        if (err) return console.error(err);
                        const filename = `measures.${data.key}.csv`;
                        fs.writeFile(filename, csv, function (err) {
                            if (err) return console.error(err);
                            console.log(filename + ' saved');
                        });
        
                        // appendFileSync ???
                    });
                    
                    return data;
                });
            allPromisesForMeasures.push(prom);
        });

        Promise.all(allPromisesForMeasures);

    } catch (error) {
        console.log('Errors: ', error);
    }

})();