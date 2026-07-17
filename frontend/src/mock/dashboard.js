export const vaccinations = [{
    id:1,
    petName:"Luna",
    vaccine:"Rabies vaccine",
    dueDate: "10 Jul 2026",
    daysLeft:2,
    status: "upcoming",
    },
    {
        id:2,
        petName : "Milo",
        vaccine: "DHPP Booster",
        dueDate:"18 Jul 2026",
        daysLeft: 10,
        status:"scheduled"
    }
]

export const aiInsights = [
  {
    id: 1,
    type: "Health",
    title: "Luna's activity has decreased",
    description:
      "Compared to the last 7 days, Luna has been 18% less active. Consider a longer evening walk.",
    priority: "medium",
  },
  {
    id: 2,
    type: "Nutrition",
    title: "Protein intake looks perfect",
    description:
      "Your current feeding schedule is well balanced for Luna's age and weight.",
    priority: "low",
  },
  {
    id: 3,
    type: "Reminder",
    title: "Vaccination due soon",
    description:
      "Rabies vaccine is due in 2 days. Book an appointment to stay protected.",
    priority: "high",
  },
];

export const feedingSchedule = [
  {
    id: 1,
    pet: "Luna",
    meal: "Breakfast",
    time: "08:00 AM",
    completed: true,
  },
  {
    id: 2,
    pet: "Luna",
    meal: "Lunch",
    time: "01:00 PM",
    completed: false,
  },
  {
    id: 3,
    pet: "Milo",
    meal: "Dinner",
    time: "07:30 PM",
    completed: false,
  },
];

export const appointments = [
  {
    id: 1,
    pet: "Luna",
    doctor: "Dr. Sarah Wilson",
    clinic: "Happy Paws Veterinary Clinic",
    date: "12 Jul 2026",
    time: "10:30 AM",
    status: "Upcoming",
  },
  {
    id: 2,
    pet: "Milo",
    doctor: "Dr. John Carter",
    clinic: "Pet Care Center",
    date: "18 Jul 2026",
    time: "04:00 PM",
    status: "Scheduled",
  },
];

export const activityTimeline = [
  {
    id: 1,
    time: "08:00 AM",
    title: "Luna finished breakfast",
    description: "Meal marked as completed.",
    type: "feeding",
  },
  {
    id: 2,
    time: "09:15 AM",
    title: "AI generated a health insight",
    description: "Recommended increasing activity by 20 minutes.",
    type: "ai",
  },
  {
    id: 3,
    time: "11:30 AM",
    title: "Vaccination reminder created",
    description: "Rabies vaccine due in 2 days.",
    type: "vaccine",
  },
  {
    id: 4,
    time: "Yesterday",
    title: "Vet appointment booked",
    description: "Happy Paws Veterinary Clinic",
    type: "appointment",
  },
];

export const quickActions = [
  {
    id: 1,
    title: "Add New Pet",
    description: "Create a new pet profile.",
    icon: "paw",
    path: "/pets/new",
  },
  {
    id: 2,
    title: "Book Vet",
    description: "Schedule a vet appointment.",
    icon: "calendar",
    path: "/appointments/new",
  },
  {
    id: 3,
    title: "Ask AI",
    description: "Get instant pet care advice.",
    icon: "bot",
    path: "/ai",
  },
  {
    id: 4,
    title: "Pet Shop",
    description: "Browse food & accessories.",
    icon: "shop",
    path: "/shop",
  },
  {
    id: 5,
    title: "Health Records",
    description: "Update medical history.",
    icon: "heart",
    path: "/health",
  },
  {
    id: 6,
    title: "Adoption",
    description: "Find your next companion.",
    icon: "home",
    path: "/adoption",
  },
];