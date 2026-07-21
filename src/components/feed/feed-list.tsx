import { useCallback } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

import { FeedItem } from "@/components/feed/feed-item";
import { SuggestedPostsSection } from "@/components/feed/suggestions/suggested-posts-section";
import { FeedListItem } from "@/data/mock-feed";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export const FeedList = ({ data }: { data: FeedListItem[] }) => {
  const contentHeight = useSharedValue(0);
  const layoutHeight = useSharedValue(0);
  const progress = useSharedValue(0);
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      offset.value = event.contentOffset.y;
      progress.value = Math.min(
        1,
        Math.max(
          0,
          offset.value / Math.max(1, contentHeight.value - layoutHeight.value),
        ),
      );
    },
  });

  // const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
  //   const offset = e.nativeEvent.contentOffset.y;
  //   const max = Math.max(1, contentHeight.current - layoutHeight.current);
  //   const p = Math.min(1, Math.max(0, offset / max));
  //   setProgress(p);
  // };

  const handleContentSizeChange = (_w: number, h: number) => {
    contentHeight.value = h;
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    layoutHeight.value = e.nativeEvent.layout.height;
  };

  const renderItem = useCallback(({ item }: { item: FeedListItem }) => {
    return item.type === "suggestions" ? (
      <SuggestedPostsSection posts={item.posts} />
    ) : (
      <FeedItem item={item} />
    );
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, animatedStyle]} />
      </View>
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF3B30",
  },
});
