
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
    Dir = "DIR",
    Fil = "FIL",
    Trk = "TRK",
}

export interface Paging {
    pageIndex: number;
    pageSize:  number;
    total:     number;
}


export interface IssueResponse {
    total:       number;
    p:           number;
    ps:          number;
    paging:      Paging;
    effortTotal: number;
    issues:      Issue[];
    components:  File[];
    facets:      any[];
}

export interface File {
    key:       string;
    enabled:   boolean;
    qualifier: Qualifier;
    name:      string;
    longName:  string;
    path?:     string;
}

export interface Issue {
    processDate:        string;
    componentKey:       string;
    key:                string;
    rule:               string;
    severity:           Severity;
    component:          string;
    project:            string;
    hash:               string;
    textRange:          TextRange;
    flows:              Flow[];
    resolution?:        string;
    status:             Status;
    message:            string;
    effort:             string;
    debt:               string;
    assignee:           string;
    author:             string;
    tags:               Tag[];
    creationDate:       string;
    updateDate:         string;
    closeDate?:         string;
    type:               Type;
    scope:              string;
    quickFixAvailable:  boolean;
    messageFormattings: any[];
    line?:              number;
}

export interface Flow {
    locations: Location[];
}

export interface Location {
    component:      string;
    textRange:      TextRange;
    msg:            string;
    msgFormattings: any[];
}

export interface TextRange {
    startLine:   number;
    endLine:     number;
    startOffset: number;
    endOffset:   number;
}

export enum Severity {
    Critical = "CRITICAL",
    Major = "MAJOR",
    Minor = "MINOR",
}

export enum Status {
    Closed = "CLOSED",
    Open = "OPEN",
}

export enum Tag {
    BrainOverload = "brain-overload",
    Confusing = "confusing",
    Convention = "convention",
    Cwe = "cwe",
    Serialization = "serialization",
    Unused = "unused",
}

export enum Type {
    Bug = "BUG",
    CodeSmell = "CODE_SMELL",
}



export interface ComponentTreeResponse {
    paging:        Paging;
    baseComponent: BaseComponent;
    components:    Artifact[];
}

export interface BaseComponent {
    key:       string;
    name:      string;
    qualifier: string;
    measures:  Measure[];
}

export enum Metric {
    BlockerViolations = "blocker_violations",
    CognitiveComplexity = "cognitive_complexity",
    Complexity = "complexity",
    Coverage = "coverage",
    CriticalViolations = "critical_violations",
    DuplicatedLinesDensity = "duplicated_lines_density",
    MajorViolations = "major_violations",
    ReliabilityRating = "reliability_rating",
    SecurityRating = "security_rating",
    SqaleRating = "sqale_rating",
}

export interface Artifact {
    key:       string;
    name:      string;
    qualifier: Qualifier;
    path:      string;
    measures:  Measure[];
    language?: string;
}

// export enum Language {
//     Java = "java",
// }
