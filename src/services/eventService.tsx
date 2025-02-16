import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Define event type
export type Event = {
  id: string;
  title: string;
  date: string; // Ensure date is defined
  time?: string | null;
  allDay: boolean;
};

export const deleteEventFromFirestore = async (eventId) => {
  try {
    await deleteDoc(doc(db, "events", eventId));
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

export const addEventToFirestore = async (event: Omit<Event, "id">) => {
  try {
    await addDoc(collection(db, "events"), event);
    console.log("Event added:", event);
  } catch (error) {
    console.error("Error adding event:", error);
  }
};

export const getEventsFromFirestore = async (): Promise<Event[]> => {
  try {
    const eventsQuery = query(collection(db, "events"), orderBy("date", "asc"));
    const querySnapshot = await getDocs(eventsQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      date: doc.data().date || "2025-01-01", // Default date if missing
      time: doc.data().time || null,
      allDay: doc.data().allDay ?? false,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
