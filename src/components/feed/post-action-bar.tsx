import { useCallback, useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ShareButton } from "./actions/share-button";
import { LikeButton } from "./actions/like-button";
import { ColorsContext } from "@/context/colors-context";
import { BookmarkButton } from "./actions/bookmark-button";
import { useRouter } from "expo-router";

interface PostActionBarProps {
  postId: string;
  username: string;
  isLikedProps: boolean;
  isBookmarkedProps: boolean;
  likesCountProps: number;
}

export const PostActionBar = ({
  postId,
  username,
  isLikedProps,
  likesCountProps,
  isBookmarkedProps,
}: PostActionBarProps) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(isLikedProps);
  const [likesCount, setLikesCount] = useState(likesCountProps);
  const [shareCount, setShareCount] = useState(0);

  const handleLike = useCallback(() => {
    setIsLiked((prevIsLiked) => {
      const nextIsLiked = !prevIsLiked;
      setLikesCount(
        (prevLikesCount) => prevLikesCount + (nextIsLiked ? 1 : -1),
      );
      return nextIsLiked;
    });
  }, []);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <LikeButton isLiked={isLiked} colors={colors} onPress={handleLike} />
          <ShareButton
            postId={postId}
            username={username}
            colors={colors}
            onShareComplete={() =>
              setShareCount((prevShareCount) => prevShareCount + 1)
            }
          />
        </View>
        <BookmarkButton
          initialIsBookmarked={isBookmarkedProps}
          colors={colors}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 12,
        }}
      >
        <TouchableOpacity onPress={() => router.push(`/likes/${postId}`)}>
          <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>
            {likesCount.toLocaleString()} likes
          </Text>
        </TouchableOpacity>
        {shareCount > 0 && (
          <Text style={{ fontSize: 14, color: colors.icon }}>
            · {shareCount} {shareCount === 1 ? "share" : "shares"}
          </Text>
        )}
      </View>
    </>
  );
};
