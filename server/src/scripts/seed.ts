import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import type { UserRole } from "../constants/roles.js";
import { Attendance } from "../models/Attendance.js";
import { Department } from "../models/Department.js";
import { Employee } from "../models/Employee.js";
import { User } from "../models/User.js";
import { getCurrentDateKey, parseDateKey } from "../utils/date.js";

const departments = [
  { name: "HR", description: "People operations, hiring, and employee experience." },
  { name: "IT", description: "Product engineering and internal technology." },
  { name: "Finance", description: "Planning, accounting, and financial operations." },
  { name: "Marketing", description: "Brand, growth, and customer communications." },
];

const employees = [
  { name: "Ali Khan", email: "ali.khan@staffflow.demo", department: "IT", status: "Active" },
  { name: "Sara Ahmed", email: "sara.ahmed@staffflow.demo", department: "HR", status: "Active" },
  { name: "Usman Tariq", email: "usman.tariq@staffflow.demo", department: "Finance", status: "Inactive" },
  { name: "Ayesha Malik", email: "ayesha.malik@staffflow.demo", department: "Marketing", status: "Active" },
  { name: "Hamza Iqbal", email: "hamza.iqbal@staffflow.demo", department: "IT", status: "Active" },
  { name: "Mariam Noor", email: "mariam.noor@staffflow.demo", department: "Finance", status: "Active" },
  { name: "Bilal Hussain", email: "bilal.hussain@staffflow.demo", department: "Marketing", status: "Active" },
  { name: "Zainab Raza", email: "zainab.raza@staffflow.demo", department: "HR", status: "Active" },
  { name: "Omar Farooq", email: "omar.farooq@staffflow.demo", department: "IT", status: "Inactive" },
  { name: "Hina Shah", email: "hina.shah@staffflow.demo", department: "Marketing", status: "Active" },
  { name: "Daniyal Saeed", email: "daniyal.saeed@staffflow.demo", department: "Finance", status: "Active" },
  { name: "Mehwish Anwar", email: "mehwish.anwar@staffflow.demo", department: "HR", status: "Active" },
] as const;

async function seedUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const email = input.email.toLowerCase();
  const password = await bcrypt.hash(input.password, 12);
  const user = await User.findOneAndUpdate(
    { email },
    {
      $setOnInsert: {
        name: input.name,
        email,
        password,
        role: input.role,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  if (user.role !== input.role) {
    throw new Error(
      `Seed user ${email} already exists with role ${user.role}; its role was not changed.`,
    );
  }

  return user;
}

async function seed() {
  if (!env.SEED_ADMIN_NAME || !env.SEED_ADMIN_EMAIL || !env.SEED_ADMIN_PASSWORD) {
    throw new Error(
      "SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, and SEED_ADMIN_PASSWORD are required to seed StaffFlow.",
    );
  }
  if (!env.SEED_DEMO_NAME || !env.SEED_DEMO_EMAIL || !env.SEED_DEMO_PASSWORD) {
    throw new Error(
      "SEED_DEMO_NAME, SEED_DEMO_EMAIL, and SEED_DEMO_PASSWORD are required to seed StaffFlow.",
    );
  }

  await connectDatabase();

  const departmentIds = new Map<string, unknown>();
  for (const departmentData of departments) {
    const department = await Department.findOneAndUpdate(
      { name: departmentData.name },
      { $set: departmentData },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
    departmentIds.set(department.name, department._id);
  }

  const seededEmployees = [];
  for (const employeeData of employees) {
    const employee = await Employee.findOneAndUpdate(
      { email: employeeData.email },
      {
        $set: {
          ...employeeData,
          department: departmentIds.get(employeeData.department),
        },
      },
      {
        returnDocument: "after",
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
    seededEmployees.push(employee);
  }

  await seedUser({
    name: env.SEED_ADMIN_NAME,
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
    role: "admin",
  });
  await seedUser({
    name: env.SEED_DEMO_NAME,
    email: env.SEED_DEMO_EMAIL,
    password: env.SEED_DEMO_PASSWORD,
    role: "demo",
  });

  const today = parseDateKey(getCurrentDateKey());
  const statuses = ["Present", "Present", "Present", "Absent", "Leave"] as const;
  const activeEmployees = seededEmployees.filter((employee) => employee.status === "Active");
  await Attendance.bulkWrite(
    activeEmployees.map((employee, index) => ({
      updateOne: {
        filter: { employee: employee._id, date: today },
        update: { $set: { status: statuses[index % statuses.length] } },
        upsert: true,
      },
    })),
  );

  console.log(
    `Seeded ${departments.length} departments, ${seededEmployees.length} employees, today's attendance, admin ${env.SEED_ADMIN_EMAIL}, and demo ${env.SEED_DEMO_EMAIL}.`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error("StaffFlow seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
