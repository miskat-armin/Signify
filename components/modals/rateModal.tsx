import db from "@/config/db";
import { useAuth } from "@/context/auth";
import { AntDesign } from "@expo/vector-icons";
import {
  average,
  collection,
  doc,
  getAggregateFromServer,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import StarRating, { StarRatingDisplay } from "react-native-star-rating-widget";

export default function RateModal() {
  const { user } = useAuth();

  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [totalRating, setTotalRating] = useState(0);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    getTotalRating();
    const unsubscribe = onSnapshot(
      doc(db, "rating", `${user?.uid}`),
      (querySnapshot) => {
        const data = querySnapshot.data();

        if (!data) return;
        setRating(data.rating);
        setReview(data.review || "");
      }
    );

    return () => unsubscribe();
  }, []);

  const getTotalRating = async () => {
    const snapshot = await getAggregateFromServer(collection(db, "rating"), {
      totalRating: average("rating"),
    });

    setTotalRating(snapshot.data().totalRating || 0);
  };

  const UpdateRating = () => {
    const docRef = doc(db, "rating", `${user?.uid}`);
    setDoc(
      docRef,
      {
        rating: rating,
        review: review,
      },
      { merge: true }
    )
      .then(() => {
        getTotalRating();
        alert("Rating updated");
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  return (
    <View>
      <IconButton
        icon={() => <AntDesign name="right" size={24} color="black" />}
        onPress={showModal}
      />

      <Portal>
        <Modal
          onDismiss={hideModal}
          visible={visible}
          contentContainerStyle={{
            backgroundColor: "white",
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 20,
            gap: 20,
          }}
        >
          <Text variant="titleLarge">Rate this app</Text>
          <View style={{ alignItems: "flex-start", width: "100%", gap: 20 }}>
            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                Total Rating
              </Text>
              <StarRatingDisplay rating={totalRating} />
            </View>

            <View style={{ display: "flex", flexDirection: "column" }}>
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                Your Rating
              </Text>
              <StarRatingDisplay rating={rating} />
            </View>

            <Divider />
            <View>
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                Give a Rating
              </Text>
              <StarRating rating={rating} onChange={setRating} />
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                Give a Review
              </Text>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={4}
                style={{ width: "100%", paddingVertical: 10 }}
                placeholder="Type here..."
                value={review}
                onChangeText={setReview}
              />
            </View>
            <Button
              icon={"send"}
              mode="contained"
              style={{ alignSelf: "center" }}
              onPress={UpdateRating}
            >
              Send
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
