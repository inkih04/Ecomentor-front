import React from "react";
import { View, Button } from "react-native";

const MockFilterView = ({ buttons, children, style }: any) => {
  return (
    <View testID="filter-view" style={style?.container}>
      {buttons.map((button: any, index: number) => (
        <Button key={index} title={button.title} onPress={button.onPress} />
      ))}
      {children}
    </View>
  );
};

export default MockFilterView;