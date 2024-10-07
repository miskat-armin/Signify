import WebViewModal from "@/components/modals/webViewModal";
import OtherSection from "@/components/page/profile/otherSection";
import UserSection from "@/components/page/profile/userSection";
import { useAuth } from "@/context/auth";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  const { logout } = useAuth();
  const theme = useTheme();
  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <SafeAreaView style={styles.container}>
          <UserSection />
          <Divider />
          <OtherSection />

          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <AntDesign name="logout" size={24} color="black" />
              <Text>Logout</Text>
            </View>
            <IconButton
              icon={() => <AntDesign name="right" size={24} color="red" />}
              onPress={logout}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
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
});
