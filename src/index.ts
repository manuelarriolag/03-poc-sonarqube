import 'dotenv/config'
import { getComponentIssues, getComponentList, getComponentMeasures } from './requests';
import jsonexport from 'jsonexport';
import fs from 'fs';
import { Component, Issue, Measure } from './types';
import { cleanContent, copyContent } from './utils';
import { UTCDate } from '@date-fns/utc';
import { formatISO } from 'date-fns';

(async () => {

    try {
        const url: string = process.env.URL as string;
        const processDate:string = formatISO(new UTCDate(new Date()), { format: 'basic' });

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: [
                ["Authorization", process.env.TOKEN as string],
            ]
        };

        const outputDir = `${__dirname}/out`;
        fs.mkdirSync(outputDir);

        // Get Components (Projects)
        console.log(':::: GET Components (Projects) ::::')
        const filenameForComponents = `${outputDir}/sonarqube.components.csv`;
        const listComponents: Component[] = await getComponentList(url, requestOptions)
            .then(comps => {
                comps = comps.filter(item => item.key.startsWith('gd-'));
                jsonexport(comps, (err, csv) => {
                    if (err) return console.error(err);
                    fs.writeFileSync(filenameForComponents, csv);                    
                    //console.log(filenameComponents + ' saved');
                });

                return comps;
            });
        console.log(':::: DONE Components (Projects) ::::')

        // Get Measures
        console.log(':::: GET Measures ::::')
        const filenameForMeasures = `${outputDir}/sonarqube.measures.csv`;
        const allPromisesForMeasures: Promise<Measure[]>[] = [];
        listComponents.map(comp => {
            const prom = getComponentMeasures(url, requestOptions, comp.key, processDate)
                .then(measures => {
                    const options = { 
                        includeHeaders: false,
                        headerPathString: '_',
                        headers: ['processDate', 'componentKey', 'metric', 'value', 'bestValue']
                    };
                    jsonexport(measures, options, (err, csv) => {
                        if (err) return console.error(err);
                        fs.appendFileSync(filenameForMeasures, csv + '\n');                    
                        //console.log(filenameForMeasures + ' updated');
                    });
                    return measures;
                });
            allPromisesForMeasures.push(prom);
        });

        await Promise.all(allPromisesForMeasures);
        console.log(':::: DONE Measures ::::')

        // // Get Issue
        // console.log(':::: GET Issues ::::')
        // const filenameForIssue = `${outputDir}/sonarqube.issue.csv`;
        // const allPromisesForIssue: Promise<Issue[]>[] = [];
        // listComponents.map(comp => {
        //     const prom = getComponentIssues(url, requestOptions, comp.key, processDate)
        //         .then(issue => {
        //             const options = { 
        //                 includeHeaders: false,
        //                 headerPathString: '_',
        //                 headers: ['processDate', 'componentKey', 'metric', 'value', 'bestValue']
        //             };
        //             jsonexport(issue, options, (err, csv) => {
        //                 if (err) return console.error(err);
        //                 fs.appendFileSync(filenameForIssue, csv + '\n');                    
        //                 //console.log(filenameForIssue + ' updated');
        //             });
        //             //console.log(issue);
        //             return issue;
        //         });
        //     allPromisesForIssue.push(prom);
        // });

        // await Promise.all(allPromisesForIssue);
        // console.log(':::: DONE Issues ::::')

        // Remove duplicated headers and empty lines
        cleanContent(filenameForComponents);
        cleanContent(filenameForMeasures);

        // Copy files to postgresql-data directory (created or overwritten by default)
        copyContent(outputDir, filenameForComponents);
        copyContent(outputDir, filenameForMeasures);

    } catch (error) {
        console.log('Errors: ', error);
    }

})();

