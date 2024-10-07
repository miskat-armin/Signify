import { useAuth } from "@/context/auth";
import { Link, router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const Signin = () => {
    login(email, password)
      .then(() => {
        router.replace("/(tabs)");
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 20,
          gap: 10,
          justifyContent: "center",
        }}
      >
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
        />
        <Button mode="contained" onPress={Signin}>
          Sign in
        </Button>

        <Link href="/(auth)/signup" asChild>
          <Button mode="text">Don't have an account? Sign up</Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
