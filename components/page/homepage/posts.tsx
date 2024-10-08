import db from "@/config/db";
import { post } from "@/constants/type";
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import Post from "../common/post";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

export default function Posts() {
  const [posts, setPosts] = useState<post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const postQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const unsubscribe = onSnapshot(postQuery, (snapshot) => {
      const resPosts = snapshot.docs.map(async (document) => {
        const data = document.data();

        const userRef = doc(db, "users", `${data.userId}`);
        const user = await getDoc(userRef);

        if (!user.exists()) return data;

        return {
          id: document.id,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt,
          user: user.data(),
        };
      });

      Promise.all(resPosts).then((res) => {
        setPosts(res);
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  const loadMore = () => {
    if (posts.length===0) return;
    setIsFetchingMore(true);
    const postQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(posts[posts.length - 1]?.createdAt),
      limit(5)
    );

    const unsubscribe = onSnapshot(postQuery, (snapshot) => {
      const resPosts = snapshot.docs.map(async (document) => {
        const data = document.data();

        const userRef = doc(db, "users", `${data.userId}`);

        const user = await getDoc(userRef);

        if (!user.exists()) return data;

        return {
          id: document.id,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          createdAt: data.createdAt,
          user: user.data(),
        };
      });

      Promise.all(resPosts)
        .then((res) => {
          setPosts([...posts, ...res]);
        })
        .finally(() => {
          setIsFetchingMore(false);
        });
    });

    return () => unsubscribe();
  };

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Animated.FlatList
      entering={SlideInDown}
      exiting={SlideOutDown}
      keyExtractor={(item) => item?.id}
      showsVerticalScrollIndicator={false}
      data={posts}
      renderItem={({ item }) => <Post post={item} key={item?.id} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        isFetchingMore ? (
          <FontAwesome
            style={{ alignSelf: "center" }}
            name="spinner"
            size={24}
          />
        ) : null
      }
    />
  );
}
