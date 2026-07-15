from enum import Enum

class NotificationType(str, Enum):
    SYSTEM = "SYSTEM"
    REMINDER = "REMINDER"
    SOCIAL = "SOCIAL"
    COMMERCE = "COMMERCE"

class NotificationPriority(str, Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    URGENT = "URGENT"

class NotificationStatus(str, Enum):
    UNREAD = "UNREAD"
    READ = "READ"
    ARCHIVED = "ARCHIVED"

class ReminderType(str, Enum):
    VACCINATION = "VACCINATION"
    MEDICATION = "MEDICATION"
    APPOINTMENT = "APPOINTMENT"
    GENERAL = "GENERAL"

class ReminderStatus(str, Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
