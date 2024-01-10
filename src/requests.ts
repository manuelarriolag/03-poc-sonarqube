import {
    Artifact,
    Component, ComponentListResponse, ComponentResponse, ComponentTreeResponse, Issue, IssueResponse, Measure, Qualifier
} from "./types";

const componentMetrics: string[] = [
    'blocker_violations',
    'critical_violations',
    'major_violations',
    'complexity',
    'cognitive_complexity',
    'coverage',
    'sqale_rating',
    'reliability_rating',
    'security_hotspots_reviewed',
    'security_rating',
    'comment_lines_density',
    'lines',
    'ncloc',
    'quality_gate_details',
    'alert_status',
    'duplicated_lines_density',
];

const artifactMetrics: string[] = [
    'blocker_violations',
    'critical_violations',
    'major_violations',
    'complexity',
    'cognitive_complexity',
    'coverage',
    'comment_lines_density',
    'lines',
    'ncloc',
    'duplicated_lines_density',
];

export async function getMeasuresByArtifact(
    url: string,
    requestOptions: RequestInit,
    componentKey: string,
    processDate: string
): Promise<Measure[]> {
    const endpoint = '/api/measures/component_tree';
    const queryParams = `component=${componentKey}&metricKeys=${artifactMetrics.join(',')}`;
    const fullUrl = `${url}${endpoint}?${queryParams}`;
    return fetch(fullUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Response status (${response.status}) was not ok`);
            }
            return response.json();
        })
        .then(result => {
            try {
                const response: ComponentTreeResponse = result as ComponentTreeResponse;
                if (!response.components) {
                    console.log('WARN', `No hay Components en la respuesta de "${componentKey}"`);
                    console.log('fullUrl', fullUrl);
                    return [];
                }
                const allMeasures: Measure[] = [];
                response.components.map(artifact => {
                    if (!artifact.measures) {
                        console.log('WARN', `No hay Measures en la respuesta de "${componentKey}", Artifact: "${artifact.key}"`);
                        console.log('fullUrl', fullUrl);
                    } else {
                        artifact.measures.map(measure => {
                            measure.processDate = processDate;
                            measure.componentKey = componentKey;
                            measure.artifactKey = artifact.key;
                            measure.qualifier = artifact.qualifier;
                            measure.bestValue = measure.bestValue ?? false;
                            allMeasures.push(measure);
                        });
                    }
                });
                return allMeasures;
            } catch (error) {
                console.log('ERROR en el try', error);
                console.log('result: ', result);
                return [];
            }
        })
        .catch((error) => {
            console.log('ERROR en el catch', error);
            return [];
        });
};

export async function getMeasuresByComponent(
    url: string,
    requestOptions: RequestInit,
    componentKey: string,
    processDate: string
): Promise<Measure[]> {
    const endpoint = '/api/measures/component';
    const queryParams = `component=${componentKey}&metricKeys=${componentMetrics.join(',')}`;
    return fetch(`${url}${endpoint}?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            try {
                const response: ComponentResponse = result as ComponentResponse;
                if (!response.component) {
                    console.log('WARN', `No hay Component en la respuesta de "${componentKey}"`);
                    return [];
                }
                if (!response.component.measures) {
                    console.log('WARN', `No hay Measures en la respuesta de "${componentKey}"`);
                    return [];
                }
                const measures = response.component.measures.map(measure => {
                    measure.processDate = processDate;
                    measure.componentKey = componentKey;
                    measure.bestValue = measure.bestValue ?? false;
                    return measure;
                });
                return measures;
            } catch (error) {
                console.log('ERROR en el try', error);
                console.log('result: ', result);
                return [];
            }
        })
        .catch((error) => {
            console.log('ERROR en el catch', error);
            return [];
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

export async function getComponentIssues(
    url: string,
    requestOptions: RequestInit,
    componentKey: string,
    processDate: string
): Promise<Issue[]> {
    const endpoint = '/api/issues/search';

    const queryParams = `componentKeys=${componentKey}`;
    return fetch(`${url}${endpoint}?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const response: IssueResponse = result as IssueResponse;
            const issues = response.issues.map(issue => {
                issue.processDate = processDate;
                issue.componentKey = componentKey;
                return issue;
            });
            return issues;
        });
};

