import React from "react";
import { View, Text } from "react-native";

interface mockBarChartProps {
    data: Array<{ label: string; value: number }>;
    width: number;
    height: number;
    testID?: string;
    yAxisLabelPrefix?: string;
    yAxisLabelSuffix?: string;
    barWidth?: number;
    maxValue?: number;
    noOfSections?: number;
    yAxisThickness?: number;
    xAxisThickness?: number;
    barBorderRadius?: number;
    yAxisTextStyle?: object;
    xAxisLabelTextStyle?: object;
    hideRules?: boolean;
    disablePress?: boolean;
}

export const BarChart = ({ data, width, height, testID }: mockBarChartProps) => {
  return (
    <View
      testID={testID || "bar-chart"}
      style={{
        width,
        height,
        backgroundColor: "lightgrey", // Mock background for visualization
      }}
    >
      {data.map((item: any, index: number) => (
        <Text key={index} style={{ color: "black" }}>
          {`${item.label ?? ''}:${item.value}`}
        </Text>
      ))}
    </View>
  );
};

export default {};