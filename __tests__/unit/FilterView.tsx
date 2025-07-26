import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

jest.mock("react-i18next");
jest.unmock("@/app/Components/FilterView");

import { getHostParent } from "@/app/Utils/testing";

import FilterView, { FilterViewProps } from "@/app/Components/FilterView";
import { colors } from "@/app/Constants/colors";


describe("FilterView Component", () => {
	
	let textTest: string;	
	const mockProps: FilterViewProps = {
		filterTypes: [
			{
				title: 'Filter1',
				key: 'Filter1',
				filters: [
					{
						title: 'Region',
						onPress: jest.fn(),
						onOptionSelected: jest.fn(),
					},
				],
			},
			{
				title: 'Filter2',
				key: 'Filter2',
				filters: [
					{
						title: 'Caca',
						onPress: jest.fn(),
						onOptionSelected: (option) => textTest = option,
						options: ['1', '2'],
					},
				],
			},
		],
	};

	beforeEach(() => {
		textTest = '';
	});

	it("renders the filter title correctly", () => {
		const { getByText } = render(<FilterView {...mockProps} />);
		expect(getByText("Filter1")).toBeTruthy(); // Ensure the title is rendered
	});

	it("renders all buttons", () => {
		const { getByText } = render(<FilterView {...mockProps} />);
		expect(getByText("Region")).toBeTruthy();
		expect(getByText("Caca")).toBeTruthy();
	});

	it("calls the onPress handler when a filter is pressed", () => {
		const { getByText } = render(<FilterView {...mockProps} />);
		const button = getHostParent(getByText("Region"));
		expect(button).toBeTruthy();

		if (!button) return;

		fireEvent.press(button);
		expect(mockProps.filterTypes[0].filters[0].onPress).toHaveBeenCalled();
	});

	it("renders the FilterPicker when a filter with options is selected", () => {
		const { getByText, queryByText, getByTestId } = render(<FilterView {...mockProps} />);
		const button = getHostParent(getByText("Caca"));

		if (!button) return;

		fireEvent.press(button);

		const picker = getByTestId("filter-picker");
		fireEvent(picker, "onValueChange", "1");

		expect(textTest === "1").toBeTruthy(); // Ensure options is selecte
	});
});