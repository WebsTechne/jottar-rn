import { Note } from "@/types/notes";

const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api`;

export async function getNotes(): Promise<Note[]> {
  const response = await fetch(`${API_URL}/notes`);
  const data = await response.json();
  console.table(data);

  return data;
}
export async function getOverviewNotes(): Promise<Note[]> {
  const response = await fetch(`${API_URL}/notes?mode=overview`);
  const data = await response.json();

  return data;
}
