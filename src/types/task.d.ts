declare type TaskTableState = {
	total: number;
	page: number;
	pageSize: number;
	filterParams: EmptyObjectType;
	tableLoading: boolean;
	tableData: EmptyObjectType[];
	searchData: TableSearchType[];
};

declare type gitActionState = {
	visible: boolean;
	type: string;
	data: EmptyObjectType;
};
