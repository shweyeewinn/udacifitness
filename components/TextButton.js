import React from 'react'
import { TouchableOpacity, Text } from "react-native";

export default function TextButton({ children, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{children}</Text>
    </TouchableOpacity>
  )
}