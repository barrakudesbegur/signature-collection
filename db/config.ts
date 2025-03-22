import { defineDb, defineTable, column, sql, NOW } from "astro:db";

const Signator = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    name: column.text({ optional: false }),
    surname: column.text({ optional: false }),
    identificationDocument: column.text({ optional: false, unique: true }),
    birthDate: column.date({ optional: false }),
    municipality: column.text({ optional: false }),
    public: column.boolean({ default: false }),
    comment: column.text({ optional: true }),
    email: column.text({ optional: true }),
    subscribed: column.boolean({ default: false }),
    createdAt: column.date({ default: NOW }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { Signator },
});
