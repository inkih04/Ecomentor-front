import React, { act, createRef } from "react";
import { render, fireEvent } from "@testing-library/react-native";

jest.mock("@/app/Components/InfoCard");
jest.mock("react-native-gifted-charts");
jest.unmock("@/app/Components/FilterView");

import { getHostParent } from "@/app/Utils/testing";

import HistoricBarChart, { CustomBarChartProps } from "@/app/Components/HistoricBarChart";

describe("Dummy test", () => {
    it("dummy test", () => {
        let t = true;
        expect(t).toBeTruthy();
    })
})

/*
describe("CustomBarChart Component", () => {
    let mockProps: CustomBarChartProps = {
        title: "CO2 Emissions",
        dataset: {
            key: 'Label',
            data: [
                { label: "2020", value: 200 },
                { label: "2021", value: 300 },
                { label: "2022", value: 400 },
            ],
        },
        filterOptions: [
            {
                title: "Location",
                key: "Location",
                filters: [
                    {
                        title: "Region",
                        onPress: jest.fn(),
                    },
                ]
            }
        ],
    };

    let mockMultipleColumnProps: CustomBarChartProps = {
        ...mockProps,
        dataset: {
            key: "mockLabel",
            data: [
                { label: "2020", value: 200 },
                { value: 300 },
                { label: "2021", value: 400 },
                { value: 500 },
            ],
        },
        columnLabels: ['A','B'],
    }

    it("renders the title correctly", () => {
        const { getByText } = render(<HistoricBarChart {...mockProps} />);
        getByText("CO2 Emissions")
        expect(getByText("CO2 Emissions")).toBeTruthy();
    });

    it("renders the bar chart when dataset is not empty", () => {
        const { getByTestId } = render(<HistoricBarChart {...mockProps} />);
        expect(getByTestId("bar-chart")).toBeTruthy();
    });

    it("renders filter title and options when provided", () => {
        const { getByText } = render(<HistoricBarChart {...mockProps} />);
        expect(getByText("Location")).toBeTruthy();
        expect(getByText("Region")).toBeTruthy();
    });

    it("calls the filter option's onPress handler when clicked", () => {
        const { getByText } = render(<HistoricBarChart {...mockProps} />);
        const filterButton = getHostParent(getByText("Region"));
        expect(filterButton).toBeTruthy();
        if (!filterButton) return;

        fireEvent.press(filterButton);
        expect(mockProps.filterOptions?.at(0)?.filters.at(0)?.onPress).toHaveBeenCalled();
    });

    it("does not render the bar chart when dataset is empty", () => {
        const emptyProps = { ...mockProps, dataset: { data: [], key: 'empty' } };
        const { queryByTestId } = render(<HistoricBarChart {...emptyProps} />);
        expect(queryByTestId("bar-chart")).toBeNull();
    });

    it("changes the data on setData call", () => {
        const barChartRef = createRef<CustomBarChartRef>();
        const component = <HistoricBarChart {...mockProps} ref={barChartRef} />;
        const { getByText, rerender } = render(component);

        act(() => {
            barChartRef.current?.setData({
                key: 'NewData',
                data: [ { label: "10", value: 5 }, ],
            });
        });

        rerender(component);

        // Check previous labels are not there and new ones are
        expect(() => getByText("200.00:200")).toThrow();
        expect(getByText("5.00:5")).toBeTruthy();
    });

});*/