// js/notifications.js
import { messaging, db, COLLECTIONS, state } from "./firebase.js";
import { doc, updateDoc, arrayUnion } 
  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getToken } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging.js";

const VAPID_KEY = "REPLACE_WITH_YOUR_VAPID_KEY";

export async function initNotifications() {
  if (!("Notification" in window)) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (!token || !state.currentUserId) return;

    state.fcmToken = token;

    const ref = doc(db, COLLECTIONS.USERS, state.currentUserId);
    await updateDoc(ref, {
      tokens: arrayUnion(token),
    });
  } catch (err) {
    console.warn("Notification init error", err);
  }
}
