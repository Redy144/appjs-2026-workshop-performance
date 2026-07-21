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
import { FlashList } from "@shopify/flash-list";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

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

  const getItemType = useCallback((item: FeedListItem) => {
    return item.type;
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, animatedStyle]} />
      </View>
      <AnimatedFlashList
        data={data}
        renderItem={({ item }) => renderItem({ item: item as FeedListItem })}
        keyExtractor={(item) => (item as FeedListItem).id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        getItemType={(item) => getItemType(item as FeedListItem)}
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
