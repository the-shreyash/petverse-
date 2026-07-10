export const mockHealthRecords = [
  {
    id: "rec-1-1",
    petId: "pet-1",
    visitDate: "2026-06-15",
    veterinarian: "Dr. Sarah Wilson",
    clinic: "Oakwood Veterinary Hospital",
    healthScore: 94,
    weight: 28.5,
    temperature: 38.4,
    heartRate: 92,
    diagnosis: "Annual Physical Exam & Vaccination Booster",
    treatment: "Routine clinical assessment. Administered annual booster shots.",
    prescriptions: [],
    vaccinations: [
      {
        name: "Leptospirosis",
        status: "Completed",
        dateAdministered: "2026-06-15",
        dateDue: "2027-06-15",
        reminderStatus: "Active",
        notes: "Annual booster dose"
      }
    ],
    medications: [],
    attachments: [
      {
        id: "att-1-1",
        name: "Luna_Health_Certificate.pdf",
        category: "Certificate",
        uploadDate: "2026-06-15",
        url: "#"
      }
    ],
    notes: "Luna is in excellent physiological shape. Coat is shiny, joints show no stiffness, and lungs/heart sound healthy.",
    followUpDate: "2027-06-15"
  },
  {
    id: "rec-1-2",
    petId: "pet-1",
    visitDate: "2026-01-10",
    veterinarian: "Dr. Sarah Wilson",
    clinic: "Oakwood Veterinary Hospital",
    healthScore: 88,
    weight: 27.9,
    temperature: 38.9,
    heartRate: 105,
    diagnosis: "Otitis Externa (Mild Ear Infection)",
    treatment: "Thorough ear canal cleansing. Applied topical antibiotic solution.",
    prescriptions: [
      {
        name: "Anotix Drops",
        dosage: "3 drops per ear",
        frequency: "Twice daily",
        duration: "7 days"
      }
    ],
    vaccinations: [],
    medications: [
      {
        name: "Anotix Drops",
        dosage: "3 drops per ear",
        frequency: "Twice daily",
        duration: "7 days",
        completed: true,
        missed: false
      }
    ],
    attachments: [
      {
        id: "att-1-2",
        name: "Ear_Swab_Lab_Report.pdf",
        category: "Lab Result",
        uploadDate: "2026-01-10",
        url: "#"
      }
    ],
    notes: "Advised owner to avoid water entry into the ear canal during baths. Schedule review if scratching persists.",
    followUpDate: "2026-01-20"
  },
  {
    id: "rec-2-1",
    petId: "pet-2",
    visitDate: "2025-12-05",
    veterinarian: "Dr. John Carter",
    clinic: "Oakwood Veterinary Hospital",
    healthScore: 78,
    weight: 4.8,
    temperature: 38.1,
    heartRate: 120,
    diagnosis: "Feline Plaque Accumulation",
    treatment: "Ultrasonic scaling recommended. Prescribed enzyme dental chews.",
    prescriptions: [],
    vaccinations: [],
    medications: [],
    attachments: [],
    notes: "Persian eyes present typical tear-staining. Clean daily with saline wipes. Schedule dental scaling soon.",
    followUpDate: "2026-06-05"
  },
  {
    id: "rec-3-1",
    petId: "pet-3",
    visitDate: "2026-06-25",
    veterinarian: "Dr. Sarah Wilson",
    clinic: "Oakwood Veterinary Hospital",
    healthScore: 85,
    weight: 36.2,
    temperature: 39.1,
    heartRate: 115,
    diagnosis: "Paw Laceration & Inflammation",
    treatment: "Cleaned minor glass cut, applied antiseptic dressing and bandaged.",
    prescriptions: [
      {
        name: "Meloxicam Oral Suspension",
        dosage: "1.5mg",
        frequency: "Once daily with food",
        duration: "5 days"
      }
    ],
    vaccinations: [],
    medications: [
      {
        name: "Meloxicam Oral Suspension",
        dosage: "1.5mg",
        frequency: "Once daily with food",
        duration: "5 days",
        completed: true,
        missed: false
      }
    ],
    attachments: [
      {
        id: "att-3-1",
        name: "Rocky_Post_Treatment_Care.pdf",
        category: "Reports",
        uploadDate: "2026-06-25",
        url: "#"
      }
    ],
    notes: "Keep bandage dry and prevent biting. Restrict active outdoor play for 5 days.",
    followUpDate: "2026-07-02"
  },
  {
    id: "rec-3-2",
    petId: "pet-3",
    visitDate: "2026-03-04",
    veterinarian: "Dr. Sarah Wilson",
    clinic: "Oakwood Veterinary Hospital",
    healthScore: 89,
    weight: 35.8,
    temperature: 38.5,
    heartRate: 95,
    diagnosis: "Periodontitis (Grade 2)",
    treatment: "Comprehensive scaling, polishing, and extraction of one upper left premolar.",
    prescriptions: [
      {
        name: "Clindamycin Drops",
        dosage: "150mg",
        frequency: "Twice daily",
        duration: "7 days"
      }
    ],
    vaccinations: [],
    medications: [
      {
        name: "Clindamycin Drops",
        dosage: "150mg",
        frequency: "Twice daily",
        duration: "7 days",
        completed: true,
        missed: false
      }
    ],
    attachments: [
      {
        id: "att-3-2",
        name: "Dental_Xray_Rocky.pdf",
        category: "Lab Result",
        uploadDate: "2026-03-04",
        url: "#"
      }
    ],
    notes: "Soft diet for 5-7 days. Re-check suture line in one week.",
    followUpDate: "2026-03-11"
  }
];

export const mockAppointments = [
  {
    id: "apt-1",
    petId: "pet-1",
    visitDate: "2026-07-12",
    time: "10:30 AM",
    reason: "Annual Vaccinations & Checkup",
    status: "Upcoming",
    veterinarian: "Dr. Sarah Wilson",
    clinic: "Oakwood Veterinary Hospital",
    notes: "Fast 8 hours prior if bloodwork is needed."
  },
  {
    id: "apt-2",
    petId: "pet-2",
    visitDate: "2026-07-18",
    time: "04:00 PM",
    reason: "FVRCP & FeLV Booster Immunizations",
    status: "Upcoming",
    veterinarian: "Dr. John Carter",
    clinic: "Oakwood Veterinary Hospital",
    notes: "Milo is easily stressed in carriers; administer calming treat 30 mins before."
  }
];

export const mockEmergencyContacts = [
  {
    id: "contact-1",
    name: "Oakwood Veterinary Emergency Hospital",
    phone: "+1 (555) 911-3030",
    availability: "Open 24/7",
    role: "Primary Emergency Clinic",
    address: "742 Evergreen Terrace, Medical District"
  },
  {
    id: "contact-2",
    name: "ASPCA Poison Control Helpline",
    phone: "+1 (888) 426-4435",
    availability: "Open 24/7",
    role: "Toxic Substance Support",
    address: "National hotline (Consultation fees may apply)"
  },
  {
    id: "contact-3",
    name: "Dr. Sarah Wilson (Mobile Page)",
    phone: "+1 (555) 019-2831",
    availability: "Mon-Fri 8:00 AM - 6:00 PM",
    role: "Primary Veterinarian Care",
    address: "Direct mobile line for emergency advice"
  }
];

export function getStoredHealthRecords() {
  if (typeof window === "undefined") return mockHealthRecords;
  const data = localStorage.getItem("petverse_health_records");
  if (!data) {
    localStorage.setItem("petverse_health_records", JSON.stringify(mockHealthRecords));
    return mockHealthRecords;
  }
  return JSON.parse(data);
}

export function saveStoredHealthRecords(records) {
  if (typeof window !== "undefined") {
    localStorage.setItem("petverse_health_records", JSON.stringify(records));
  }
}

export function getStoredAppointments() {
  if (typeof window === "undefined") return mockAppointments;
  const data = localStorage.getItem("petverse_appointments");
  if (!data) {
    localStorage.setItem("petverse_appointments", JSON.stringify(mockAppointments));
    return mockAppointments;
  }
  return JSON.parse(data);
}

export function saveStoredAppointments(appointments) {
  if (typeof window !== "undefined") {
    localStorage.setItem("petverse_appointments", JSON.stringify(appointments));
  }
}

export function getStoredEmergencyContacts() {
  if (typeof window === "undefined") return mockEmergencyContacts;
  const data = localStorage.getItem("petverse_emergency_contacts");
  if (!data) {
    localStorage.setItem("petverse_emergency_contacts", JSON.stringify(mockEmergencyContacts));
    return mockEmergencyContacts;
  }
  return JSON.parse(data);
}

export function saveStoredEmergencyContacts(contacts) {
  if (typeof window !== "undefined") {
    localStorage.setItem("petverse_emergency_contacts", JSON.stringify(contacts));
  }
}
