import db from "@/config/db";
import { user } from "@/constants/type";
import { useAuth } from "@/context/auth";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";

export default function ProfileEditModal({ userInfo }: { userInfo?: user }) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  const [birthday, setBirthday] = useState(
    userInfo?.birthday
      ? new Date(userInfo.birthday.toDate()).toDateString()
      : undefined
  );
  const [username, setUsername] = useState(userInfo?.username);
  const [phone, setPhone] = useState(userInfo?.phone);

  const onChangeBirthday = (value) => {
    setBirthday(value);
  };

  const handleSave = async () => {
    const docRef = doc(db, "users", `${user?.uid}`);

    await setDoc(
      docRef,
      {
        username: username,
        phone: phone,
        birthday: birthday,
      },
      { merge: true }
    )
      .then(() => {
        setVisible(false);
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return (
    <View>
      <Button onPress={showModal} mode="text">
        Edit
      </Button>

      <Portal>
        <Modal
          onDismiss={hideModal}
          visible={visible}
          contentContainerStyle={{
            backgroundColor: "white",
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 20,
            gap: 20,
          }}
        >
          <Text
            variant="titleLarge"
            style={{ fontWeight: "bold", alignSelf: "flex-start" }}
          >
            Edit Profile
          </Text>
          <View style={{ width: "100%", gap: 20 }}>
            <View>
              <Text variant="labelLarge">Change username</Text>

              <TextInput
                mode="outlined"
                label="Username"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View>
              <Text variant="labelLarge">Change birthday</Text>
              <TextInput
                mode="outlined"
                label="Phone"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View>
              <Text variant="labelLarge">Change birthday</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>
                  {birthday
                    ? new Date(birthday).toDateString()
                    : "No date provided"}
                </Text>
                <DatePicker onChangeBirthday={onChangeBirthday} />
              </View>
            </View>
            <Button mode="contained" onPress={handleSave}>
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

function DatePicker({ onChangeBirthday }: any) {
  const [date, setDate] = useState(new Date());
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    onChangeBirthday(new Date(currentDate));
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <Button mode="text" onPress={showDatepicker}>
      Pick Date
    </Button>
  );
}
