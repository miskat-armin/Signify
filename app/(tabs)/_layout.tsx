import { TabBarButton } from "@/components/button/tabBarButton";
import { useAuth } from "@/context/auth";
import { HomeIcon } from "@/icons/homeIcon";
import { ProfileIcon } from "@/icons/profileIcon";
import { AntDesign } from "@expo/vector-icons";
import { Redirect, router, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import { useCameraPermission } from "react-native-vision-camera";

export default function TabLayout() {
  const { isAuthenticated, loading } = useAuth();
  const { hasPermission, requestPermission } = useCameraPermission();
  if (loading) return <ActivityIndicator />; //circular loading progress bar

  if (!isAuthenticated) {
    return <Redirect href={"/(auth)/signin"} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerRight: () => (
          <IconButton
            icon={() => <AntDesign name="camerao" size={24} color="black" />}
            onPress={() => {
              if (hasPermission) {
                router.navigate("/(modal)/signLanguageModal");
              } else {
                requestPermission();
              }
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: true,
          headerTitle: "Signify",
          title: "Home",
          tabBarButton: ({ accessibilityState, onPress }) => (
            <TabBarButton
              title="Home"
              focused={accessibilityState?.selected}
              onPress={onPress}
              icon={HomeIcon}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: "Settings",
          tabBarButton: ({ accessibilityState, onPress }) => (
            <TabBarButton
              title="Profile"
              focused={accessibilityState?.selected}
              onPress={onPress}
              icon={ProfileIcon}
            />
          ),
        }}
      />
    </Tabs>
  );
}
