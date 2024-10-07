import db from "@/config/db";
import { useAuth } from "@/context/auth";
import { AntDesign } from "@expo/vector-icons";
import {
  average,
  collection,
  getAggregateFromServer,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { IconButton } from "react-native-paper";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

export default function CrystalReport() {
  const { user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const getTotalUser = () => {
    getDocs(collection(db, "users"))
      .then((querySnapshot) => {
        setTotalUsers(querySnapshot.size);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTotalPost = () => {
    getDocs(collection(db, "posts"))
      .then((querySnapshot) => {
        setTotalPosts(querySnapshot.size);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAverageRating = () => {
    getAggregateFromServer(collection(db, "rating"), {
      totalRating: average("rating"),
    })
      .then((data) => {
        setAverageRating(data.data().totalRating || 0);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDownloadReport = async () => {
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
        }
        .report-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
        }
        .report-item {
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #fafafa;
        }
    </style>
</head>
<body>

<div class="report-container">
    <h1>Signify App Report</h1>
    <div class="report-item">
        <strong>Total Users:</strong> <span id="total-users">${totalUsers}</span>
    </div>
    <div class="report-item">
        <strong>Average Rating:</strong> <span id="average-rating">${averageRating}</span>
    </div>
    <div class="report-item">
        <strong>Total Number of Posts:</strong> <span id="total-posts">${totalPosts}</span>
    </div>
</div>

</body>
</html>
`;

    const { uri } = await printToFileAsync({
      html,
      base64: true,
    });

    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  useEffect(() => {
    getTotalUser();
    getTotalPost();
    getAverageRating();
  }, []);
  return (
    <IconButton
      icon={() => <AntDesign name="right" size={24} color="black" />}
      onPress={handleDownloadReport}
    />
  );
}
