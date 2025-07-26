import { useCallback, useEffect, useReducer, useState } from "react"
import { fetchHistoricData, HistoricDataProps, LocationFilter } from "../Services/certificates/service"

import * as Historic from "@/app/Constants/historic"
import { shallowEqual } from "../Utils/object"
import { OneOf } from "../Utils/type";

interface HistoricDataUseProps {
    type: Historic.HistoricDatasetType;
    defaultLabel: string;
}

export type HistoricFetchProps = LocationFilter & {
    label: string;
    actionType: 'replace' | 'push';
}

export interface Data {
    label?: string;
    value: number;
}

export interface HistoricDataset {
    dataset: Data[];
    label: string;
    fetchProps: HistoricFetchProps;
}

const MAX_SIZE = 2;
export interface HistoricDataState {
    list: HistoricDataset[];
    index: number;
}

type HistoricDataStateAction = OneOf<{
    reset: HistoricDataset;
    replaceCurrent: HistoricDataset;
    push: HistoricDataset;
    next: boolean;
    prev: boolean;
    newIndex: number;
}>;



export const useHistoricData = function ({ type, defaultLabel }: HistoricDataUseProps) {
    const handleDataState = useCallback((state: HistoricDataState, action: HistoricDataStateAction): HistoricDataState => {
        if (action.reset !== undefined) {
            return { list: [action.reset], index: 0 };
        } else if (action.replaceCurrent !== undefined) {
            state.list[state.index] = action.replaceCurrent;
            return { ...state };
        } else if (action.push && state.list.length < MAX_SIZE) {
            state.list.push(action.push);
            return { ...state };
        } else if (action.next && state.index - 1 >= 0) {
            state.index--;
            return { ...state };
        } else if (action.prev && state.index + 1 < MAX_SIZE) {
            state.index++;
            return { ...state };
        } else if (action.newIndex !== undefined && action.newIndex >= 0 && action.newIndex < state.list.length) {
            state.index = action.newIndex;
            return { ...state };
        }

        return state;
    }, []);

    const [defaultDataset, setDefaultData] = useState<HistoricDataset | undefined>(undefined);
    const [state, dispatch] = useReducer(handleDataState, { list: [], index: -1 });
    const [fetchProps, setFetchProps] = useState<HistoricFetchProps>({ label: defaultLabel, actionType: 'push' });
    const [loading, setLoading] = useState(false);

    const defaultFetchProps = { type, groupBy: 'none' } as HistoricDataProps;

    // Fetch default type dataset
    useEffect(() => {
        setLoading(true);
        fetchHistoricData(defaultFetchProps)
            .then((data) => {
                if (data === undefined) return;

                const dataset: HistoricDataset = { dataset: data as Data[], label: defaultLabel, fetchProps };
                setDefaultData(dataset);
                dispatch({ reset: dataset });
            }).finally(() => setLoading(false));

    }, [type]);


    const canFetch = fetchProps.locationType !== undefined && fetchProps.locationOption !== undefined
        && fetchProps.locationOption !== 'All';

    useEffect(() => {
        if (!canFetch) {
            if (defaultDataset !== undefined && defaultDataset !== state.list.at(state.index))
                dispatch({ replaceCurrent: defaultDataset });

            return;
        }

        if (shallowEqual(state.list[state.index].fetchProps, fetchProps))
            return;

        setLoading(true);
        fetchHistoricData({ ...defaultFetchProps, ...fetchProps })
            .then((data) => {
                if (data === undefined) return;

                const newDataset: HistoricDataset = { label: fetchProps.label, dataset: data as Data[], fetchProps }
                if (fetchProps.actionType == 'push')
                    dispatch({ push: newDataset });
                else if (fetchProps.actionType == 'replace')
                    dispatch({ replaceCurrent: newDataset });
            }).finally(() => setLoading(false));

    }, [fetchProps]);

    return {
        current: state.list.at(state.index),
        length: state.list.length,
        maxLength: MAX_SIZE,
        fetch: setFetchProps,
        next: () => { dispatch({ next: true }) },
        prev: () => { dispatch({ prev: true }) },
        setIndex: (index: number) => { dispatch({ newIndex: index }) },
        datasetList: state.list,
        isLoading: loading,
    }

}



export default useHistoricData;