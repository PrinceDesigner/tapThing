// components/CustomText.js

import React from "react";
import { Text, TextProps, TextStyle, StyleProp } from "react-native";

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
      style={[{ fontFamily: "RobotoCondensed" }, style]}
      {...rest}
    >
      {children}
    </BaseText>
  );
};

export const TextLight: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <BaseText
      style={[{ fontFamily: "RobotoLightCondensed" }, style]}
      {...rest}
    >
      {children}
    </BaseText>
  );
};

export const TextMedium: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <BaseText
      style={[{ fontFamily: "RobotoMediumCondensed" }, style]}
      {...rest}
    >
      {children}
    </BaseText>
  );
};

export const TextBold: React.FC<CustomTextProps> = ({ style, children, ...rest }) => {
  return (
    <BaseText
      style={[{ fontFamily: "RobotoBoldCondensed" }, style]}
      {...rest}
    >
      {children}
    </BaseText>
  );
};
