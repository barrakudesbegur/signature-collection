import { column, defineDb, defineTable, NOW } from "astro:db";

const Signator = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    iniciative: column.text({ optional: false }),
    name: column.text({ optional: false }),
    surname: column.text({ optional: false }),
    identificationDocumentEncrypted: column.text({ optional: false }),
    identificationDocumentHash: column.text({ optional: false, unique: true }),
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
