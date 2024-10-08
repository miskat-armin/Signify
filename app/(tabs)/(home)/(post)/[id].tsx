import CommentCard from "@/components/page/common/comment";
import Post from "@/components/page/common/post";
import CommentInput from "@/components/page/postPage/commentInput";
import db from "@/config/db";
import { Comment, post } from "@/constants/type";
import { useAuth } from "@/context/auth";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  FadeInDown,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostPage() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<post>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: post.title || "" });
  }, [navigation, post?.title]);

  useEffect(() => {
    const docRef = doc(db, "posts", `/${id}`);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      //getting the user of the post
      const userRef = doc(db, "users", `${data.userId}`);
      getDoc(userRef)
        .then((res) => {
          const user = res.data();
          setPost({
            id: snapshot.id,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            createdAt: data.createdAt,
            user: user,
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", id),
      // orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const data = snapshot.docs.map(async (document) => {
        const data = document.data();

        const userRef = doc(db, "users", `${data.userId}`);

        const user = await getDoc(userRef);
        if (!user.exists()) return;

        return {
          id: document.id,
          comment: data.comment,
          user: user.data(),
        };
      });

      Promise.all(data)
        .then((res) => {
          setComments(res.sort((a, b) => b.createdAt - a.createdAt));
        })
        .finally(() => {
          setCommentsLoading(false);
        });
    });
    return () => unsubscribe();
  }, [id]);

  if (loading || commentsLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <FontAwesome name="spinner" size={24} color="black" />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <Animated.FlatList
          entering={SlideInDown}
          exiting={SlideOutDown}
          ListHeaderComponent={() => (
            <Post post={post} singleComponent={true} />
          )}
          data={comments}
          renderItem={({ item }) => <CommentCard comment={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 10,
            gap: 10,
            paddingVertical: 10,
          }}
        />
      </View>
      <CommentInput postId={post?.id} userId={user?.uid} />
    </View>
  );
}
