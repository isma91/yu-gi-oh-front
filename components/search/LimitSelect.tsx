import Select from "@components/field/Select";
import { MenuItem } from "@mui/material";

type SearchLimitPropsType = {
    name?: string;
    error?: string;
    label?: string;
    valueArray: number[];
    limitState: [number, React.Dispatch<React.SetStateAction<number>>];
};

export default function SearchLimitSelect(props: SearchLimitPropsType): React.JSX.Element {
    const { valueArray } = props;
    const [limit, setLimit] = props.limitState;
    let name = "limit";
    if (props.name !== undefined) {
        name = props.name;
    }
    let label = "Limit";
    if (props.label !== undefined) {
        label = props.label;
    }
    return (
        <Select
            name={name}
            error={props.error}
            label={label}
            loading={false}
            defaultValue={limit}
            onChange={(e) => setLimit(parseInt(e.target.value, 10))}
        >
            {valueArray.map((v, k) => {
                return (
                    <MenuItem key={`limit-${v}-${k}`} value={v}>
                        {`Limit ${v}`}
                    </MenuItem>
                );
            })}
        </Select>
    );
}
