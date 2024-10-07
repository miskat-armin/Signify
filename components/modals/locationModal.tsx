import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { IconButton, Modal, Portal, Text } from "react-native-paper";
import * as Location from "expo-location";
import MapView from "react-native-maps";

export default function LocationModal() {
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        hideModal();
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <IconButton
        icon={() => <AntDesign name="right" size={24} color="black" />}
        onPress={showModal}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {location ? (
              <MapView
                initialRegion={{
                  ...location.coords,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation
                followsUserLocation
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text>No location found</Text>
            )}
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
