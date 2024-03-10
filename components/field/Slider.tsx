import React, { useState } from "react";
import { Slider as SliderMUI } from "@mui/material";

export type SliderValueRangeType = [number, number];

export type SliderValueType = SliderValueRangeType | number;

type SliderColorType = "primary" | "secondary" | "error" | "info" | "success" | "warning";

type SliderPropsType = {
    name: string;
    label: string;
    isValueExternal?: boolean;
    valueState?: [SliderValueType, React.Dispatch<React.SetStateAction<SliderValueType>>];
    isRange?: true;
    onChange?: (event: Event, value: SliderValueType, activeThumb: number) => void;
    color?: SliderColorType;
    minRange?: number;
    step?: number;
    valueMin?: number;
    valueMax?: number;
    displayMarks?: boolean;
};

type SliderOptionType = {
    min?: number;
    max?: number;
};

export default function Slider<T extends SliderValueType>(props: SliderPropsType): React.JSX.Element {
    const { name, label } = props;
    let isValueExternal = false;
    if (props.isValueExternal !== undefined) {
        isValueExternal = props.isValueExternal;
    }
    const isRange = props.isRange !== undefined;
    let initialeVale: T;
    if (isRange === false) {
        initialeVale = 0 as T;
    } else {
        initialeVale = [0, 1] as T;
    }
    let minRange: number = 1;
    if (isRange === true && props.minRange !== undefined) {
        minRange = props.minRange;
    }
    let value: T;
    let setValue: React.Dispatch<React.SetStateAction<T>>;
    if (isValueExternal === true && props.valueState !== undefined) {
        [value, setValue] = props.valueState as any;
    } else {
        [value, setValue] = useState<T>(initialeVale);
    }
    let color: SliderColorType = "primary";
    if (props.color !== undefined) {
        color = props.color;
    }
    let step: number = 1;
    if (props.step !== undefined) {
        step = props.step;
    }

    let sliderOption: SliderOptionType = {};
    if (props.valueMin !== undefined) {
        sliderOption.min = props.valueMin;
    }
    if (props.valueMax !== undefined) {
        sliderOption.max = props.valueMax;
    }

    let displayMarks = false;
    if (props.displayMarks !== undefined) {
        displayMarks = props.displayMarks;
    }

    const handleChange = (event: Event, v: T | any, activeThumb: number) => {
        //When we have a ranged slider, we mandatory have a minimum range
        if (isRange === true && minRange !== null) {
            const [v0, v1] = v as SliderValueRangeType;
            if (activeThumb === 0) {
                /**
                 * Sometimes v[0] don't respect the minRange difference between v[0] & v[1]
                 * So we check if v[0] is really behind v[1] - minRange
                 */
                const newMin = Math.min(v0, v1 - minRange);
                setValue([newMin, v1] as T);
            } else {
                /**
                 * We check if v[1] is really not behind v[0] + minRange
                 * To respect the minRange value as v[0] & v[1] must have at least minRange difference
                 */
                const newMax = Math.max(v1, v0 + minRange);
                setValue([v0, newMax] as T);
            }
        } else {
            setValue(v);
        }
        if (props.onChange !== undefined) {
            props.onChange(event, v, activeThumb);
        }
    };

    return (
        <SliderMUI
            name={name}
            getAriaLabel={() => label}
            value={value}
            onChange={handleChange}
            color={color}
            disableSwap={isRange}
            step={step}
            valueLabelDisplay="auto"
            marks={displayMarks}
            {...sliderOption}
        />
    );
}
