import { 
    Component, ComponentListResponse, ComponentResponse, Measure, ProjectStatus, ProjectStatusResponse, Qualifier } from "./types";
import { formatISO } from "date-fns";
import { UTCDate } from "@date-fns/utc";


export async function getComponentMeasures(
    url: string,
    requestOptions: RequestInit,
    componentKey: string
): Promise<Measure[]> {
    const endpoint = '/api/measures/component';
    const metrics:string[] = [
        'blocker_violations',
        'cognitive_complexity',
        'coverage',
        'critical_violations',
        'complexity',
        'sqale_rating',
        'reliability_rating',
        'security_hotspots_reviewed',
        'security_rating',
        'comment_lines_density',
        'lines',
        'ncloc',
        'quality_gate_details',
        'alert_status',
    ];

    const queryParams = `component=${componentKey}&metricKeys=${metrics.join(',')}`;
    return fetch(`${url}${endpoint}?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const utcNow = new UTCDate(new Date());
            const isoStr:string = formatISO(utcNow, { format: 'basic' });
            const response: ComponentResponse = result as ComponentResponse;
            const measures = response.component.measures.map(measure => {
                measure.processDate = isoStr;
                measure.componentKey = componentKey;
                measure.bestValue = measure.bestValue ?? false;
                return measure;
            });
            return measures;
        });
};

export async function getComponentList(
    url: string,
    requestOptions: RequestInit
): Promise<Component[]> {
    const endpoint = '/api/components/search';
    const queryParams = `qualifiers=${Qualifier.Trk}`;
    return fetch(`${url}${endpoint}?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const response: ComponentListResponse = result as ComponentListResponse;
            return response.components;
        });
};

export async function getProjectStatus(
    url: string,
    requestOptions: RequestInit,
    projectKey: string
): Promise<ProjectStatus> {
    const endpoint = '/api/qualitygates/project_status';
    const queryParams = `projectKey=${projectKey}`;
    const finalUrl = `${url}${endpoint}?${queryParams}`;
    //console.log('finalUrl', finalUrl);
    return fetch(finalUrl, requestOptions)
        .then(response => response.json())
        .then(result => {
            //console.log('result', result);
            const utcNow = new UTCDate(new Date());
            const isoStr:string = formatISO(utcNow, { format: 'basic' });
            const response: ProjectStatusResponse = result as ProjectStatusResponse;
            response.projectStatus.processDate = isoStr;
            response.projectStatus.componentKey = projectKey;
            const conditions = response.projectStatus.conditions.map(cond => {
                cond.processDate = isoStr;
                cond.componentKey = projectKey;
                return cond;
            });
            response.projectStatus.conditions = conditions;
            return response.projectStatus;
        });
};

