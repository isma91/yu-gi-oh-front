import React, { useState, useEffect } from "react";
import { Grid, Collapse, MenuItem, Typography } from "@mui/material";
import Button from "@components/field/Button";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { IconPositionEnumType } from "@app/types/Input";
import { ArchetypeGetAllType } from "@app/types/entity/Archetype";
import { CardAttributeGetAllType } from "@app/types/entity/CardAttribute";
import { CategoryGetAllType } from "@app/types/entity/Category";
import { PropertyTypeGetAllType } from "@app/types/entity/PropertyType";
import { SubPropertyTypeGetAllType } from "@app/types/entity/SubPropertyType";
import { SubTypeGetAllType } from "@app/types/entity/SubType";
import { TypeGetAllType } from "@app/types/entity/Type";
import Autocomplete from "@components/field/Autocomplete";
import Select from "@components/field/Select";
import { GetIndexArray } from "@utils/Parsing";
import Slider, { SliderValueRangeType, SliderValueType } from "@components/field/Slider";
import Switch from "@components/field/Switch";

type SearchCardFilterPropsType = {
    loadingForm: boolean;
    filterDataJson: SearchCardFilterFilterDataJsonType;
    errors: { [key in string]: string | undefined };
    cardPropertyRangeValueState: [SliderValueType, React.Dispatch<React.SetStateAction<SliderValueType>>];
};

type SearchCardFilterFilterDataJsonType = {
    archetype: { loading: boolean; data: ArchetypeGetAllType[] };
    cardAttribute: { loading: boolean; data: CardAttributeGetAllType[] };
    category: { loading: boolean; data: CategoryGetAllType[] };
    propertyType: { loading: boolean; data: PropertyTypeGetAllType[] };
    subPropertyType: { loading: boolean; data: SubPropertyTypeGetAllType[] };
    subType: { loading: boolean; data: SubTypeGetAllType[] };
    type: { loading: boolean; data: TypeGetAllType[] };
};

export default function SearchCardFilter(props: SearchCardFilterPropsType) {
    const { loadingForm, errors } = props;
    const { archetype, cardAttribute, category, propertyType, subPropertyType, subType, type } = props.filterDataJson;
    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<CategoryGetAllType | null>(null);
    const [selectedPropertyTypeId, setSelectedPropertyTypeId] = useState<number>(0);
    const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyTypeGetAllType | null>(null);
    const [selectedPropertyTypePropertyRange, setSelectedPropertyTypePropertyRange] = useState<SliderValueRangeType | null>(null);
    const [cardPropertyRangeValue, setCardPropertyRangeValue] = props.cardPropertyRangeValueState;
    const [selectedSubPropertyTypeId, setSelectedSubPropertyTypeId] = useState<number>(0);
    const [selectedSubPropertyType, setSelectedSubPropertyType] = useState<SubPropertyTypeGetAllType | null>(null);

    useEffect(() => {
        if (selectedCategoryId === 0) {
            setSelectedCategory(null);
        } else {
            const selectedCategoryIndex = GetIndexArray<CategoryGetAllType>(category.data, "id", selectedCategoryId);
            if (selectedCategoryIndex === null) {
                setSelectedCategory(null);
            } else {
                setSelectedCategory(category.data[selectedCategoryIndex]);
            }
        }
    }, [selectedCategoryId]);

    const resetSelectedPropertyState = () => {
        setSelectedPropertyTypePropertyRange(null);
        setSelectedPropertyType(null);
        setCardPropertyRangeValue([0, 12]);
    };

    useEffect(() => {
        if (selectedPropertyTypeId === 0) {
            resetSelectedPropertyState();
        } else {
            const selectedPropertyTypeIndex = GetIndexArray<PropertyTypeGetAllType>(propertyType.data, "id", selectedPropertyTypeId);
            if (selectedPropertyTypeIndex === null) {
                resetSelectedPropertyState();
            } else {
                let newPropertyValueArray: number[] = [];
                const newSelectedPropertyType = propertyType.data[selectedPropertyTypeIndex];
                setSelectedPropertyType(null);
                newSelectedPropertyType.properties.map((property) => {
                    newPropertyValueArray.push(parseInt(property.name, 10));
                });
                newPropertyValueArray = newPropertyValueArray.sort((a, b) => a - b);
                const firstEl = newPropertyValueArray[0];
                const lastEl = newPropertyValueArray[newPropertyValueArray.length - 1];
                setSelectedPropertyTypePropertyRange([firstEl, lastEl]);
                setSelectedPropertyType(newSelectedPropertyType);
            }
        }
    }, [selectedPropertyTypeId]);

    useEffect(() => {
        if (selectedSubPropertyTypeId === 0) {
            setSelectedSubPropertyType(null);
        } else {
            const selectedSubPropertyTypeIndex = GetIndexArray<SubPropertyTypeGetAllType>(subPropertyType.data, "id", selectedSubPropertyTypeId);
            if (selectedSubPropertyTypeIndex === null) {
                setSelectedSubPropertyType(null);
            } else {
                setSelectedSubPropertyType(subPropertyType.data[selectedSubPropertyTypeIndex]);
            }
        }
    }, [selectedSubPropertyTypeId]);

    const displayCategoryWithSubCategorySelect = (): React.JSX.Element => {
        return (
            <>
                <Grid item xs={12} md={6}>
                    <Select
                        name="category"
                        label="Card Type"
                        error={errors.category}
                        loading={category.loading}
                        optional
                        onChange={(e) => {
                            setSelectedCategory(null);
                            setSelectedCategoryId(parseInt(e.target.value, 10));
                        }}
                    >
                        {displayEmptyMenuItem("category")}
                        {category.data.map((categoryData, categoryKey) => {
                            return (
                                <MenuItem key={`category-${categoryData.id}-${categoryKey}`} value={categoryData.id}>
                                    {categoryData.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Grid>
                {selectedCategory !== null ? (
                    <Grid item xs={12} md={6}>
                        <Select name="subCategory" label="Card Sub Type" error={errors.subCategory} loading={category.loading} optional>
                            {displayEmptyMenuItem("subCategory", "")}
                            {selectedCategory.subCategories.map((subCategory, subCategoryKey) => {
                                return (
                                    <MenuItem key={`subCategory-${subCategory.id}-${subCategoryKey}`} value={subCategory.id}>
                                        {subCategory.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                ) : null}
            </>
        );
    };

    const displayPropertyTypeWithProperty = () => {
        return (
            <>
                <Grid item xs={12} md={6}>
                    <Select
                        name="propertyType"
                        label="Level Type"
                        error={errors.propertyType}
                        loading={propertyType.loading}
                        optional
                        onChange={(e) => {
                            resetSelectedPropertyState();
                            setSelectedPropertyTypeId(parseInt(e.target.value, 10));
                        }}
                    >
                        {displayEmptyMenuItem("propertyType")}
                        {propertyType.data.map((propertyTypeData, propertyTypeKey) => {
                            return (
                                <MenuItem key={`propertyType-${propertyTypeData.id}-${propertyTypeKey}`} value={propertyTypeData.id}>
                                    {propertyTypeData.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Grid>
                {selectedPropertyTypePropertyRange !== null && selectedPropertyType !== null ? (
                    <Grid item xs={12} md={6}>
                        <Typography component="p">{`${selectedPropertyType.name} Range`}</Typography>
                        <Slider
                            name="property"
                            label={`${selectedPropertyType.name} Range`}
                            isRange
                            valueMin={selectedPropertyTypePropertyRange[0]}
                            valueMax={selectedPropertyTypePropertyRange[1]}
                            step={1}
                            displayMarks={true}
                            isValueExternal={true}
                            valueState={[cardPropertyRangeValue, setCardPropertyRangeValue]}
                            minRange={0}
                        />
                    </Grid>
                ) : null}
            </>
        );
    };

    const displaySubPropertyTypeWithSubPropertySelect = (): React.JSX.Element => {
        return (
            <>
                <Grid item xs={12} md={6}>
                    <Select
                        name="subPropertyType"
                        label="Card Property"
                        error={errors.subPropertyType}
                        loading={subPropertyType.loading}
                        optional
                        onChange={(e) => {
                            setSelectedSubPropertyType(null);
                            setSelectedSubPropertyTypeId(parseInt(e.target.value, 10));
                        }}
                    >
                        {displayEmptyMenuItem("subPropertyType")}
                        {subPropertyType.data.map((subPropertyTypeData, subPropertyTypeKey) => {
                            return (
                                <MenuItem key={`subPropertyType-${subPropertyTypeData.id}-${subPropertyTypeKey}`} value={subPropertyTypeData.id}>
                                    {subPropertyTypeData.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Grid>
                {selectedSubPropertyType !== null ? (
                    <Grid item xs={12} md={6}>
                        <Select
                            name="subProperty"
                            label="Card Sub Property"
                            error={errors.subProperty}
                            loading={subPropertyType.loading}
                            optional
                            multiple
                        >
                            {selectedSubPropertyType.subProperties.map((subProperty, subPropertyKey) => {
                                return (
                                    <MenuItem key={`subProperty-${subProperty.id}-${subPropertyKey}`} value={subProperty.id}>
                                        {subProperty.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                ) : null}
            </>
        );
    };

    const displayEmptyMenuItem = (entityName: string, value: number | string = 0): React.JSX.Element => {
        return (
            <MenuItem key={`${entityName}-0-0`} value={value}>
                <em>empty</em>
            </MenuItem>
        );
    };

    return (
        <>
            <Grid item xs={12}>
                <Button
                    type="button"
                    loading={loadingForm}
                    onClick={(e) => setOpenFilter(!openFilter)}
                    icon={<FilterAltIcon />}
                    iconPosition={IconPositionEnumType.START}
                >
                    Filter
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Collapse in={openFilter} timeout="auto" unmountOnExit={true}>
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                name="autocomplete_archetype"
                                label="Archetype"
                                error={errors.archetype}
                                options={archetype.data}
                                optionLabel="name"
                                optionValue="id"
                                loading={archetype.loading}
                                multiple
                                optional
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Select
                                name="cardAttribute"
                                label="Attribute"
                                error={errors.cardAttribute}
                                loading={cardAttribute.loading}
                                multiple
                                optional
                            >
                                {cardAttribute.data.map((cardAttributeData, cardAttributeKey) => {
                                    {
                                        displayEmptyMenuItem("cardAttribute");
                                    }
                                    return (
                                        <MenuItem key={`cardAttribute-${cardAttributeData.id}-${cardAttributeKey}`} value={cardAttributeData.id}>
                                            {cardAttributeData.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Grid>
                        {displayCategoryWithSubCategorySelect()}
                        {displayPropertyTypeWithProperty()}
                        {displaySubPropertyTypeWithSubPropertySelect()}
                        <Grid item xs={12} md={6}>
                            <Select name="subType" label="Ability" error={errors.subType} loading={subType.loading} optional multiple>
                                {displayEmptyMenuItem("subType")}
                                {subType.data.map((subTypeData, subTypeKey) => {
                                    return (
                                        <MenuItem key={`subType-${subTypeData.id}-${subTypeKey}`} value={subTypeData.id}>
                                            {subTypeData.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                name="autocomplete_type"
                                label="Race"
                                error={errors.type}
                                options={type.data}
                                optionLabel="name"
                                optionValue="id"
                                loading={type.loading}
                                multiple
                                optional
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Select
                                name="isPendulum"
                                label="Is a PENDULUM ???"
                                error={errors.isPendulum}
                                loading={false}
                                optional
                                helperText="Leave empty if it's not a Monster"
                            >
                                {displayEmptyMenuItem("isPendulum", "null")}
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Select
                                name="isEffect"
                                label="Is an Effect Monster ??"
                                error={errors.isEffect}
                                loading={false}
                                optional
                                helperText="Leave empty if it's not a Monster"
                            >
                                {displayEmptyMenuItem("isEffect", "null")}
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>
                </Collapse>
            </Grid>
        </>
    );
}
