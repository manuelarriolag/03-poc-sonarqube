import 'dotenv/config'
import { getComponentList, getComponentMeasures, getProjectStatus } from './requests';
import jsonexport from 'jsonexport';
import fs from 'fs';
import { Component, Measure, ProjectStatus, ProjectStatusFormatted } from './types';

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

        // Get Measures
        console.log(':::: Get Measures ::::')
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
                        // const filename = `${__dirname}/out/measures.${comp.key}.csv`;
                        // fs.writeFileSync(filename, csv);                    
                        //console.log(filename + ' saved');
                        const filename = `${__dirname}/out/measures.csv`;
                        fs.appendFileSync(filename, csv + '\n');                    
                        console.log(filename + ' updated');
                    });
                    return measures;
                });
            allPromisesForMeasures.push(prom);
        });

        await Promise.all(allPromisesForMeasures);
        console.log(':::: DONE measures ::::')


        // Get ProjectStatuses
        console.log(':::: Get ProjectStatuses ::::')
        const allPromisesForProjectStatuses: Promise<ProjectStatus>[] = [];
        listComponents.map(comp => {
            const prom = getProjectStatus(url, requestOptions, comp.key)
                .then(projectStatus => {
                    // Store status  
                    const projectStatusFlat: ProjectStatusFormatted = {
                        processDate: projectStatus.processDate,
                        componentKey: projectStatus.componentKey,
                        status: projectStatus.status,
                        ignoredConditions: projectStatus.ignoredConditions,
                        periodMode: projectStatus.period.mode,
                        periodDate: projectStatus.period.date,
                        caycStatus: projectStatus.caycStatus,
                    }
                    const optionsForProjectStatus:jsonexport.UserOptions = { 
                        includeHeaders: false,
                        //headerPathString: '_',
                        verticalOutput: false,
                        headers: ['processDate', 'componentKey', 'status', 'ignoredConditions', 'periodMode', 'periodDate', 'caycStatus']
                    };
                    jsonexport(projectStatusFlat, optionsForProjectStatus, (err, csv) => {
                        if (err) return console.error(err);
                        // const filename = `${__dirname}/out/statuses.${comp.key}.csv`;
                        // fs.writeFileSync(filename, csv);                    
                        // console.log(filename + ' saved');
                        const filename = `${__dirname}/out/statuses.csv`;
                        fs.appendFileSync(filename, csv + '\n');                    
                        console.log(filename + ' updated');
                    });

                    // Store conditions  
                    const optionsForConditions:jsonexport.UserOptions = { 
                        includeHeaders: false,
                        //headerPathString: '_',
                        verticalOutput: false,
                        headers: ['processDate', 'componentKey', 'status', 'metricKey', 'comparator', 'errorThreshold', 'actualValue']
                    };
                    jsonexport(projectStatus.conditions, optionsForConditions, (err, csv) => {
                        if (err) return console.error(err);
                        const filename = `${__dirname}/out/conditions.csv`;
                        fs.appendFileSync(filename, csv + '\n');                    
                        console.log(filename + ' updated');
                    });
                    
                    return projectStatus;
                });
                allPromisesForProjectStatuses.push(prom);
        });

        await Promise.all(allPromisesForProjectStatuses);        
        console.log(':::: DONE ProjectStatuses ::::')

    } catch (error) {
        console.log('Errors: ', error);
    }

})();