import db from "@/config/db";
import { post } from "@/constants/type";
import { useAuth } from "@/context/auth";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Avatar, Button, Card, Text } from "react-native-paper";

export default function Post({
  post,
  singleComponent = false,
}: {
  post: post;
  singleComponent?: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userState, setUserState] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "feelings"), where("postId", "==", post.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const data = doc.data();

        if (doc.id === `${user?.uid}-${post.id}`) {
          setUserState(data.state);
        }

        return {
          id: doc.id,
          state: data.state,
        };
      });

      setLikes(data.filter((d) => d.state === 1).length);
      setDislikes(data.filter((d) => d.state === -1).length);
    });

    return () => unsubscribe();
  }, [post.id]);

  return (
    <Card
      mode="elevated"
      // onPress={() =>
      //   router.navigate({ pathname: "/(post)/[id]", params: { id: post.id } })
      // }
    >
      <Card.Title
        titleStyle={{ fontWeight: "bold", fontSize: 18 }}
        subtitleVariant="labelSmall"
        title={post.title}
        subtitle={new Date(post.createdAt).toLocaleString()}
        left={() => (
          <Avatar.Image size={40} source={{ uri: post.user?.avatar }} />
        )}
      />
      <Card.Content>
        <Text>{post.description}</Text>
      </Card.Content>
      <Card.Cover style={{ margin: 10 }} source={{ uri: post.imageUrl }} />
      <Card.Actions>
        <Button
          style={{ width: 90 }}
          mode="outlined"
          onPress={() => {
            if (userState === 1) {
              handleDeleteReaction(`${user?.uid}-${post.id}`);
              setUserState(0);
            } else {
              setUserState(1);
              handleLike(`${user?.uid}-${post.id}`, post.id);
            }
          }}
        >
          <FontAwesome
            name={userState === 1 ? "thumbs-up" : "thumbs-o-up"}
            size={18}
          />
          <Text style={{ fontSize: 16 }}> {likes}</Text>
        </Button>
        <Button
          style={{ width: 90 }}
          mode="outlined"
          onPress={() => {
            if (userState === -1) {
              handleDeleteReaction(`${user?.uid}-${post.id}`);
              setUserState(0);
            } else {
              handleDislike(`${user?.uid}-${post.id}`, post.id);
              setUserState(-1);
            }
          }}
        >
          <Text style={{ fontSize: 16 }}>{dislikes} </Text>
          <FontAwesome
            name={userState === -1 ? "thumbs-down" : "thumbs-o-down"}
            size={18}
          />
        </Button>

        <Button
          disabled={singleComponent}
          mode="contained-tonal"
          style={{ marginLeft: "auto" }}
          onPress={() => {
            router.push({ pathname: "/(post)/[id]", params: { id: post.id } });
          }}
        >
          <FontAwesome6 name="comments" size={18} />
        </Button>
      </Card.Actions>
    </Card>
  );
}

function handleLike(id: string, postId: string) {
  const docRef = doc(db, "feelings", `/${id}`);

  setDoc(
    docRef,
    {
      postId: postId,
      state: 1,
    },
    { merge: true }
  );
}

function handleDislike(id: string, postId: string) {
  const docRef = doc(db, "feelings", `/${id}`);

  setDoc(
    docRef,
    {
      postId: postId,
      state: -1,
    },
    { merge: true }
  );
}

function handleDeleteReaction(id: string) {
  const docRef = doc(db, "feelings", `/${id}`);

  deleteDoc(docRef);
}
