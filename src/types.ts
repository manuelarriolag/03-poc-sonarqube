
export interface ComponentResponse {
    component: Component;
}

export interface Component {
    key:       string;
    name:      string;
    qualifier: Qualifier;
    measures:  Measure[];
}

export interface Measure {
    processDate: string;
    componentKey: string;
    metric:    string;
    value:     string;
    bestValue: boolean;
}

export interface ComponentListResponse {
    paging:     Paging;
    components: Component[];
}

export enum Qualifier {
    Trk = "TRK",
}

export interface Paging {
    pageIndex: number;
    pageSize:  number;
    total:     number;
}


export interface ProjectStatusResponse {
    projectStatus: ProjectStatus;
    //errors: 
}

export interface ProjectStatus {
    processDate:       string;
    componentKey:      string;
    status:            string;
    conditions:        Condition[];
    ignoredConditions: boolean;
    period:            Period;
    caycStatus:        string;
}

export interface ProjectStatusFormatted {
    processDate:       string;
    componentKey:      string;
    status:            string;
    ignoredConditions: boolean;
    periodMode:        string;
    periodDate:        string;
    caycStatus:        string;
}

export interface Condition {
    processDate:    string;
    componentKey:   string;
    status:         string;
    metricKey:      string;
    comparator:     string;
    errorThreshold: string;
    actualValue:    string;
}

export interface Period {
    mode: string;
    date: string;
}
