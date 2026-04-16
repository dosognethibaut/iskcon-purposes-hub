export interface Purpose {
  id: number;
  number: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  officialText: string;
}

export interface CurrentUser {
  id: number;
  fullName: string;
  email: string;
  dob: string;
  community: string;
  deptRoles: string[];
  photoDataUrl: string | null;
  isAdmin: boolean;
}

interface StoredUser extends CurrentUser {
  password: string;
  surveyAnswers: { questionIndex: number; answers: string[] }[];
  lastLoginAt: string | null;
}

interface StoredActivity {
  id: number;
  purposeId: number;
  userId: number;
  title: string;
  description: string;
  authorName: string;
  createdAt: string;
  approved: boolean;
  scheduledAt: string | null;
  place: string | null;
  minParticipants: number | null;
  maxParticipants: number | null;
  completedAt: string | null;
  completedPhotoDataUrl: string | null;
  participantUserIds: number[];
}

interface StoredMessage {
  id: number;
  purposeId: number;
  userId: number;
  content: string;
  authorName: string;
  createdAt: string;
  approved: boolean;
}

interface StoredComment {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
  userId: number | null;
}

interface StoredNotification {
  id: number;
  userId: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface LocalDb {
  users: StoredUser[];
  activities: StoredActivity[];
  messages: StoredMessage[];
  activityComments: Record<string, StoredComment[]>;
  messageComments: Record<string, StoredComment[]>;
  notifications: StoredNotification[];
}

const STORAGE_KEY = "iskcon_local_db";
const EVENT_NAME = "iskcon-local-data-changed";
const ADMIN_EMAILS = new Set(["iskcon.7purposes@gmail.com"]);

export const PURPOSES: Purpose[] = [
  {
    id: 1,
    number: 1,
    title: "Simple Living",
    shortDescription: "Embrace a natural way of life rooted in spiritual values.",
    fullDescription:
      "One of the foundations of ISKCON is the principle of simple living and high thinking. By choosing a lifestyle free from unnecessary complexity and consumption, we create space for spiritual growth. Simple living means caring for our basic needs without exploitation, living in harmony with nature, and dedicating our time to what truly matters: our relationship with Krishna.",
    officialText:
      "To bring the members closer together for the purpose of teaching a simpler and more natural way of life.",
  },
  {
    id: 2,
    number: 2,
    title: "Community",
    shortDescription: "Build a loving spiritual family on the path together.",
    fullDescription:
      "Community is at the heart of ISKCON life. We are called to create environments where devotees encourage one another, share the journey, and practice devotional service together. A strong community reflects the joy of unity in diversity, where every member feels welcomed, valued, and nourished.",
    officialText:
      "To bring the members of the Society together with each other and nearer to Krishna, the prime entity, and thus to develop the idea within the members, and humanity at large, that each soul is part and parcel of the quality of Godhead (Krishna).",
  },
  {
    id: 3,
    number: 3,
    title: "Holy Place",
    shortDescription: "Create and maintain sacred spaces for transcendence.",
    fullDescription:
      "ISKCON temples and centers are holy places where the divine presence of Krishna is felt. They are sanctuaries where devotees come to worship, hear and chant the holy names, take prasadam, and be spiritually uplifted. Every home of a devotee can also become a holy place - a small temple filled with love and remembrance of God.",
    officialText:
      "To erect for the members and for society at large, a holy place of transcendental pastimes, dedicated to the personality of Krishna.",
  },
  {
    id: 4,
    number: 4,
    title: "Accessing",
    shortDescription: "Open the doors to spiritual knowledge for everyone.",
    fullDescription:
      "ISKCON is committed to making the eternal wisdom of the Vedas accessible to all people, regardless of background or belief. Through books, digital media, educational programs, and personal outreach, we provide everyone the opportunity to encounter the teachings of the Bhagavad-gita and Srimad-Bhagavatam. Accessing is the first step on the path of spiritual awakening.",
    officialText:
      "To systematically propagate spiritual knowledge to society at large and to educate all peoples in the techniques of spiritual life in order to check the imbalance of values in life and to achieve real unity and peace in the world.",
  },
  {
    id: 5,
    number: 5,
    title: "Learning",
    shortDescription: "Deepen understanding through study and devotional hearing.",
    fullDescription:
      "Study and hearing are at the heart of spiritual progress. ISKCON encourages every devotee to deepen their understanding through regular reading of sacred texts, attending classes, and listening to lectures by qualified teachers. Learning transforms information into wisdom, and wisdom into liberation.",
    officialText:
      "To propagate a consciousness of Krishna as it is revealed in the Bhagavad-gita and Srimad-Bhagavatam.",
  },
  {
    id: 6,
    number: 6,
    title: "Applying",
    shortDescription: "Put spiritual principles into practice in daily life.",
    fullDescription:
      "Spiritual knowledge has its full value only when applied. Through sankirtan, service, and daily practice, devotees bring Krishna consciousness into every aspect of life - work, family, and relationships. Applying the teachings is the bridge between hearing and transformation.",
    officialText:
      "To teach and encourage the sankirtan movement, congregational chanting of the holy names of God, as revealed in the teachings of Lord Sri Chaitanya Mahaprabhu.",
  },
  {
    id: 7,
    number: 7,
    title: "Sharing",
    shortDescription: "Spread Krishna consciousness with open hands and heart.",
    fullDescription:
      "The greatest act of compassion is to share Krishna consciousness with those who are searching. Through books, media, conversations, and outreach, every devotee becomes a messenger of hope. Sharing is not just an activity - it is an expression of love for all living beings.",
    officialText:
      "To, with a view towards achieving the aforementioned purposes, publish and distribute periodicals, magazines, books and other writings.",
  },
];

function createEmptyDb(): LocalDb {
  return {
    users: [],
    activities: [],
    messages: [],
    activityComments: {},
    messageComments: {},
    notifications: [],
  };
}

function readDb(): LocalDb {
  if (typeof window === "undefined") return createEmptyDb();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return createEmptyDb();

  try {
    return { ...createEmptyDb(), ...JSON.parse(raw) } as LocalDb;
  } catch {
    return createEmptyDb();
  }
}

function emitChange() {
  window.dispatchEvent(new Event(EVENT_NAME));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

function writeDb(updater: (db: LocalDb) => LocalDb) {
  const nextDb = updater(readDb());
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDb));
  emitChange();
  return nextDb;
}

function nextId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function toCurrentUser(user: StoredUser): CurrentUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    dob: user.dob,
    community: user.community,
    deptRoles: user.deptRoles,
    photoDataUrl: user.photoDataUrl,
    isAdmin: user.isAdmin,
  };
}

function getAuthUserId() {
  const raw = window.localStorage.getItem("auth_token");
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

function saveAuth(user: CurrentUser) {
  window.localStorage.setItem("auth_token", String(user.id));
  window.localStorage.setItem("auth_user", JSON.stringify(user));
}

function clearAuth() {
  window.localStorage.removeItem("auth_token");
  window.localStorage.removeItem("auth_user");
}

function createNotificationInDb(
  db: LocalDb,
  userId: number,
  type: string,
  message: string,
) {
  db.notifications.unshift({
    id: nextId(db.notifications),
    userId,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

function notifyAdminsInDb(db: LocalDb, type: string, message: string) {
  db.users.filter((user) => user.isAdmin).forEach((user) => {
    createNotificationInDb(db, user.id, type, message);
  });
}

function notifyAllMembersInDb(
  db: LocalDb,
  type: string,
  message: string,
  excludeUserId?: number,
) {
  db.users
    .filter((user) => user.id !== excludeUserId)
    .forEach((user) => {
      createNotificationInDb(db, user.id, type, message);
    });
}

function getStoredAuthUser() {
  const userId = getAuthUserId();
  if (!userId) return null;
  const db = readDb();
  const user = db.users.find((item) => item.id === userId);
  return user ? toCurrentUser(user) : null;
}

function enrichActivities(activities: StoredActivity[], currentUser: CurrentUser | null) {
  const db = readDb();
  return activities.map((activity) => {
    const comments = db.activityComments[String(activity.id)] ?? [];
    return {
      ...activity,
      participantCount: activity.participantUserIds.length,
      commentCount: comments.length,
      isJoined: currentUser ? activity.participantUserIds.includes(currentUser.id) : false,
    };
  });
}

function enrichMessages(messages: StoredMessage[]) {
  const db = readDb();
  return messages.map((message) => ({
    ...message,
    commentCount: (db.messageComments[String(message.id)] ?? []).length,
  }));
}

export function subscribeToLocalData(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getPurposes() {
  return PURPOSES;
}

export function getPurpose(id: number) {
  return PURPOSES.find((purpose) => purpose.id === id) ?? null;
}

export function getCurrentUserFromStorage() {
  return getStoredAuthUser();
}

export function registerUser(input: {
  fullName: string;
  email: string;
  password: string;
  dob: string;
  community: string;
  deptRoles: string[];
  photoDataUrl?: string;
  surveyAnswers?: { questionIndex: number; answers: string[] }[];
}) {
  const email = input.email.trim().toLowerCase();
  const existing = readDb().users.find((user) => user.email.toLowerCase() === email);
  if (existing) throw new Error("An account with this email already exists.");

  let createdUser: CurrentUser | null = null;
  writeDb((db) => {
    const user: StoredUser = {
      id: nextId(db.users),
      fullName: input.fullName.trim(),
      email,
      password: input.password,
      dob: input.dob,
      community: input.community,
      deptRoles: input.deptRoles,
      photoDataUrl: input.photoDataUrl ?? null,
      isAdmin: ADMIN_EMAILS.has(email),
      surveyAnswers: input.surveyAnswers ?? [],
      lastLoginAt: new Date().toISOString(),
    };
    db.users.push(user);
    createdUser = toCurrentUser(user);
    return db;
  });

  if (!createdUser) throw new Error("Registration failed.");
  saveAuth(createdUser);
  return { user: createdUser, token: String(createdUser.id) };
}

export function loginUser(email: string, password: string) {
  let loggedInUser: CurrentUser | null = null;
  writeDb((db) => {
    const user = db.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      throw new Error("Invalid email or password.");
    }

    user.isAdmin = ADMIN_EMAILS.has(user.email.toLowerCase());
    user.lastLoginAt = new Date().toISOString();
    loggedInUser = toCurrentUser(user);
    return db;
  });

  if (!loggedInUser) throw new Error("Invalid email or password.");
  saveAuth(loggedInUser);
  return loggedInUser;
}

export function logoutUser() {
  clearAuth();
  emitChange();
}

export function deleteCurrentUserProfile() {
  const userId = getAuthUserId();
  if (!userId) throw new Error("Not authenticated");

  writeDb((db) => {
    db.users = db.users.filter((user) => user.id !== userId);
    db.activities = db.activities.filter((activity) => activity.userId !== userId);
    db.messages = db.messages.filter((message) => message.userId !== userId);
    return db;
  });

  clearAuth();
  emitChange();
}

export function updateCurrentUserProfile(input: {
  fullName: string;
  dob: string;
  community: string;
  deptRoles: string[];
}) {
  const userId = getAuthUserId();
  if (!userId) throw new Error("Not authenticated");

  let updatedUser: CurrentUser | null = null;
  writeDb((db) => {
    const user = db.users.find((item) => item.id === userId);
    if (!user) throw new Error("User not found");
    user.fullName = input.fullName;
    user.dob = input.dob;
    user.community = input.community;
    user.deptRoles = input.deptRoles;
    updatedUser = toCurrentUser(user);
    return db;
  });

  if (!updatedUser) throw new Error("Failed to update profile");
  saveAuth(updatedUser);
  return updatedUser;
}

export function updateCurrentUserPhoto(photoDataUrl: string | null) {
  const userId = getAuthUserId();
  if (!userId) throw new Error("Not authenticated");

  let updatedUser: CurrentUser | null = null;
  writeDb((db) => {
    const user = db.users.find((item) => item.id === userId);
    if (!user) throw new Error("User not found");
    user.photoDataUrl = photoDataUrl;
    updatedUser = toCurrentUser(user);
    return db;
  });

  if (!updatedUser) throw new Error("Failed to update photo");
  saveAuth(updatedUser);
  return updatedUser;
}

export function submitSurveyAnswers(answers: { questionIndex: number; answers: string[] }[]) {
  const userId = getAuthUserId();
  if (!userId) throw new Error("Not authenticated");

  writeDb((db) => {
    const user = db.users.find((item) => item.id === userId);
    if (!user) throw new Error("User not found");
    user.surveyAnswers = answers;
    return db;
  });
}

export function getStats() {
  const now = Date.now();
  const db = readDb();
  return {
    registered: db.users.length,
    connected: db.users.filter((user) => {
      if (!user.lastLoginAt) return false;
      return now - new Date(user.lastLoginAt).getTime() < 24 * 60 * 60 * 1000;
    }).length,
  };
}

export function getNotifications() {
  const userId = getAuthUserId();
  if (!userId) return { unreadCount: 0, notifications: [] as StoredNotification[] };
  const notifications = readDb().notifications
    .filter((item) => item.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return {
    unreadCount: notifications.filter((item) => !item.read).length,
    notifications,
  };
}

export function markNotificationsReadAll() {
  const userId = getAuthUserId();
  if (!userId) return;
  writeDb((db) => {
    db.notifications.forEach((notification) => {
      if (notification.userId === userId) notification.read = true;
    });
    return db;
  });
}

export function getBadges(currentUser: CurrentUser | null) {
  const db = readDb();
  const isAdmin = !!currentUser?.isAdmin;
  const result: Record<number, { activityIds: number[]; messageIds: number[] }> = {};

  for (const purpose of PURPOSES) {
    result[purpose.id] = { activityIds: [], messageIds: [] };
  }

  db.activities.forEach((activity) => {
    if (activity.approved !== !isAdmin) return;
    result[activity.purposeId]?.activityIds.push(activity.id);
  });

  db.messages.forEach((message) => {
    if (message.approved !== !isAdmin) return;
    result[message.purposeId]?.messageIds.push(message.id);
  });

  return result;
}

export function getActivitiesForPurpose(purposeId: number, currentUser: CurrentUser | null) {
  const raw = readDb().activities
    .filter((activity) => activity.purposeId === purposeId)
    .filter((activity) => currentUser?.isAdmin || activity.approved)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return enrichActivities(raw, currentUser);
}

export function getCalendarActivities(currentUser: CurrentUser | null) {
  const raw = readDb().activities
    .filter((activity) => !!activity.scheduledAt)
    .filter((activity) => currentUser?.isAdmin || activity.approved)
    .sort((a, b) => {
      const aTime = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
      const bTime = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
      return aTime - bTime;
    });
  return enrichActivities(raw, currentUser);
}

export function createActivity(
  purposeId: number,
  data: {
    title: string;
    description: string;
    authorName: string;
    scheduledAt?: string | null;
    place?: string | null;
    minParticipants?: number | null;
    maxParticipants?: number | null;
  },
) {
  const currentUser = getStoredAuthUser();
  if (!currentUser) throw new Error("Not authenticated");

  writeDb((db) => {
    const activity: StoredActivity = {
      id: nextId(db.activities),
      purposeId,
      userId: currentUser.id,
      title: data.title,
      description: data.description,
      authorName: data.authorName,
      createdAt: new Date().toISOString(),
      approved: false,
      scheduledAt: data.scheduledAt ?? null,
      place: data.place ?? null,
      minParticipants: data.minParticipants ?? null,
      maxParticipants: data.maxParticipants ?? null,
      completedAt: null,
      completedPhotoDataUrl: null,
      participantUserIds: [],
    };
    db.activities.push(activity);
    notifyAdminsInDb(
      db,
      "activity_pending",
      `New activity proposed by ${activity.authorName}: "${activity.title}"`,
    );
    return db;
  });
}

export function approveActivity(id: number) {
  writeDb((db) => {
    const activity = db.activities.find((item) => item.id === id);
    if (!activity) throw new Error("Activity not found");
    activity.approved = true;
    createNotificationInDb(
      db,
      activity.userId,
      "activity_approved",
      `Your activity "${activity.title}" has been published.`,
    );
    notifyAllMembersInDb(
      db,
      "activity_new",
      `New activity published: "${activity.title}"`,
      activity.userId,
    );
    return db;
  });
}

export function disapproveActivity(id: number) {
  writeDb((db) => {
    const activity = db.activities.find((item) => item.id === id);
    if (!activity) throw new Error("Activity not found");
    activity.approved = false;
    return db;
  });
}

export function completeActivity(id: number, completedPhotoDataUrl?: string) {
  writeDb((db) => {
    const activity = db.activities.find((item) => item.id === id);
    if (!activity) throw new Error("Activity not found");
    activity.completedAt = new Date().toISOString();
    activity.completedPhotoDataUrl = completedPhotoDataUrl ?? null;
    return db;
  });
}

export function uncompleteActivity(id: number) {
  writeDb((db) => {
    const activity = db.activities.find((item) => item.id === id);
    if (!activity) throw new Error("Activity not found");
    activity.completedAt = null;
    activity.completedPhotoDataUrl = null;
    return db;
  });
}

export function joinActivity(id: number) {
  const currentUser = getStoredAuthUser();
  if (!currentUser) throw new Error("Not authenticated");

  writeDb((db) => {
    const activity = db.activities.find((item) => item.id === id);
    if (!activity) throw new Error("Activity not found");
    if (
      activity.maxParticipants &&
      activity.participantUserIds.length >= activity.maxParticipants &&
      !activity.participantUserIds.includes(currentUser.id)
    ) {
      throw new Error("Activity is full");
    }
    if (!activity.participantUserIds.includes(currentUser.id)) {
      activity.participantUserIds.push(currentUser.id);
      if (activity.userId !== currentUser.id) {
        createNotificationInDb(
          db,
          activity.userId,
          "activity_joined",
          `${currentUser.fullName} joined your activity "${activity.title}"`,
        );
      }
    }
    return db;
  });
}

export function leaveActivity(id: number) {
  const currentUser = getStoredAuthUser();
  if (!currentUser) throw new Error("Not authenticated");

  writeDb((db) => {
    const activity = db.activities.find((item) => item.id === id);
    if (!activity) throw new Error("Activity not found");
    activity.participantUserIds = activity.participantUserIds.filter((userId) => userId !== currentUser.id);
    return db;
  });
}

export function deleteActivity(id: number) {
  writeDb((db) => {
    db.activities = db.activities.filter((item) => item.id !== id);
    delete db.activityComments[String(id)];
    return db;
  });
}

export function getMessagesForPurpose(purposeId: number, currentUser: CurrentUser | null) {
  const raw = readDb().messages
    .filter((message) => message.purposeId === purposeId)
    .filter((message) => currentUser?.isAdmin || message.approved)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return enrichMessages(raw);
}

export function createMessage(
  purposeId: number,
  data: { content: string; authorName: string },
) {
  const currentUser = getStoredAuthUser();
  if (!currentUser) throw new Error("Not authenticated");

  writeDb((db) => {
    const message: StoredMessage = {
      id: nextId(db.messages),
      purposeId,
      userId: currentUser.id,
      content: data.content,
      authorName: data.authorName,
      createdAt: new Date().toISOString(),
      approved: false,
    };
    db.messages.push(message);
    notifyAdminsInDb(
      db,
      "message_pending",
      `New message proposed by ${message.authorName}`,
    );
    return db;
  });
}

export function approveMessage(id: number) {
  writeDb((db) => {
    const message = db.messages.find((item) => item.id === id);
    if (!message) throw new Error("Message not found");
    message.approved = true;
    createNotificationInDb(
      db,
      message.userId,
      "message_approved",
      "Your message has been published.",
    );
    notifyAllMembersInDb(
      db,
      "message_new",
      `New message published by ${message.authorName}`,
      message.userId,
    );
    return db;
  });
}

export function disapproveMessage(id: number) {
  writeDb((db) => {
    const message = db.messages.find((item) => item.id === id);
    if (!message) throw new Error("Message not found");
    message.approved = false;
    return db;
  });
}

export function deleteMessage(id: number) {
  writeDb((db) => {
    db.messages = db.messages.filter((item) => item.id !== id);
    delete db.messageComments[String(id)];
    return db;
  });
}

export function getComments(itemType: "activity" | "message", itemId: number) {
  const db = readDb();
  return [...(itemType === "activity"
    ? db.activityComments[String(itemId)] ?? []
    : db.messageComments[String(itemId)] ?? [])];
}

export function addComment(
  itemType: "activity" | "message",
  itemId: number,
  content: string,
) {
  const currentUser = getStoredAuthUser();
  if (!currentUser) throw new Error("Not authenticated");

  writeDb((db) => {
    const key = String(itemId);
    const target =
      itemType === "activity" ? db.activityComments : db.messageComments;
    const comment: StoredComment = {
      id: nextId(target[key] ?? []),
      authorName: currentUser.fullName,
      content,
      createdAt: new Date().toISOString(),
      userId: currentUser.id,
    };
    target[key] = [...(target[key] ?? []), comment];

    if (itemType === "activity") {
      const activity = db.activities.find((item) => item.id === itemId);
      if (activity && activity.userId !== currentUser.id) {
        createNotificationInDb(
          db,
          activity.userId,
          "activity_comment",
          `${currentUser.fullName} replied to your activity "${activity.title}"`,
        );
      }
    } else {
      const message = db.messages.find((item) => item.id === itemId);
      if (message && message.userId !== currentUser.id) {
        createNotificationInDb(
          db,
          message.userId,
          "message_comment",
          `${currentUser.fullName} replied to your message`,
        );
      }
    }

    return db;
  });
}
