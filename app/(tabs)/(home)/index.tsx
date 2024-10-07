import AddPostModal from "@/components/modals/addPostModal";
import Posts from "@/components/page/homepage/posts";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";

export default function TabOneScreen() {
  const [AddPostModalVisibility, setAddPostModalVisibility] = useState(false);

  const showModal = () => setAddPostModalVisibility(true);
  const hideModal = () => setAddPostModalVisibility(false);
  return (
    <View style={styles.container}>
      <FAB style={styles.fab} icon="plus" onPress={showModal} />
      <Posts />
      <AddPostModal visible={AddPostModalVisibility} onClose={hideModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 30,
    zIndex: 100,
  },
});
