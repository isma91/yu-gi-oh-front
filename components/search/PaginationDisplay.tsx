import { IconPositionEnumType } from "@app/types/Input";
import Button from "@components/field/Button";
import { Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GenericStyles from "@app/css/style";

type SearchPaginationDisplayProps = {
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    allResultCount: number;
    limit: number;
    entity: string;
};

export default function SearchPaginationDisplay(props: SearchPaginationDisplayProps) {
    const { limit, allResultCount, entity } = props;
    const [offset, setOffset] = props.offsetState;
    const genericClasses = GenericStyles();
    const currentPage = offset + 1;
    const numTotalPage = Math.ceil(allResultCount / limit);
    const disablePreviousPageButton = currentPage <= 1;
    const disableNextPageButton = currentPage >= numTotalPage;
    return (
        <Grid item xs={12} container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={4}>
                <Button
                    loading={false}
                    icon={<ArrowBackIcon />}
                    iconPosition={IconPositionEnumType.START}
                    disabled={disablePreviousPageButton}
                    onClick={(e) => {
                        if (offset >= 1) {
                            setOffset(offset - 1);
                        }
                    }}
                >
                    previous page
                </Button>
            </Grid>
            <Grid item xs={4}>
                <Typography
                    component="p"
                    className={genericClasses.textAlignCenter}
                >{`Page ${currentPage}/${numTotalPage} of ${allResultCount} total ${entity}`}</Typography>
            </Grid>
            <Grid item xs={4}>
                <Button
                    loading={false}
                    icon={<ArrowForwardIcon />}
                    iconPosition={IconPositionEnumType.END}
                    disabled={disableNextPageButton}
                    onClick={(e) => {
                        if (offset <= numTotalPage) {
                            setOffset(offset + 1);
                        }
                    }}
                >
                    next page
                </Button>
            </Grid>
        </Grid>
    );
}
