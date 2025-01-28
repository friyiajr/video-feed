import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Platform,
  TextStyle,
  View,
  ViewStyle,
  Text,
  Pressable,
  StyleSheet,
  ImageStyle,
  Share,
} from "react-native";

import { videos, videos2, videos3 } from "../../assets/data";
import Video, { ResizeMode, VideoRef } from "react-native-video";
import { Image } from "expo-image";

const { height, width } = Dimensions.get("window");

interface VideoWrapper {
  data: ListRenderItemInfo<string>;
  allVideos: string[];
  visibleIndex: number;
  pause: () => void;
  share: (videoURL: string) => void;
  pauseOverride: boolean;
}

const VideoWrapper = ({
  data,
  allVideos,
  visibleIndex,
  pause,
  pauseOverride,
  share,
}: VideoWrapper) => {
  const bottomHeight = useBottomTabBarHeight();
  const { index, item } = data;

  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    videoRef.current?.seek(0);
  }, [visibleIndex]);

  return (
    <View
      style={{
        height: Platform.OS === "android" ? height - bottomHeight : height,
        width,
      }}
    >
      <Video
        ref={videoRef}
        source={{ uri: allVideos[index] }}
        style={{ height: height - bottomHeight, width }}
        resizeMode="cover"
        paused={visibleIndex !== index || pauseOverride}
      />

      <Pressable onPress={pause} style={$overlay} />

      <Pressable onPress={() => share(item)} style={$shareButtonContainer}>
        <Image source="share" style={$shareButtonImage} />
        <Text style={$shareButtonText}>Share</Text>
      </Pressable>
    </View>
  );
};

export default function HomeScreen() {
  const bottomHeight = useBottomTabBarHeight();

  const [allVideos, setAllVideos] = useState(videos);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [pauseOverride, setPauseOverride] = useState(false);

  const numOfRefreshes = useRef(0);

  const fetchMoreData = () => {
    if (numOfRefreshes.current === 0) {
      setAllVideos([...allVideos, ...videos2]);
    }
    if (numOfRefreshes.current === 1) {
      setAllVideos([...allVideos, ...videos3]);
    }

    numOfRefreshes.current += 1;
  };

  const onViewableItemsChanged = (event: any) => {
    const newIndex = Number(event.viewableItems.at(-1).key);
    setVisibleIndex(newIndex);
  };

  const pause = () => {
    setPauseOverride(!pauseOverride);
  };

  const share = (videoURL: string) => {
    setPauseOverride(true);
    setTimeout(() => {
      Share.share({
        title: "Share This Video",
        message: `Check out: ${videoURL}`,
      });
    }, 100);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList
        pagingEnabled
        snapToInterval={
          Platform.OS === "android" ? height - bottomHeight : undefined
        }
        initialNumToRender={1}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        data={allVideos}
        onEndReachedThreshold={0.3}
        onEndReached={fetchMoreData}
        renderItem={(data) => {
          return (
            <VideoWrapper
              data={data}
              allVideos={allVideos}
              visibleIndex={visibleIndex}
              pause={pause}
              share={share}
              pauseOverride={pauseOverride}
            />
          );
        }}
      />
      {pauseOverride && (
        <Pressable style={$pauseIndicator}>
          <Image source="pause" style={$playButtonImage} />
        </Pressable>
      )}
    </View>
  );
}

const $overlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "black",
  opacity: 0.3,
};

const $pauseIndicator: ViewStyle = {
  position: "absolute",
  alignSelf: "center",
  top: height / 2 - 25,
};

const $playButtonImage: ImageStyle = {
  height: 50,
  width: 50,
  justifyContent: "center",
  alignItems: "center",
  resizeMode: "contain",
};

const $shareButtonContainer: ViewStyle = {
  position: "absolute",
  zIndex: 999,
  elevation: 999,
  bottom: Platform.OS === "android" ? 70 : 100,
  right: 10,
  alignItems: "center",
  gap: 8,
};

const $shareButtonImage: ImageStyle = {
  height: 25,
  width: 25,
  justifyContent: "center",
  alignItems: "center",
  resizeMode: "contain",
  tintColor: "white",
};

const $shareButtonText: TextStyle = {
  color: "white",
  fontSize: 12,
  fontWeight: "bold",
};
