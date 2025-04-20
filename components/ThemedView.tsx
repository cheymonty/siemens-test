import {
  ScrollView,
  ScrollViewProps,
  View,
  type ViewProps,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export type ThemedSafeAreaViewProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function ThemedSafeAreaView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedSafeAreaViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <SafeAreaView
      style={[{ backgroundColor }, { flex: 1 }, style]}
      {...otherProps}
    />
  );
}

export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <ScrollView
      style={[{ backgroundColor }, { flex: 1 }, style]}
      {...otherProps}
    />
  );
}
