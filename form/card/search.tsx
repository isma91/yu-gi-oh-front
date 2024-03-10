"use client";
import React, { useState, useEffect, useContext } from "react";
import { Collapse, Grid } from "@mui/material";
import Form from "@components/util/Form";
import InputText from "@components/field/InputText";
import Button from "@components/field/Button";
import CardSearchRequest from "@api/Search/Card";
import { StoreContext } from "@app/lib/state-provider";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { CardSearchType } from "@app/types/entity/Card";
import { ArchetypeGetAllType } from "@app/types/entity/Archetype";
import { CardAttributeGetAllType } from "@app/types/entity/CardAttribute";
import { CategoryGetAllType } from "@app/types/entity/Category";
import { PropertyTypeGetAllType } from "@app/types/entity/PropertyType";
import { SubPropertyTypeGetAllType } from "@app/types/entity/SubPropertyType";
import { SubTypeGetAllType } from "@app/types/entity/SubType";
import { TypeGetAllType } from "@app/types/entity/Type";
import ArchetypeGetAllRequest from "@api/Archetype/GetAll";
import CardAttributeGetAllRequest from "@api/CardAttribute/GetAll";
import CategoryGetAllRequest from "@api/Category/GetAll";
import PropertyTypeGetAllRequest from "@api/PropertyType/GetAll";
import SubPropertyTypeGetAllRequest from "@api/SubPropertyType/GetAll";
import SubTypeGetAllRequest from "@api/SubType/GetAll";
import TypeGetAllRequest from "@api/Type/GetAll";
import { SortAscForArrayWithChildren, SortAscFromField } from "@utils/Array";
import SearchCardFilter from "@components/specialField/SearchCardFilter";
import { SliderValueRangeType, SliderValueType } from "@components/field/Slider";

type CardSearchFormPropsType = {
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    loadingFormState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    setCardAllResultCount: React.Dispatch<React.SetStateAction<number>>;
    setCardResult: React.Dispatch<React.SetStateAction<CardSearchType[]>>;
    searchLimit: React.JSX.Element;
    limit: number;
};

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    limit?: number;
    offset?: number;
    [key: string]: any;
};

export default function CardSearchForm(props: CardSearchFormPropsType): React.JSX.Element {
    const { setCardAllResultCount, setCardResult, searchLimit, limit } = props;
    const router = useRouter();
    const { state: globalState } = useContext(StoreContext);
    const [offset, setOffset] = props.offsetState;
    const [loadingForm, setLoadingForm] = props.loadingFormState;
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [archetype, setArchetype] = useState<ArchetypeGetAllType[]>([]);
    const [loadingArchetype, setLoadingArchetype] = useState<boolean>(true);
    const [skipArchetype, setSkipArchetype] = useState<boolean>(false);
    const [cardAttribute, setCardAttribute] = useState<CardAttributeGetAllType[]>([]);
    const [loadingCardAttribute, setLoadingCardAttribute] = useState<boolean>(true);
    const [skipCardAttribute, setSkipCardAttribute] = useState<boolean>(false);
    const [category, setCategory] = useState<CategoryGetAllType[]>([]);
    const [loadingCategory, setLoadingCategory] = useState<boolean>(true);
    const [skipCategory, setSkipCategory] = useState<boolean>(false);
    const [propertyType, setPropertyType] = useState<PropertyTypeGetAllType[]>([]);
    const [loadingPropertyType, setLoadingPropertyType] = useState<boolean>(true);
    const [skipPropertyType, setSkipPropertyType] = useState<boolean>(false);
    const [subPropertyType, setSubPropertyType] = useState<SubPropertyTypeGetAllType[]>([]);
    const [loadingSubPropertyType, setLoadingSubPropertyType] = useState<boolean>(true);
    const [skipSubPropertyType, setSkipSubPropertyType] = useState<boolean>(false);
    const [subType, setSubType] = useState<SubTypeGetAllType[]>([]);
    const [loadingSubType, setLoadingSubType] = useState<boolean>(true);
    const [skipSubType, setSkipSubType] = useState<boolean>(false);
    const [type, setType] = useState<TypeGetAllType[]>([]);
    const [loadingType, setLoadingType] = useState<boolean>(true);
    const [skipType, setSkipType] = useState<boolean>(false);
    const [cardPropertyRangeValue, setCardPropertyRangeValue] = useState<SliderValueType>([0, 12]);
    const { enqueueSnackbar } = useSnackbar();

    const sendCardSearchReq = async (data: object): Promise<void> => {
        return CardSearchRequest(data)
            .then((res) => {
                setCardAllResultCount(res.data.cardAllResultCount);
                setCardResult(res.data.card);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingForm(false);
            });
    };

    const fullfilValuesBeforeSendReq = (): ValuesType => {
        return { ...values, offset: offset, limit: limit, property: (cardPropertyRangeValue as SliderValueRangeType).join(",") };
    };

    const launchSendCardSearchReq = (resetOffset: boolean = true) => {
        setLoadingForm(true);
        if (resetOffset === true) {
            setOffset(0);
        }
        const newValues = fullfilValuesBeforeSendReq();
        setLoadingForm(false);
        sendCardSearchReq(newValues);
    };

    const getAllArchetype = async () => {
        return ArchetypeGetAllRequest()
            .then((res) => {
                setArchetype(SortAscFromField<ArchetypeGetAllType>(res.data.archetype));
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingArchetype(false);
                setSkipArchetype(true);
            });
    };

    const getAllCardAttribute = async () => {
        return CardAttributeGetAllRequest()
            .then((res) => {
                setCardAttribute(SortAscFromField<CardAttributeGetAllType>(res.data.cardAttribute));
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingCardAttribute(false);
                setSkipCardAttribute(true);
            });
    };

    const getAllCategory = async () => {
        return CategoryGetAllRequest()
            .then((res) => {
                setCategory(SortAscForArrayWithChildren<CategoryGetAllType>(res.data.category, "subCategories"));
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingCategory(false);
                setSkipCategory(true);
            });
    };

    const getAllPropertyType = async () => {
        return PropertyTypeGetAllRequest()
            .then((res) => {
                setPropertyType(SortAscFromField<PropertyTypeGetAllType>(res.data.propertyType));
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingPropertyType(false);
                setSkipPropertyType(true);
            });
    };

    const getAllSubPropertyType = async () => {
        return SubPropertyTypeGetAllRequest()
            .then((res) => {
                setSubPropertyType(SortAscForArrayWithChildren<SubPropertyTypeGetAllType>(res.data.subPropertyType, "subProperties"));
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingSubPropertyType(false);
                setSkipSubPropertyType(true);
            });
    };

    const getAllSubType = async () => {
        return SubTypeGetAllRequest()
            .then((res) => {
                setSubType(SortAscFromField<SubTypeGetAllType>(res.data.subType));
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingSubType(false);
                setSkipSubType(true);
            });
    };

    const getAllType = async () => {
        return TypeGetAllRequest()
            .then((res) => {
                setType(SortAscFromField<TypeGetAllType>(res.data.type));
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingType(false);
                setSkipType(true);
            });
    };

    useEffect(() => {
        if (globalState.user !== null && skipArchetype === false) {
            getAllArchetype();
        }
    }, [globalState, skipArchetype]);

    useEffect(() => {
        if (globalState.user !== null && skipCardAttribute === false) {
            getAllCardAttribute();
        }
    }, [globalState, skipCardAttribute]);

    useEffect(() => {
        if (globalState.user !== null && skipCategory === false) {
            getAllCategory();
        }
    }, [globalState, skipCategory]);

    useEffect(() => {
        if (globalState.user !== null && skipPropertyType === false) {
            getAllPropertyType();
        }
    }, [globalState, skipPropertyType]);

    useEffect(() => {
        if (globalState.user !== null && skipSubPropertyType === false) {
            getAllSubPropertyType();
        }
    }, [globalState, skipSubPropertyType]);

    useEffect(() => {
        if (globalState.user !== null && skipSubType === false) {
            getAllSubType();
        }
    }, [globalState, skipSubType]);

    useEffect(() => {
        if (globalState.user !== null && skipType === false) {
            getAllType();
        }
    }, [globalState, skipType]);

    useEffect(() => {
        if (
            loadingForm === false &&
            (loadingArchetype === true ||
                loadingCardAttribute === true ||
                loadingCategory === true ||
                loadingPropertyType === true ||
                loadingSubPropertyType === true ||
                loadingSubType === true ||
                loadingType === true)
        ) {
            setLoadingForm(true);
        }
        if (
            loadingForm === true &&
            loadingArchetype === false &&
            loadingCardAttribute === false &&
            loadingCategory === false &&
            loadingPropertyType === false &&
            loadingSubPropertyType === false &&
            loadingSubType === false &&
            loadingType === false
        ) {
            setLoadingForm(false);
        }
    }, [loadingArchetype, loadingCardAttribute, loadingCategory, loadingPropertyType, loadingSubPropertyType, loadingSubType, loadingType]);

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            launchSendCardSearchReq();
        }
    }, [values, errors]);

    useEffect(() => {
        launchSendCardSearchReq();
    }, [limit]);

    useEffect(() => {
        launchSendCardSearchReq(false);
    }, [offset]);

    return (
        <Form
            setValues={setValues}
            setErrors={setErrors}
            fields={[
                "name",
                "autocomplete_archetype",
                "cardAttribute",
                "category",
                "subCategory",
                "propertyType",
                "subPropertyType",
                "subProperty",
                "subType",
                "autocomplete_type",
                "isPendulum",
            ]}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InputText name="name" error={errors.name} optional />
                </Grid>
                <Grid item xs={12}>
                    {searchLimit}
                </Grid>
                <Grid item xs={12} container spacing={2}>
                    <SearchCardFilter
                        loadingForm={loadingForm}
                        errors={errors}
                        filterDataJson={{
                            archetype: { loading: loadingArchetype, data: archetype },
                            cardAttribute: { loading: loadingCardAttribute, data: cardAttribute },
                            category: { loading: loadingCategory, data: category },
                            propertyType: { loading: loadingPropertyType, data: propertyType },
                            subPropertyType: { loading: loadingSubPropertyType, data: subPropertyType },
                            subType: { loading: loadingSubType, data: subType },
                            type: { loading: loadingType, data: type },
                        }}
                        cardPropertyRangeValueState={[cardPropertyRangeValue, setCardPropertyRangeValue]}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loadingForm}>Search Card</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
