import ProfileEditModal from "@/components/modals/profileEditModal";
import db from "@/config/db";
import { user } from "@/constants/type";
import { useAuth } from "@/context/auth";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, Button, Divider, Text, useTheme } from "react-native-paper";

export default function UserSection() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<user>();
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", `${user?.uid}`),
      (snapshot) => {
        const data = snapshot.data();
        setUserInfo(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FontAwesome name="spinner" size={24} color="black" />
      </View>
    );
  }
  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        gap: 10,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Avatar.Image size={100} source={{ uri: userInfo?.avatar }} />
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 24 }}>
          {userInfo?.username}
        </Text>
      </View>

      <View style={{ width: "100%", paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Personal Information
          </Text>
          <ProfileEditModal userInfo={userInfo} />
        </View>

        <View
          style={{
            gap: 10,
            backgroundColor: theme.colors.primaryContainer,
            padding: 20,
            borderRadius: 10,
          }}
        >
          <PersonalInfo iconName="email" title="Email" value={user?.email} />
          <Divider />
          <PersonalInfo
            iconName="cellphone"
            title="Phone"
            value={userInfo?.phone}
          />
          <Divider />
          <PersonalInfo
            iconName="home-map-marker"
            title="Address"
            value={userInfo?.address?.country?.name}
          />
          <Divider />
          <PersonalInfo
            iconName="cake"
            title="Birthday"
            value={
              userInfo?.birthday
                ? new Date(userInfo?.birthday.toDate()).toDateString()
                : "--"
            }
          />
        </View>
      </View>
    </View>
  );
}

function PersonalInfo({
  iconName,
  title,
  value,
}: {
  iconName: string;
  title: string;
  value?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
        }}
      >
        <MaterialCommunityIcons
          name={iconName as any}
          size={24}
          color="black"
        />
        <Text style={{ fontWeight: "400", fontSize: 14 }}>{title}</Text>
      </View>
      <Text style={{ fontWeight: "bold", fontSize: 14 }}>{value ?? "--"}</Text>
    </View>
  );
}
