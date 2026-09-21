import type { AppEvent } from "@/core/events/types";
import { validateEvent } from "@/core/events/types";
import {
  defaultProfile,
  defaultSettings,
  demoCharacters,
  demoConversations,
  demoEvents,
  demoZonePosts,
  type AIProfile,
  type AppSettings,
  type Character,
  type Conversation,
  type ZonePost,
} from "@/stores/demoData";

const DATABASE_NAME = "qq-companion";
const DATABASE_VERSION = 1;
const stores = ["events", "conversations", "characters", "settings"] as const;
type StoreName = (typeof stores)[number];
type SettingRecord = { id: string; value: unknown };

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      for (const store of stores) {
        if (!database.objectStoreNames.contains(store)) database.createObjectStore(store, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local database."));
  });
}

async function transact<T>(storeName: StoreName, mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const request = operation(transaction.objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error(`Local ${storeName} operation failed.`));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error ?? new Error(`Local ${storeName} transaction failed.`));
  });
}

async function getAll<T>(storeName: StoreName) {
  return transact<T[]>(storeName, "readonly", (store) => store.getAll());
}

async function put<T>(storeName: StoreName, value: T) {
  await transact<IDBValidKey>(storeName, "readwrite", (store) => store.put(value));
}

async function putMany<T>(storeName: StoreName, values: T[]) {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    values.forEach((value) => store.put(value));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error(`Could not seed ${storeName}.`));
  });
  database.close();
}

async function getSetting<T>(id: string): Promise<T | undefined> {
  const record = await transact<SettingRecord | undefined>("settings", "readonly", (store) => store.get(id));
  return record?.value as T | undefined;
}

export async function seedDemoWorkspace() {
  if ((await getAll<AppEvent>("events")).length === 0) await putMany("events", demoEvents.map(validateEvent));
  if ((await getAll<Conversation>("conversations")).length === 0) await putMany("conversations", demoConversations);
  if ((await getAll<Character>("characters")).length === 0) await putMany("characters", demoCharacters);
  if (!(await getSetting<AppSettings>("app"))) await saveSetting(defaultSettings);
  if (!(await getSetting<AIProfile>(defaultProfile.id))) await saveProfile(defaultProfile);
  if (!(await getSetting<ZonePost[]>("zone-posts"))) await put("settings", { id: "zone-posts", value: demoZonePosts });
}

export async function loadWorkspace() {
  const [events, conversations, characters, settings, profile, zonePosts] = await Promise.all([
    getAll<AppEvent>("events"),
    getAll<Conversation>("conversations"),
    getAll<Character>("characters"),
    getSetting<AppSettings>("app"),
    getSetting<AIProfile>(defaultProfile.id),
    getSetting<ZonePost[]>("zone-posts"),
  ]);
  return {
    events: events.map(validateEvent).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    conversations: conversations.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    characters: characters.map((character) => ({
      ...character,
      assets: character.assets ?? demoCharacters.find((item) => item.id === character.id)?.assets,
    })),
    settings: settings ?? defaultSettings,
    profile: profile ?? defaultProfile,
    zonePosts: zonePosts ?? demoZonePosts,
  };
}

export async function appendLocalEvent(event: AppEvent) {
  await put("events", validateEvent(event));
}

export async function listLocalEvents(query: { conversationId?: string; type?: AppEvent["type"] } = {}) {
  const events = (await getAll<AppEvent>("events")).map(validateEvent);
  return events
    .filter((event) => (!query.conversationId || event.conversationId === query.conversationId) && (!query.type || event.type === query.type))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function saveConversation(conversation: Conversation) {
  await put("conversations", conversation);
}

export async function saveSetting(settings: AppSettings) {
  await put("settings", { id: "app", value: settings });
}

export async function saveProfile(profile: AIProfile) {
  await put("settings", { id: profile.id, value: profile });
}
