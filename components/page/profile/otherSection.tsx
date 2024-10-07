import LocationModal from "@/components/modals/locationModal";
import RateModal from "@/components/modals/rateModal";
import WebViewModal from "@/components/modals/webViewModal";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import CrystalReport from "./crystalReport";

export default function OtherSection() {
  const theme = useTheme();
  return (
    <View style={{ width: "100%", padding: 20, gap: 10 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Others</Text>
      </View>

      <View
        style={{
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 10,
          padding: 20,
          width: "100%",
        }}
      >
        <RateAppOption color={theme.colors.primary} />
        <Divider />
        <WatchVideo />
        <Divider />
        <ShareReport />
        <Divider />
        <MyLocation />
      </View>
    </View>
  );
}

function RateAppOption({ color }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <FontAwesome name="star-o" size={24} color="black" />
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>Rate this app</Text>
      </View>
      <RateModal />
    </View>
  );
}

function WatchVideo() {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <AntDesign name="eyeo" size={24} color="black" />
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>Watch a view</Text>
      </View>
      <WebViewModal />
    </View>
  );
}

function ShareReport() {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <AntDesign name="sharealt" size={24} color="black" />
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>Share Report</Text>
      </View>
      <CrystalReport />
    </View>
  );
}

function MyLocation() {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <Entypo name="location-pin" size={24} color="black" />
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>My Location</Text>
      </View>

      <LocationModal />
    </View>
  );
}
