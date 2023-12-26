import { Component, ComponentListResponse, ComponentResponse, Measure, Qualifier } from "./types";

export async function getComponentMeasures( 
    url:string,
    requestOptions:RequestInit, 
    componentName:string
):Promise<Component> {
    const endpoint = '/api/measures/component';
    const metrics = 'bugs,code_smells,ncloc,complexity,violations';
    const queryParams = `component=${componentName}&metricKeys=${metrics}`;
    return fetch(`${url}${endpoint}?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const response:ComponentResponse = result as ComponentResponse;
            // console.log(response);
            // response.component.measures.map( measure => {
            //     console.log(measure);
            // });
            return response.component;
        });
};

export async function getComponentList( 
    url:string,
    requestOptions:RequestInit 
):Promise<Component[]> {
    const endpoint = '/api/components/search';
    const queryParams = `qualifiers=${ Qualifier.Trk }`;
    return fetch(`${url}${endpoint}?${queryParams}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const response:ComponentListResponse = result as ComponentListResponse;
            // console.log(response);
            // response.component.measures.map( measure => {
            //     console.log(measure);
            // });
            return response.components;
        });
};
