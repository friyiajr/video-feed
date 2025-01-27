import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Platform,
  TextStyle,
  View,
  ViewStyle,
  Text,
} from "react-native";

import { videos, videos2, videos3 } from "../../assets/data";

const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
  return <View style={{ flex: 1, backgroundColor: "black" }}></View>;
}
