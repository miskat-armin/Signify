import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { UploadImage } from "@/utils/UploadImage";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth";
import db from "@/config/db";

export default function AddPostModal({ visible, onClose }: any) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddPost = async () => {
    setLoading(true);
    const imageUrl = await UploadImage(image, `images/posts/${Date.now()}.jpg`);

    await addDoc(collection(db, "posts"), {
      title,
      description,
      imageUrl,
      createdAt: Date.now(),
      userId: user.uid,
    })
      .then(() => {
        resetForm();
        onClose();
      })
      .catch((err) => {
        alert("Failed to add post");
        console.log(err);
      });

    setLoading(false);
  };

  return (
    <Portal>
      <Modal
        onDismiss={onClose}
        dismissable
        visible={visible}
        contentContainerStyle={{
          backgroundColor: "white",
          flex: 1,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          padding: 20,
          gap: 16,
        }}
      >
        <FontAwesome6
          name="arrow-left"
          size={24}
          color={"black "}
          onPress={onClose}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add Post</Text>
        <Text style={{ fontSize: 12, fontWeight: "100" }}>ADD PHOTOS</Text>
        {!image ? (
          <TouchableOpacity
            style={{ width: "100%", height: "24%" }}
            onPress={pickImage}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                borderWidth: 1,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome6 name="image" size={46} color={"skyblue"} />
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Upload Photo
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "100",
                  flexWrap: "wrap",
                  textAlign: "center",
                }}
              >
                Just tap here to browse your photos to upload photo
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: "100%",
              height: "24%",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={{ fontSize: 14, fontWeight: "100", color: "blue" }}>
                Remove Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ width: "100%", gap: 8, marginTop: 10 }}>
          <Text style={{ fontSize: 12, fontWeight: "100" }}>ADD TITLE</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            placeholder="Type here..."
          />
        </View>

        <View style={{ width: "100%", gap: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: "100" }}>
            ADD DESCRIPTION
          </Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            placeholder="Write description here..."
            style={{ paddingVertical: 10 }}
          />
        </View>
        <Button
          disabled={!title || !description || loading}
          mode="contained"
          style={{ width: "100%" }}
          onPress={handleAddPost}
        >
          Done
        </Button>
      </Modal>
    </Portal>
  );
}
