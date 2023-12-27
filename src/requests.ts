import { Component, ComponentListResponse, ComponentResponse, Measure, Qualifier } from "./types";

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
            const response: ComponentResponse = result as ComponentResponse;
            const measures = response.component.measures.map(measure => {
                //console.log(measure);
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
            // console.log(response);
            // response.component.measures.map( measure => {
            //     console.log(measure);
            // });
            return response.components;
        });
};
