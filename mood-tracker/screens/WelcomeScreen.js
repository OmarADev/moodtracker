import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Alert,
  Animated,
  PanResponder,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mood options
const moods = [
  { label: "Sad", em: "😢", color: "#FF8C00" },
  { label: "Normal", em: "😐", color: "#FFD700" },
  { label: "Good", em: "😊", color: "#4CAF50" },
  { label: "Happy", em: "😄", color: "#00FF00" },
];

const WelcomeScreen = ({ navigation }) => {
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(0);
  const [note, setNote] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current; // for initial fade in
  const emojiScale = useRef(new Animated.Value(1)).current; // for emoji animation

  useEffect(() => {
    // Fade in animation for all elements
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000, // 1 second fade-in
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSwipe = (direction) => {
    Animated.timing(animatedValue, {
      toValue: direction === "left" ? -100 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (direction === "left") {
        setSelectedMoodIndex((prevIndex) => (prevIndex + 1) % moods.length);
      } else {
        setSelectedMoodIndex(
          (prevIndex) => (prevIndex - 1 + moods.length) % moods.length
        );
      }
      animatedValue.setValue(0);
      // Animate emoji scaling after a swipe
      Animated.spring(emojiScale, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(emojiScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 30;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 30) {
          handleSwipe("right");
        } else if (gestureState.dx < -30) {
          handleSwipe("left");
        }
      },
    })
  ).current;

  const saveMoodEntry = async () => {
    if (!note.trim()) {
      Alert.alert("Please enter a note before saving.");
      return;
    }

    try {
      const moodEntry = {
        mood: moods[selectedMoodIndex].label,
        note,
        date: new Date().toISOString(),
      };
      const storedMoods = await AsyncStorage.getItem("moods");
      const moodList = storedMoods ? JSON.parse(storedMoods) : [];
      moodList.push(moodEntry);
      await AsyncStorage.setItem("moods", JSON.stringify(moodList));

      setModalVisible(false);
      setNote("");
      Alert.alert("Mood saved successfully!");
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.greetingText,
          {
            opacity: fadeInAnim,
          },
        ]}
      >
        How do you feel today?
      </Animated.Text>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.moodContainer,
          {
            transform: [
              { translateX: animatedValue },
              { scale: emojiScale }, // Add scaling effect when emoji is swiped
            ],
          },
        ]}
      >
        <Text style={styles.emoji}>{moods[selectedMoodIndex].em}</Text>
      </Animated.View>

      <View style={styles.moodIndicator}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedMoodIndex(index);
              // Animate emoji scaling on click
              Animated.spring(emojiScale, {
                toValue: 1.2,
                friction: 1,
                useNativeDriver: true,
              }).start(() => {
                Animated.spring(emojiScale, {
                  toValue: 1,
                  friction: 1,
                  useNativeDriver: true,
                }).start();
              });
            }}
          >
            <Text style={styles.moodLabel}>
              {mood.em} {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.setMoodButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.setMoodButtonText}>Note Mood</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Why are you feeling {moods[selectedMoodIndex].label}?
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your thoughts..."
              value={note}
              onChangeText={setNote}
              multiline
            />
            <View style={styles.buttonContainer}>
              <Button title="Save Mood" onPress={saveMoodEntry} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#4A148C", // Changed to a single purple color
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  moodContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    width: 150,
    height: 150,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  moodLabel: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  emoji: {
    fontSize: 80,
  },
  moodIndicator: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  setMoodButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  setMoodButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    width: "100%",
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
