
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
    componentKey: string;
    metric:    string;
    value:     string;
    bestValue: boolean;
}

export interface ComponentListResponse {
    paging:     Paging;
    components: Component[];
}

// export interface Component {
//     key:       string;
//     name:      string;
//     qualifier: Qualifier;
//     project:   string;
// }

export enum Qualifier {
    Trk = "TRK",
}

export interface Paging {
    pageIndex: number;
    pageSize:  number;
    total:     number;
}
