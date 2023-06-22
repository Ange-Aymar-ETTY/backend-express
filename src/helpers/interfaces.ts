export interface IMailer {
    from?: string;
    to: string;
    subject: string;
    html?: string;
    attachments?: Array<IAttach>
}

export interface IAttach {
    filename: string;
    path: string;
    contentType: string;
}

export interface ITemplate {
    source: string;
    parameter?: object;
}

export interface DataTable {
    sort: any;
    order: any;
    page: any;
    size: any;
    dataFilter: TableFilter;
}
export interface TableFilter {
    filter: boolean;
    [propName: string]: any;
}