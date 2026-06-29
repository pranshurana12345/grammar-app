// ── Edit names and PINs here ─────────────────────────────────────────────────
// Change "name" to the student's real name.
// Change "pin" to any 4-digit code.
// The "color" is the accent colour shown on the login screen.

export type Student = {
  id: string;
  name: string;
  pin: string;
  color: string;
};

export const STUDENTS: Student[] = [
  { id: "s1", name: "Admin",     pin: "1111", color: "#2563eb" },
  { id: "s2", name: "Student 1", pin: "2222", color: "#7c3aed" },
  { id: "s3", name: "Student 2", pin: "3333", color: "#0d9488" },
  { id: "s4", name: "Student 3", pin: "4444", color: "#dc2626" },
  { id: "s5", name: "Student 4", pin: "5555", color: "#d97706" },
];
