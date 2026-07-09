export const mockPets = [
  {
    id: "pet-1",
    name: "Luna",
    species: "Dog",
    breed: "Golden Retriever",
    gender: "Female",
    birthDate: "2023-04-15",
    weight: 28.5,
    color: "Golden",
    microchip: "985112000123456",
    profileImage: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop&q=80"
    ],
    medicalHistory: [
      {
        id: "med-1-1",
        date: "2026-01-10",
        type: "Checkup",
        notes: "Routine checkup. Overall excellent condition, heart sounds clear, teeth clean.",
        diagnosis: "Healthy",
        vet: "Dr. Sarah Wilson"
      },
      {
        id: "med-1-2",
        date: "2025-08-14",
        type: "Treatment",
        notes: "Mild ear infection treated with antibiotics drops. Follow-up show full recovery.",
        diagnosis: "Otitis Externa",
        vet: "Dr. Sarah Wilson"
      }
    ],
    vaccinations: [
      {
        id: "vac-1-1",
        name: "Rabies",
        dateAdministered: "2025-07-10",
        dateDue: "2026-07-10",
        status: "Vaccination Due",
        notes: "3-year booster next year"
      },
      {
        id: "vac-1-2",
        name: "DHPP",
        dateAdministered: "2025-07-10",
        dateDue: "2026-07-10",
        status: "Vaccination Due",
        notes: "Core vaccine booster"
      },
      {
        id: "vac-1-3",
        name: "Leptospirosis",
        dateAdministered: "2026-01-10",
        dateDue: "2027-01-10",
        status: "Completed",
        notes: "Annual vaccine"
      }
    ],
    feedingPreferences: {
      foodType: "Dry Kibble & Salmon Oil",
      frequency: "2 times daily",
      portionSize: "2 cups",
      allergies: "None",
      notes: "Serve breakfast at 8:00 AM and dinner at 7:00 PM."
    },
    documents: [
      {
        id: "doc-1-1",
        name: "Luna_Health_Certificate.pdf",
        uploadDate: "2025-07-10",
        type: "Medical Record",
        fileUrl: "#"
      },
      {
        id: "doc-1-2",
        name: "Microchip_Registration.pdf",
        uploadDate: "2025-04-20",
        type: "Registration",
        fileUrl: "#"
      }
    ],
    appointments: [
      {
        id: "apt-1-1",
        date: "2026-07-12",
        time: "10:30 AM",
        reason: "Annual Vaccinations & Checkup",
        status: "Upcoming",
        doctor: "Dr. Sarah Wilson"
      }
    ],
    healthScore: 94,
    owner: "Shreyash Sharma",
    weightHistory: [
      { date: "2025-10-15", weight: 26.8 },
      { date: "2025-12-15", weight: 27.2 },
      { date: "2026-02-15", weight: 27.9 },
      { date: "2026-04-15", weight: 28.1 },
      { date: "2026-06-15", weight: 28.5 }
    ]
  },
  {
    id: "pet-2",
    name: "Milo",
    species: "Cat",
    breed: "Persian",
    gender: "Male",
    birthDate: "2024-06-20",
    weight: 5.2,
    color: "White",
    microchip: "985112000554433",
    profileImage: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80"
    ],
    medicalHistory: [
      {
        id: "med-2-1",
        date: "2025-12-05",
        type: "Checkup",
        notes: "Grooming consultation. Trimming required around eyes to avoid staining.",
        diagnosis: "Healthy",
        vet: "Dr. John Carter"
      }
    ],
    vaccinations: [
      {
        id: "vac-2-1",
        name: "FVRCP",
        dateAdministered: "2025-06-18",
        dateDue: "2026-06-18",
        status: "Overdue",
        notes: "Booster vaccination overdue"
      },
      {
        id: "vac-2-2",
        name: "Feline Leukemia",
        dateAdministered: "2025-06-18",
        dateDue: "2026-06-18",
        status: "Overdue",
        notes: "Booster vaccination overdue"
      }
    ],
    feedingPreferences: {
      foodType: "Wet Canned Food (Tuna)",
      frequency: "3 times daily",
      portionSize: "1 can (85g)",
      allergies: "Chicken grain-free diet",
      notes: "Milo prefers food at room temperature."
    },
    documents: [
      {
        id: "doc-2-1",
        name: "Milo_Vax_Report.pdf",
        uploadDate: "2025-06-18",
        type: "Vaccination",
        fileUrl: "#"
      }
    ],
    appointments: [
      {
        id: "apt-2-1",
        date: "2026-07-18",
        time: "04:00 PM",
        reason: "FVRCP & FeLV Boosters",
        status: "Scheduled",
        doctor: "Dr. John Carter"
      }
    ],
    healthScore: 78,
    owner: "Shreyash Sharma",
    weightHistory: [
      { date: "2025-08-20", weight: 4.5 },
      { date: "2025-11-20", weight: 4.8 },
      { date: "2026-02-20", weight: 5.0 },
      { date: "2026-05-20", weight: 5.2 }
    ]
  },
  {
    id: "pet-3",
    name: "Rocky",
    species: "Dog",
    breed: "German Shepherd",
    gender: "Male",
    birthDate: "2021-11-02",
    weight: 36.2,
    color: "Black & Tan",
    microchip: "985112000889900",
    profileImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80"
    ],
    medicalHistory: [
      {
        id: "med-3-1",
        date: "2026-03-04",
        type: "Surgery",
        notes: "Dental scaling and tooth extraction. Recovered well.",
        diagnosis: "Periodontitis",
        vet: "Dr. Sarah Wilson"
      },
      {
        id: "med-3-2",
        date: "2026-06-25",
        type: "Injury",
        notes: "Minor paw laceration. Cleaned, bandaged, and prescribed pain relief.",
        diagnosis: "Paw abrasion",
        vet: "Dr. Sarah Wilson"
      }
    ],
    vaccinations: [
      {
        id: "vac-3-1",
        name: "Rabies",
        dateAdministered: "2024-11-15",
        dateDue: "2027-11-15",
        status: "Completed",
        notes: "3-year vaccination"
      },
      {
        id: "vac-3-2",
        name: "DHPP",
        dateAdministered: "2025-11-15",
        dateDue: "2026-11-15",
        status: "Completed",
        notes: "Annual core vaccine"
      }
    ],
    feedingPreferences: {
      foodType: "Raw Beef & Vegetables",
      frequency: "2 times daily",
      portionSize: "400g",
      allergies: "Dairy",
      notes: "Rocky eats quickly, use a slow feeder bowl."
    },
    documents: [],
    appointments: [],
    healthScore: 89,
    owner: "Shreyash Sharma",
    weightHistory: [
      { date: "2025-07-02", weight: 35.0 },
      { date: "2025-10-02", weight: 35.5 },
      { date: "2026-01-02", weight: 35.8 },
      { date: "2026-04-02", weight: 36.2 }
    ]
  }
];

export const pets = mockPets; // Alias

export function getStoredPets() {
  if (typeof window === "undefined") return mockPets;
  const data = localStorage.getItem("petverse_pets");
  if (!data) {
    localStorage.setItem("petverse_pets", JSON.stringify(mockPets));
    return mockPets;
  }
  return JSON.parse(data);
}

export function saveStoredPets(petsList) {
  if (typeof window !== "undefined") {
    localStorage.setItem("petverse_pets", JSON.stringify(petsList));
  }
}
