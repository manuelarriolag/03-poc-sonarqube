import 'dotenv/config'
import { getMeasuresByArtifact, getComponentList, getMeasuresByComponent, getComponentIssues } from './requests';
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
        const { listComponents, filenameForComponents }: getComponentsResult = await getComponents({ outputDir, url, requestOptions });

        // Get Measures
        const filenameForComponentMeasures:string = await getAllComponentMeasures({ outputDir, listComponents, url, requestOptions, processDate });

        // Get Artifacts
        const filenameForArtifactMeasures:string = await getAllArtifactMeasures({ outputDir, listComponents, url, requestOptions, processDate });

        // // Get Issues
        // const filenameForIssues:string = await getAllIssues(outputDir, listComponents, url, requestOptions, processDate);

        // Remove duplicated headers and empty lines
        cleanContent(filenameForComponents);
        cleanContent(filenameForComponentMeasures);
        cleanContent(filenameForArtifactMeasures);
        // cleanContent(filenameForIssues);

        // Copy files to postgresql-data directory (created or overwritten by default)
        copyContent(outputDir, filenameForComponents);
        copyContent(outputDir, filenameForComponentMeasures);
        copyContent(outputDir, filenameForArtifactMeasures);
        // copyContent(outputDir, filenameForIssues);

    } catch (error) {
        console.log('Global Error: ', error);
    }

})();


interface getArtifactsParams {
    outputDir: string;
    listComponents: Component[];
    url: string;
    requestOptions: RequestInit;
    processDate: string;
}

async function getAllIssues(outputDir: string, listComponents: Component[], url: string, requestOptions: RequestInit, processDate: string) {
    console.log(':::: GET Issues ::::');
    const filenameForIssues = `${outputDir}/sonarqube.issues.csv`;
    const allPromisesForIssues: Promise<Issue[]>[] = [];
    listComponents.map(comp => {
        const prom = getComponentIssues(url, requestOptions, comp.key, processDate)
            .then(issue => {
                const options = {
                    includeHeaders: false,
                    headerPathString: '_',
                    headers: ['processDate', 'componentKey', 'metric', 'value', 'bestValue']
                };
                jsonexport(issue, options, (err, csv) => {
                    if (err) return console.error(err);
                    fs.appendFileSync(filenameForIssues, csv + '\n');
                    //console.log(filenameForIssue + ' updated');
                });
                //console.log(issue);
                return issue;
            });
        allPromisesForIssues.push(prom);
    });

    await Promise.all(allPromisesForIssues);
    console.log(':::: DONE Issues ::::');

    return filenameForIssues;
}

async function getAllArtifactMeasures({ outputDir, listComponents, url, requestOptions, processDate }: getArtifactsParams): Promise<string> {
    console.log(':::: GET ArtifactMeasures ::::');
    const filenameForArtifact = `${outputDir}/sonarqube.artifact-measures.csv`;
    const allPromisesForArtifact: Promise<Measure[]>[] = [];
    listComponents.map(comp => {
        const prom = getMeasuresByArtifact(url, requestOptions, comp.key, processDate)
            .then(measures => {
                const options = {
                    includeHeaders: false,
                    headerPathString: '_',
                    headers: ['processDate', 'componentKey', 'artifactKey', 'qualifier', 'metric', 'value', 'bestValue']
                };
                jsonexport(measures, options, (err, csv) => {
                    if (err) return console.error(err);
                    fs.appendFileSync(filenameForArtifact, csv + '\n');                    
                });
                // console.log(measures);
                return measures;
            });
        allPromisesForArtifact.push(prom);
    });

    await Promise.all(allPromisesForArtifact);
    console.log(':::: DONE ArtifactMeasures ::::');
    return filenameForArtifact;
}

interface getMeasuresParams {
    outputDir: string;
    listComponents: Component[];
    url: string;
    requestOptions: RequestInit;
    processDate: string;
}

async function getAllComponentMeasures({ outputDir, listComponents, url, requestOptions, processDate }: getMeasuresParams): Promise<string> {
    console.log(':::: GET ComponentMeasures ::::');
    const filenameForMeasures = `${outputDir}/sonarqube.component-measures.csv`;
    const allPromisesForMeasures: Promise<Measure[]>[] = [];
    listComponents.map(comp => {
        const prom = getMeasuresByComponent(url, requestOptions, comp.key, processDate)
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
    console.log(':::: DONE ComponentMeasures ::::')

    return filenameForMeasures;
}

interface getComponentsParams {
    outputDir: string;
    url: string;
    requestOptions: RequestInit;
}
interface getComponentsResult {
    listComponents: Component[];
    filenameForComponents: string;
}

async function getComponents({ outputDir, url, requestOptions }: getComponentsParams): Promise<getComponentsResult> {
    console.log(':::: GET Components (Projects) ::::');
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
    console.log(':::: DONE Components (Projects) ::::');
    return { listComponents, filenameForComponents };
}

