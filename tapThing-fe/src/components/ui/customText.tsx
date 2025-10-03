// components/CustomText.js

import React from "react";
import { TextProps, TextStyle, StyleProp } from "react-native";
import { Text } from "react-native-paper";

// Define a type for the custom text props
type CustomTextProps = {
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
} & TextProps;

// Ricevi props come `style`, `children`, etc.
const BaseText: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <Text style={[{ /* stile base comune */ }, style]} {...rest}>
      {children}
    </Text>
  );
};

export const TextRegular: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <BaseText
      style={[{ fontFamily: "RobotoCondensed-Regular" }, style]}
      {...rest}
    >
      {children}
    </BaseText>
  );
};

export const TextLight: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <BaseText
      style={[{ fontFamily: "RobotoCondensed-Light" }, style]}
      {...rest}
    >
      {children}
    </BaseText>
  );
};

export const TextMedium: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <BaseText
      style={[{ fontFamily: "RobotoCondensed-Medium" }, style]}
      {...rest}
    >
      {children}
    </BaseText>
  );
};

export const TextBold: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <BaseText
      style={[{ fontFamily: "RobotoCondensed-Bold" }, style]}
      {...rest}
    >
      {children}
    </BaseText>
  );
};
