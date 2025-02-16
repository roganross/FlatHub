import React, { useState, useEffect, useRef } from "react";
import { View, Text, SectionList, TouchableOpacity, StyleSheet, RefreshControl, Animated } from "react-native";
import { getEventsFromFirestore, deleteEventFromFirestore } from "../services/eventService";
import EventForm from "../components/EventForm";
import { format, isBefore, parseISO, isToday, isTomorrow, subDays } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

const EventPage = () => {
  const [events, setEvents] = useState<{ title: string; data: any[] }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const swipeRefs = useRef<{ [key: string]: Swipeable | null }>({}); // Store Swipeable refs

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setRefreshing(true);

    const today = new Date();
    const yesterday = subDays(today, 1);
    const fetchedEvents = await getEventsFromFirestore();

    // ✅ Automatically remove only yesterday's events
    const filteredEvents = fetchedEvents.filter((event) => {
      const eventDate = parseISO(event.date);
      return !isBefore(eventDate, yesterday);
    });

    // ✅ Group events under "Today" / "Tomorrow" / Specific Date
    const groupedEvents = filteredEvents.reduce((acc, event) => {
      const eventDate = parseISO(event.date);
      let dateKey = format(eventDate, "EEEE, MMMM d");

      if (isToday(eventDate)) {
        dateKey = "Today";
      } else if (isTomorrow(eventDate)) {
        dateKey = "Tomorrow";
      }

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, any[]>);

    // ✅ Sort events inside each section
    const sections = Object.keys(groupedEvents).map((date) => ({
      title: date,
      data: groupedEvents[date].sort((a, b) => (a.time || "00:00") > (b.time || "00:00") ? 1 : -1),
    }));

    setEvents(sections);
    setRefreshing(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventFromFirestore(eventId);
      setEvents((prevEvents) =>
        prevEvents
          .map((section) => ({
            ...section,
            data: section.data.filter((event) => event.id !== eventId),
          }))
          .filter((section) => section.data.length > 0)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, eventId: string) => {
    const opacity = progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={[styles.deleteContainer, { opacity }]}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteEvent(eventId)}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SectionList
          sections={events}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <Swipeable
              ref={(ref) => (swipeRefs.current[item.id] = ref)}
              friction={2}
              rightThreshold={40} // Threshold before X appears
              renderRightActions={(progress) => renderRightActions(progress, item.id)}
            >
              <View style={styles.eventItem}>
                <Text style={styles.eventTime}>{item.allDay ? "All Day" : item.time}</Text>
                <Text style={styles.eventTitle}>{item.title}</Text>
              </View>
            </Swipeable>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchEvents} />}
        />

        {/* ✅ Fix: + button now works */}
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        <EventForm
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onEventAdded={fetchEvents} // ✅ Update events after adding
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default EventPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    paddingVertical: 5,
    backgroundColor: "#E0E0E0",
    paddingLeft: 10,
    borderRadius: 5,
  },
  eventItem: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 8,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  deleteContainer: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    width: 60,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 10,
  },
  eventTime: {
    fontSize: 16,
    fontWeight: "bold",
    width: 80,
    color: "#2E86C1",
    textAlign: "right",
    marginRight: 10,
  },
  eventTitle: {
    fontSize: 16,
    flexShrink: 1,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
