import React from "react";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

const banglaCharacters = [
  "অ",
  "আ",
  "ই",
  "উ",
  "এ",
  "ও",
  "ক",
  "খ",
  "গ",
  "ঘ",
  "চ",
  "ছ",
  "জ",
  "ঝ",
  "ট",
  "ঠ",
  "ড",
  "ঢ",
  "ত",
  "থ",
  "দ",
  "ধ",
  "প",
  "ফ",
  "ব",
  "ভ",
  "ম",
  "য়",
  "র",
  "ল",
  "ন",
  "স",
  "হ",
  "ড়",
  " ঃং",
  "ঃ",
  "০",
  "১",
  "২",
  "৩",
  "৪",
  "৫",
  "৬",
  "৭",
  "৮",
  "৯",
  "`",
  "space",
  "ঞ",
];

export default function CameraModal() {
  const [results, setResults] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<"front" | "back">("back");
  const camera = useRef(null); //camera reference

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(currentCamera);

  const getPrediction = async () => {
    const photo = await camera?.current?.takePhoto({
      qualityPrioritization: "speed",
      flash: "off",
      enableShutterSound: false,
    });

    if (photo == null) return;

    const formData = new FormData(); //appending key,value pair
    formData.append("image", {
      type: "image/jpeg",
      uri: "file://" + photo?.path,
      name: "image",
    });

    try {
      const response = await fetch("http://192.168.8.101:8000", {
        method: "POST",
        body: formData,
      });

      const data = await response.json(); // axios auto result json kore, but fetch doesnot
      setResults(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!hasPermission) return;
    if (!isExecuting && camera.current) {
      setIsExecuting(true);

      getPrediction()
        .then(() => {})
        .catch((e) => {
          console.log(e);
        })
        .finally(() => setIsExecuting(false));
    }
  }, [hasPermission, camera?.current, isExecuting]);

  return (
    <View style={styles.container}>
      {hasPermission && (
        <Camera
          ref={camera}
          device={device}
          style={{ height: "100%", width: "100%" }}
          isActive={true}
          photo={true}
          onError={(e) => console.log("error", e)}
          orientation="portrait"
        />
      )}
      {results.length > 0 ? (
        results.map((result, idx) => (
          <Text
            key={idx}
            style={{
              position: "absolute",
              bottom: 40,
              color: "lime",
              fontSize: 34,
            }}
          >
            {banglaCharacters[result]}
          </Text>
        ))
      ) : (
        <Text
          style={{
            position: "absolute",
            bottom: 40,
            color: "red",
            fontSize: 22,
          }}
        >
          No hand detected
        </Text>
      )}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 14,
          right: 20,
          bottom: 40,
          zIndex: 10, //Elements with a higher zIndex value will be displayed above elements with lower zIndex values.
        }}
        onPress={() => {
          if (currentCamera == "back") setCurrentCamera("front");
          else setCurrentCamera("back");
        }}
      >
        <MaterialIcons name="cameraswitch" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
