import {
    Artifact,
    Component, ComponentListResponse, ComponentResponse, ComponentTreeResponse, Issue, IssueResponse, Measure, Qualifier
} from "./types";

const metrics: string[] = [
    'blocker_violations',
    'critical_violations',
    'major_violations',
    'complexity',
    'cognitive_complexity',
    'coverage',
    'sqale_rating',
    'reliability_rating',
    'security_hotspots_reviewed',
    //'security_review_rating',
    'security_rating',
    'comment_lines_density',
    'lines',
    'ncloc',
    'quality_gate_details',
    'alert_status',
    'duplicated_lines_density',
];


export async function getArtifactMeasures(
    url: string,
    requestOptions: RequestInit,
    componentKey: string,
    processDate: string
): Promise<Artifact[]> {
    const endpoint = '/api/measures/component_tree';
    const queryParams = `component=${componentKey}&metricKeys=${metrics.join(',')}`;
    return fetch(`${url}${endpoint}?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const response: ComponentTreeResponse = result as ComponentTreeResponse;
            const artifacts = response.components.map(artifact => {
                const measures = artifact.measures.map(measure => {
                    measure.processDate = processDate;
                    measure.componentKey = componentKey;
                    measure.bestValue = measure.bestValue ?? false;
                    return measure;
                });
                artifact.measures = measures;
                return artifact;
            });
            return artifacts;
        });
};

export async function getComponentMeasures(
    url: string,
    requestOptions: RequestInit,
    componentKey: string,
    processDate: string
): Promise<Measure[]> {
    const endpoint = '/api/measures/component';
    const queryParams = `component=${componentKey}&metricKeys=${metrics.join(',')}`;
    return fetch(`${url}${endpoint}?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const response: ComponentResponse = result as ComponentResponse;
            const measures = response.component.measures.map(measure => {
                measure.processDate = processDate;
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

