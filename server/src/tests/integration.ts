import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createServer, type Server } from "node:http";
import { MongoMemoryServer } from "mongodb-memory-server";

type JsonRecord = Record<string, unknown>;

async function run() {
  const mongoServer = await MongoMemoryServer.create();
  process.env.NODE_ENV = "test";
  process.env.PORT = "5000";
  process.env.MONGODB_URI = mongoServer.getUri("staffflow-integration");
  process.env.JWT_SECRET = "staffflow-integration-secret-at-least-32-characters";
  process.env.CLIENT_URL = "http://localhost:3000";
  process.env.APP_TIMEZONE = "UTC";
  process.env.ALLOW_REGISTRATION = "true";

  const [{ app }, { connectDatabase, disconnectDatabase }] = await Promise.all([
    import("../app.js"),
    import("../config/database.js"),
  ]);
  await connectDatabase();

  let server: Server | undefined;
  try {
    server = createServer(app);
    await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    assert(address && typeof address === "object");
    const baseUrl = `http://127.0.0.1:${address.port}/api`;
    let cookie = "";

    async function request(
      path: string,
      options: RequestInit & { expectedStatus?: number } = {},
    ) {
      const { expectedStatus = 200, ...requestOptions } = options;
      const headers = new Headers(requestOptions.headers);
      headers.set("Origin", "http://localhost:3000");
      if (requestOptions.body) headers.set("Content-Type", "application/json");
      if (cookie) headers.set("Cookie", cookie);

      const response = await fetch(`${baseUrl}${path}`, { ...requestOptions, headers });
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) cookie = setCookie.split(";", 1)[0] ?? "";
      const body = (await response.json()) as JsonRecord;
      assert.equal(
        response.status,
        expectedStatus,
        `${requestOptions.method ?? "GET"} ${path}: ${JSON.stringify(body)}`,
      );
      return body;
    }

    const registration = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Integration Admin",
        email: "admin@integration.test",
        password: `Test-Aa1-${randomUUID()}`,
      }),
      expectedStatus: 201,
    });
    assert.equal((registration.data as JsonRecord).email, "admin@integration.test");
    assert(cookie.startsWith("staffflow_token="));

    await request("/departments", {
      method: "POST",
      body: JSON.stringify({ name: "IT", description: "Technology" }),
      expectedStatus: 201,
    });
    await request("/departments", {
      method: "POST",
      body: JSON.stringify({ name: "HR", description: "People operations" }),
      expectedStatus: 201,
    });

    const employeeResponse = await request("/employees", {
      method: "POST",
      body: JSON.stringify({
        name: "Ali Khan",
        email: "ali@integration.test",
        department: "IT",
        status: "Active",
      }),
      expectedStatus: 201,
    });
    const employee = employeeResponse.data as JsonRecord;
    const employeeId = String(employee.id);
    assert.equal(employee.department, "IT");

    await request("/employees", {
      method: "POST",
      body: JSON.stringify({
        name: "Sara Ahmed",
        email: "sara@integration.test",
        department: "HR",
        status: "Inactive",
      }),
      expectedStatus: 201,
    });

    const filteredEmployees = await request(
      "/employees?search=ali&department=IT&status=Active&page=1&limit=5&sortBy=name&sortOrder=asc",
    );
    assert.equal((filteredEmployees.data as unknown[]).length, 1);
    assert.equal((filteredEmployees.pagination as JsonRecord).total, 1);

    await request(`/employees/${employeeId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Ali Khan",
        email: "ali@integration.test",
        department: "HR",
        status: "Active",
      }),
    });

    const today = new Date().toISOString().slice(0, 10);
    await request("/attendance/bulk", {
      method: "POST",
      body: JSON.stringify({
        date: today,
        records: [{ employeeId, status: "Present" }],
      }),
    });
    const firstAttendance = await request(`/attendance?date=${today}`);
    const firstEntry = (firstAttendance.data as JsonRecord[])[0];
    assert(firstEntry);
    assert.equal(firstEntry.status, "Present");

    await request("/attendance/bulk", {
      method: "POST",
      body: JSON.stringify({
        date: today,
        records: [{ employeeId, status: "Absent" }],
      }),
    });
    const secondAttendance = await request(`/attendance?date=${today}`);
    const secondEntry = (secondAttendance.data as JsonRecord[])[0];
    assert(secondEntry);
    assert.equal(secondEntry.id, firstEntry.id, "Attendance upsert should keep one record.");
    assert.equal(secondEntry.status, "Absent");

    const report = await request("/reports/summary");
    const summary = report.data as JsonRecord;
    assert.equal(summary.totalEmployees, 2);
    assert.equal(summary.activeEmployees, 1);
    assert.equal(summary.absentToday, 1);

    const departmentsResponse = await request("/departments");
    const hr = (departmentsResponse.data as JsonRecord[]).find(
      (department) => department.name === "HR",
    );
    assert(hr);
    assert.equal(hr.employeeCount, 2);
    await request(`/departments/${String(hr.id)}`, {
      method: "DELETE",
      expectedStatus: 409,
    });

    await request(`/employees/${employeeId}`, { method: "DELETE" });
    const attendanceAfterDelete = await request(`/attendance?date=${today}`);
    assert.equal((attendanceAfterDelete.data as unknown[]).length, 0);

    await request("/auth/logout", { method: "POST" });
    await request("/auth/me", { expectedStatus: 401 });

    console.log("StaffFlow API integration flow passed.");
  } finally {
    if (server) await new Promise<void>((resolve) => server?.close(() => resolve()));
    await disconnectDatabase();
    await mongoServer.stop();
  }
}

run().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
