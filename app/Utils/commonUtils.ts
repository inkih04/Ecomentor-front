//Returns value given an info item, named on map.ts
import colors from "@/app/Constants/colors";

export const getInfoItemValue = (items: { label: string; value: any }[], labelToFind: string): any => {
    return items.find(item => item.label === labelToFind)?.value ?? 0;
};

//Since certificate uses yes or no
export const getBooleanValue = (value: string): boolean => {
    return value === "Yes";
};

export const getComparisonColor = (value1: number | boolean, value2: number | boolean, isLowerBetter = false) => {
    if (value1 === value2) return "gray";

    if (typeof value1 === "boolean" || typeof value2 === "boolean") {
        // For Yes andNo comparisons
        return value1 === true ? (isLowerBetter ? colors.wrong : colors.right) : (isLowerBetter ? colors.right : colors.wrong);
    }

    // For numeric comparisons
    if (isLowerBetter) {
        return value1 < value2 ? colors.right : colors.wrong;
    } else {
        return value1 > value2 ? colors.right : colors.wrong;
    }
};