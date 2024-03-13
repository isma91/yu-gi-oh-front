import { DateFormatTypeType } from "@app/types/Date";
import { FulfillZero } from "@utils/String";

function TransformToDate(value: string | Date): Date {
    if (typeof value === "string") {
        return new Date(value);
    }
    return value;
}

export function GetFormat(value: string | Date, formatType: DateFormatTypeType = DateFormatTypeType.DATETIME): string {
    const date = TransformToDate(value);
    const year = date.getFullYear();
    const month = FulfillZero((date.getMonth() + 1));
    const day = FulfillZero(date.getDate());
    const hour = FulfillZero(date.getHours());
    const min = FulfillZero(date.getMinutes());
    const sec = FulfillZero(date.getSeconds());
    const dateFormatDate = `${year}-${month}-${day}`;
    const dateFormatTime = `${hour}:${min}:${sec}`;
    if (formatType === DateFormatTypeType.DATE) {
        return dateFormatDate;
    } else if (formatType === DateFormatTypeType.TIME) {
        return dateFormatTime;
    } else {
        return `${dateFormatDate} ${dateFormatTime}`;
    }
}