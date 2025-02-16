import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, Switch, TouchableOpacity, StyleSheet, Platform, Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

const EventForm = ({ visible, onClose, onEventAdded }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [allDay, setAllDay] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Reset form whenever modal opens
  useEffect(() => {
    if (visible) {
      setTitle("");
      setDate(new Date());
      setTime(new Date());
      setAllDay(false);
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Event title is required.");
      return;
    }
  
    const event = {
      title,
      date: format(date, "yyyy-MM-dd"),
      time: allDay ? null : format(time, "hh:mm a"),
      allDay,
    };
  
    try {
      await addDoc(collection(db, "events"), event);
      onEventAdded(); // ✅ Refresh events after adding a new one
      onClose(); // ✅ Close the form after successfully saving the event
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error saving event. Try again.");
    }
  };
  

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create Event</Text>

          {/* Event Title Input */}
          <Text style={styles.label}>Event Title:</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Enter event title"
            returnKeyType="done" // ✅ Shows "Done" on iOS
            blurOnSubmit={false} // ✅ Prevents closing the form
            onSubmitEditing={() => Keyboard.dismiss()} // ✅ Closes the keyboard when "Done" is pressed
          />


          {/* Date Picker (Toggles on tap) */}
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker((prev) => !prev)}
          >
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.dateButtonText}>{format(date, "EEEE, MMMM d")}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "calendar"}
              onChange={(_, selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          {/* Time Picker (Only if all-day is OFF, Toggles on tap) */}
          {!allDay && (
            <>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowTimePicker((prev) => !prev)}
              >
                <Ionicons name="time-outline" size={20} color="#007AFF" />
                <Text style={styles.dateButtonText}>{format(time, "hh:mm a")}</Text>
              </TouchableOpacity>

              {showTimePicker && (
                <View style={styles.eventTimeContainer}>
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display={Platform.OS === "ios" ? "compact" : "clock"}
                    onChange={(_, selectedTime) => {
                      if (selectedTime) setTime(selectedTime);
                    }}
                  />
                </View>
              )}
            </>
          )}

          {/* All Day Toggle */}
          <View style={styles.switchContainer}>
            <Text style={styles.label}>All Day</Text>
            <Switch value={allDay} onValueChange={setAllDay} />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EventForm;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  eventTimeContainer: {
    alignItems: "center", // Keep picker centered
    paddingVertical: 5,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
