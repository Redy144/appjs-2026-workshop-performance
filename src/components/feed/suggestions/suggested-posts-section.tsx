import { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { SuggestedPost } from "@/data/mock-feed";

import { SuggestedPostCard } from "./suggested-post-card";

import { FlashList, useMappingHelper } from "@shopify/flash-list";

export const SuggestedPostsSection = ({
  posts,
}: {
  posts: SuggestedPost[];
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const { getMappingKey } = useMappingHelper();
  const openSuggestions = () => {
    router.push("/suggestions");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Suggested for you
        </Text>
        <TouchableOpacity onPress={openSuggestions}>
          <Text style={[styles.seeAll, { color: colors.tint }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlashList
        data={posts}
        renderItem={({ item, index }) => (
          <SuggestedPostCard key={getMappingKey(item.id, index)} post={item} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
});
