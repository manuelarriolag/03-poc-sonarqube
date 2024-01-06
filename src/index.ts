import 'dotenv/config'
import { getComponentList, getComponentMeasures, getProjectStatus } from './requests';
import jsonexport from 'jsonexport';
import fs from 'fs';
import { Component, Measure, ProjectStatus, ProjectStatusFormatted } from './types';
import { cleanContent } from './utils';

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

        // Get Components (Projects)
        console.log(':::: GET Components (Projects) ::::')
        const filenameForComponents = `${__dirname}/out/sonarqube.components.csv`;
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
        const filenameForMeasures = `${__dirname}/out/sonarqube.measures.csv`;
        const allPromisesForMeasures: Promise<Measure[]>[] = [];
        listComponents.map(comp => {
            const prom = getComponentMeasures(url, requestOptions, comp.key)
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


        // // Get ProjectStatuses
        // console.log(':::: GET Statuses + Conditions ::::')
        // const filenameForStatuses = `${__dirname}/out/sonarqube.statuses.csv`;
        // const filenameForConditions = `${__dirname}/out/sonarqube.conditions.csv`;
        // const allPromisesForProjectStatuses: Promise<ProjectStatus>[] = [];
        // listComponents.map(comp => {
        //     const prom = getProjectStatus(url, requestOptions, comp.key)
        //         .then(projectStatus => {

        //             // Store status  
        //             const projectStatusFlat: ProjectStatusFormatted = {
        //                 processDate: projectStatus.processDate,
        //                 componentKey: projectStatus.componentKey,
        //                 status: projectStatus.status,
        //                 ignoredConditions: projectStatus.ignoredConditions,
        //                 //periodMode: projectStatus.period.mode,
        //                 //periodDate: projectStatus.period.date,
        //                 caycStatus: projectStatus.caycStatus,
        //             }
        //             const optionsForProjectStatus:jsonexport.UserOptions = { 
        //                 includeHeaders: false,
        //                 //headerPathString: '_',
        //                 verticalOutput: false,
        //                 headers: ['processDate', 'componentKey', 'status', 'ignoredConditions', 'periodMode', 'periodDate', 'caycStatus']
        //             };
        //             jsonexport(projectStatusFlat, optionsForProjectStatus, (err, csv) => {
        //                 if (err) return console.error(err);
        //                 fs.appendFileSync(filenameForStatuses, csv + '\n');                    
        //                 //console.log(filenameForStatuses + ' updated');
        //             });

        //             // Store conditions  
        //             const optionsForConditions:jsonexport.UserOptions = { 
        //                 includeHeaders: false,
        //                 //headerPathString: '_',
        //                 verticalOutput: false,
        //                 headers: ['processDate', 'componentKey', 'status', 'metricKey', 'comparator', 'errorThreshold', 'actualValue']
        //             };
        //             jsonexport(projectStatus.conditions, optionsForConditions, (err, csv) => {
        //                 if (err) return console.error(err);
        //                 fs.appendFileSync(filenameForConditions, csv + '\n');                    
        //                 //console.log(filenameForConditions + ' updated');
        //             });
                    
        //             return projectStatus;
        //         });
        //         allPromisesForProjectStatuses.push(prom);
        // });

        // await Promise.all(allPromisesForProjectStatuses);        
        // console.log(':::: DONE Statuses + Conditions ::::')

        // Remove duplicated headers and empty lines
        cleanContent(filenameForComponents);
        cleanContent(filenameForMeasures);
        // cleanContent(filenameForStatuses);
        // cleanContent(filenameForConditions);

    } catch (error) {
        console.log('Errors: ', error);
    }

})();

