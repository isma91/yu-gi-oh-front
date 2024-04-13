import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Table as TableMUI, TableHead, TableRow, TableCell, Typography, TableSortLabel, Skeleton, TableBody, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TableHeaderType, TableContentType, TableContentTypeType, TableContentValueType } from "@app/types/Table";
import GenericStyles from "@app/css/style";
import { useRouter } from "next/router";

type TablePropsType = {
    name: string;
    header: TableHeaderType[];
    content: Array<TableContentType[]>;
    loading: boolean;
    isEmptyMessage?: string;
};

enum OrderType {
    ASC = "asc",
    DESC = "desc",
}

type TableRowOptionType = {
    key: string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
    row: {
        "&:hover": {
            backgroundColor: theme.palette.third.main + "60",
        },
    },
}));

export default function Table(props: TablePropsType) {
    const { name, header, content, loading } = props;
    const genericClasses = GenericStyles();
    const classes = useStyles();
    const router = useRouter();
    const [order, setOrder] = useState<OrderType>(OrderType.ASC);
    const [orderBy, setOrderBy] = useState<string>("");
    const [body, setBody] = useState<Array<TableContentType[]>>([]);
    const getValueForComparator = useCallback(
        (array: TableContentType[]): TableContentValueType => {
            let response: TableContentValueType = "";
            for (let i = 0; i < array.length; i++) {
                const el = array[i];
                if (el.field === orderBy) {
                    response = el.search !== undefined ? el.search : el.value;
                }
            }
            return response;
        },
        [orderBy]
    );
    const comparator = useCallback(
        (a: TableContentType[], b: TableContentType[]): number => {
            if (orderBy !== "") {
                let response = 0;
                const valueA = getValueForComparator(a);
                const valueB = getValueForComparator(b);
                if (valueA === "" || valueB === "") {
                    return 0;
                } else if (valueA < valueB) {
                    response = -1;
                } else if (valueA > valueB) {
                    response = 1;
                }
                return order === OrderType.DESC ? -response : response;
            }
            return 0;
        },
        [getValueForComparator, order, orderBy]
    );
    let isEmptyMessage = "No element founded.";
    if (props.isEmptyMessage !== undefined && props.isEmptyMessage !== "") {
        isEmptyMessage = props.isEmptyMessage;
    }

    useEffect(() => {
        if (content.length !== 0) {
            const newContent: Array<[TableContentType[], number]> = content.map((el, index) => [el, index]);
            newContent.sort((a, b) => {
                const resultComparator = comparator(a[0], b[0]);
                if (resultComparator !== 0) {
                    return resultComparator;
                } else {
                    return a[1] - b[1];
                }
            });
            const newBody = newContent.map((el) => el[0]);
            setBody(newBody);
        } else {
            setBody([]);
        }
    }, [content, orderBy, order, comparator]);

    const getIndexBodyFromFieldNameAndValue = (arrayJson: TableContentType[], fieldName: string, fieldValue: string | number): number => {
        let response: number = -1;
        for (let i = 0; i < arrayJson.length; i++) {
            const el = arrayJson[i];
            if (el[fieldName as keyof TableContentType] === fieldValue) {
                response = i;
                break;
            }
        }
        return response;
    };

    const handleClickRow = (json: TableContentType) => {
        if (json.url !== undefined) {
            const { url } = json;
            if (json.newTab === true) {
                window.open(url, "_blank");
            } else {
                router.push(url);
            }
        }
    };

    const displayHeaderName = (name: string): React.JSX.Element => {
        return (
            <Typography component="span" className={genericClasses.bold}>
                {name}
            </Typography>
        );
    };

    const displayHeader = (): React.JSX.Element[] => {
        return header.map((v, k) => {
            const { field: headerField, name: headerName } = v;
            const headerKey = `table-${name}-header-${headerName}-k${k}`;
            return (
                <TableCell key={headerKey} sortDirection={orderBy === headerField ? order : false} align="center">
                    {v.noSort === undefined ? (
                        <TableSortLabel
                            active={orderBy === headerField}
                            direction={orderBy === headerField ? order : OrderType.ASC}
                            onClick={(e) => {
                                const isAsc = orderBy === headerField && order === OrderType.ASC;
                                setOrder(isAsc ? OrderType.DESC : OrderType.ASC);
                                setOrderBy(headerField);
                            }}
                        >
                            {displayHeaderName(headerName)}
                        </TableSortLabel>
                    ) : (
                        displayHeaderName(headerName)
                    )}
                </TableCell>
            );
        });
    };

    const displayBody = () => {
        return body.map((el, k) => {
            const indexRowAction = getIndexBodyFromFieldNameAndValue(el, "type", TableContentTypeType.ROWACTION);
            const indexButton = getIndexBodyFromFieldNameAndValue(el, "type", TableContentTypeType.BUTTON);
            let tableRowOption: TableRowOptionType = {
                key: `table-body-${name}-row-${k}`,
            };
            if (indexRowAction !== -1) {
                tableRowOption.className = genericClasses.cursorPointer + " " + classes.row;
                tableRowOption.onClick = (e) => handleClickRow(el[indexRowAction]);
            }
            return (
                <Fragment key={`fragment-table-body-${name}-row-${k}`}>
                    <TableRow {...tableRowOption}>
                        {header.map((headerEl, headerKey) => {
                            const elIndex = getIndexBodyFromFieldNameAndValue(el, "field", headerEl.field);
                            if (elIndex === -1) {
                                return null;
                            }
                            let type: TableContentTypeType = TableContentTypeType.TEXT;
                            const elContent: TableContentType = el[elIndex];
                            const { value: elContentValue } = elContent;
                            if (elContent.type !== undefined) {
                                type = elContent.type;
                            }
                            let classNameContent = "";
                            if (elContent.class !== undefined) {
                                classNameContent = elContent.class;
                            }
                            classNameContent += ` ${genericClasses.textAlignCenter}`;
                            const key = `table-body-${name}-${k}-${headerKey}`;
                            let jsxElValue: TableContentValueType = "";
                            if (type === TableContentTypeType.TEXT) {
                                jsxElValue = <Typography component="span">{elContentValue}</Typography>;
                            } else if (type === TableContentTypeType.ACTION) {
                                jsxElValue = elContentValue;
                            }
                            return (
                                <TableCell align="center" key={key} className={genericClasses.textAlignCenter}>
                                    {jsxElValue}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                    {indexButton !== -1 ? (
                        <TableRow key={`table-body-${name}-row-${k}-button`}>
                            <TableCell colSpan={header.length} sx={{ padding: "5px" }}>
                                {el[indexButton].value}
                            </TableCell>
                        </TableRow>
                    ) : null}
                </Fragment>
            );
        });
    };

    return loading ? (
        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
    ) : (
        <TableMUI>
            <TableHead>
                <TableRow>{displayHeader()}</TableRow>
            </TableHead>
            <TableBody>
                {body.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={header.length}>
                            <Typography component="p" className={genericClasses.italic + " " + genericClasses.textAlignCenter}>
                                {isEmptyMessage}
                            </Typography>
                        </TableCell>
                    </TableRow>
                ) : (
                    displayBody()
                )}
            </TableBody>
        </TableMUI>
    );
}
