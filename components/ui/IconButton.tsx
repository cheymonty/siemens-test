import React from 'react';
import { Pressable, StyleSheet, OpaqueColorValue } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';

type IconButtonProps = {
  onPress: () => void;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string | OpaqueColorValue | undefined;
  text?: string;
  size?: number;
  disabled?: boolean;
};

export default function IconButton(props: IconButtonProps) {
  return (
    <Pressable
      onPress={props.onPress}
      style={props.disabled ? styles.disabledButton : styles.button}
      disabled={props.disabled}
    >
      <MaterialIcons
        name={props.iconName}
        size={props.size ?? 20}
        color={props.iconColor ?? '#fff'}
      />
      {props.text && (
        <ThemedText style={styles.buttonText}>{props.text}</ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: '#841584',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    flexDirection: 'row',
    backgroundColor: 'rgb(224, 224, 224)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 8,
  },
});
