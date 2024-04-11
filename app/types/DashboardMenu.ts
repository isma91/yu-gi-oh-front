export type DashboardMenuItemElementParentType = {
    name: string;
    path: string;
    parentPath?: string;
    logo: React.JSX.Element;
    isAdmin?: boolean;
};

export type DashboardMenuItemElementChildrenType = Omit<DashboardMenuItemElementParentType, "logo" | "parentPath" | "isAdmin">;

export type DashboardMenuItemElementType = DashboardMenuItemElementParentType & {
    children?: DashboardMenuItemElementChildrenType[]
};