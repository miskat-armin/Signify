import db from "@/config/db";
import { useAuth } from "@/context/auth";
import { UploadImage } from "@/utils/UploadImage";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [usernameExists, setUsernameExists] = useState(false);

  // GraphQL
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const {
    loading: countryLoading,
    error: countryError,
    data: allCountries,
  } = useQuery(gql`
    query GetCountries {
      countries {
        code
        emoji
        name
      }
    }
  `);

  const [
    getStates,
    { loading: stateLoading, error: stateError, data: states },
  ] = useLazyQuery(
    gql`
      query State($code: ID!) {
        country(code: $code) {
          states {
            name
          }
        }
      }
    `
  );
  //

  const { signup } = useAuth();

  const Signup = async () => {
    if (!email || !password) {
      alert("Please enter an email and password");
      return;
    }
    if (!username) {
      alert("Please enter a username");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (phone && phone.length !== 11) {
      alert("Please enter a valid phone number");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    const imageUrl = await UploadImage(
      image,
      `images/avatar/${username}-${Date.now()}.jpg`
    );

    if (!imageUrl) {
      alert("Failed to upload image");
      return;
    }

    signup(email, password, username, phone, { country, state }, imageUrl)
      .then(() => {
        router.replace("/(tabs)");
      })
      .catch((error) => {
        alert(error);
      });
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

  useEffect(() => {
    const checkUsernameExists = async () => {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        setUsernameExists(true);
      } else {
        setUsernameExists(false);
      }
    };

    if (username.length > 0) {
      checkUsernameExists();
    }
  }, [username]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, gap: 10, justifyContent: "center" }}>
        {image && (
          <Avatar.Image
            style={{ alignSelf: "center" }}
            size={160}
            source={{ uri: image }}
          />
        )}
        <Button mode="text" onPress={pickImage}>
          Pick an image
        </Button>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
        />
        {usernameExists && (
          <Text variant="labelSmall" style={{ color: "red" }}>
            Username already exists
          </Text>
        )}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
        />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" />

        <Picker
          placeholder="Country"
          selectedValue={country}
          onValueChange={(item, index) => {
            setCountry(item);
            getStates({ variables: { code: item.code } });
          }}
        >
          <Picker.Item label="Country" value={null} />
          {!countryLoading &&
            allCountries.countries.map((country, index) => (
              <Picker.Item
                key={index}
                label={`${country?.emoji || ""} ${country?.name || ""}`}
                value={country}
              />
            ))}
        </Picker>

        <Picker
          placeholder="State"
          enabled={country ? true : false}
          selectedValue={state}
          onValueChange={(item, index) => {
            setState(item);
          }}
        >
          <Picker.Item label="City" value={null} />
          {!stateLoading &&
            states?.country?.states.map((state, index) => {
              return (
                <Picker.Item
                  key={index}
                  label={state.name}
                  value={state.name}
                />
              );
            })}
        </Picker>

        <Button mode="contained" onPress={Signup}>
          Sign up
        </Button>
      </View>
    </SafeAreaView>
  );
}
