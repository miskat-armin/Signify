import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  useTheme,
} from "react-native-paper";
import WebView from "react-native-webview";

const WebViewModal = () => {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <IconButton
        icon={() => (
          <AntDesign name="right" size={24} color={"black"} />
        )}
        onPress={showModal}
      />

      <Portal>
        <Modal
          onDismiss={hideModal}
          visible={visible}
          contentContainerStyle={{
            backgroundColor: "white",
            flex: 1,
          }}
        >
          <WebView
            style={{ flex: 1 }}
            source={{ uri: "https://www.youtube.com/watch?v=z08yRPKmrHk&t=2s" }}
          />
        </Modal>
      </Portal>
    </View>
  );
};

export default WebViewModal;
