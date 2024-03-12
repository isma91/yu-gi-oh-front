export type DashboardMenuItemElementParentType = {
    name: string;
    path: string;
    parentPath?: string;
    logo: React.JSX.Element;
};

export type DashboardMenuItemElementChildrenType = Omit<DashboardMenuItemElementParentType, "logo">;

export type DashboardMenuItemElementType = DashboardMenuItemElementParentType & {
    children?: DashboardMenuItemElementChildrenType[]
};