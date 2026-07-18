import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

export function useReminder() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReminders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const response = await api.get("/reminders?limit=100");
      setReminders(response.data || []);
    } catch (err) {
      console.error("Failed to fetch reminders", err);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const addReminder = useCallback(async (reminderData) => {
    try {
      const response = await api.post("/reminders", {
        title: reminderData.title,
        description: reminderData.description || "",
        due_date: reminderData.due_date || reminderData.dueDate,
        reminder_type: reminderData.reminder_type || reminderData.type || "GENERAL",
        pet_id: reminderData.pet_id || reminderData.petId || null,
        is_recurring: reminderData.is_recurring || false,
        recurrence_interval: reminderData.recurrence_interval || null
      });
      await fetchReminders();
      return response.data;
    } catch (err) {
      console.error("Failed to add reminder", err);
      throw err;
    }
  }, [fetchReminders]);

  const completeReminder = useCallback(async (id) => {
    try {
      await api.put(`/reminders/${id}`, { is_completed: true });
      await fetchReminders();
    } catch (err) {
      console.error("Failed to complete reminder", err);
    }
  }, [fetchReminders]);

  const deleteReminder = useCallback(async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      setReminders(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error("Failed to delete reminder", err);
    }
  }, []);

  const upcomingReminders = reminders.filter(r => !r.is_completed);

  return {
    reminders,
    upcomingReminders,
    loading,
    addReminder,
    completeReminder,
    deleteReminder,
    refresh: fetchReminders
  };
}
