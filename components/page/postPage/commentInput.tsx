import db from "@/config/db";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";

export default function CommentInput({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}) {
  const [comment, setComment] = useState("");

  const handleComment = () => {
    if (!postId || !userId) {
      alert("Failed to add comment");
      return;
    }
    if (comment===""){
        alert("Failed to add comment");
        return;
    }
    addDoc(collection(db, "comments"), {
      postId: postId,
      userId: userId,
      comment: comment,
      createdAt: Date.now()
    })
      .then(() => {
        setComment("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Animated.View
      entering={SlideInLeft}
      exiting={SlideInRight}
      style={{
        display: "flex",
        flexDirection: "row",
        height: 50,
      }}
    >
      <TextInput
        multiline
        value={comment}
        onChangeText={setComment}
        placeholder="Add a comment"
        style={{
          flex: 1,
        }}
      />

      <Button
        style={{ borderRadius: 0, justifyContent: "center" }}
        icon="send"
        mode="contained"
        onPress={handleComment}
      >
        Send
      </Button>
    </Animated.View>
  );
}
