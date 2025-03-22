import { db, Signator } from "astro:db";
import dni from "better-dni";
import { subDays } from "date-fns";
import { faker } from "@faker-js/faker/locale/es";

// Configure faker to use Spanish locale for more realistic Catalan/Spanish names
faker.seed(123); // For consistent results

// Helper function to generate a random signatory
function generateSignatory(id: number) {
  const isMale = Math.random() > 0.5;
  const name = isMale
    ? faker.person.firstName("male")
    : faker.person.firstName("female");
  const surname = faker.person.lastName();

  // Random date between 1 and 40 days ago
  const createdAt = subDays(new Date(), Math.floor(Math.random() * 40) + 1);

  // Random birth date between 18 and 90 years old
  const birthYear =
    new Date().getFullYear() - faker.number.int({ min: 16, max: 90 });
  const birthDate = faker.date.birthdate({
    min: birthYear - 1,
    max: birthYear,
    mode: "year",
  });

  // 30% chance of a comment, 70% empty
  const hasComment = Math.random() < 0.3;
  const comment = hasComment
    ? faker.helpers.arrayElement([
        "Molt bona iniciativa! Ja era hora que algú s'ocupés d'això.",
        "Espero que aquesta vegada ens escoltin.",
        "Necessitem aquest espai pels joves del poble.",
        "Fa anys que esperem tenir un espai propi.",
        "A veure si per fi tenim un lloc on fer les activitats.",
        "No està bé que el poble no tingui un espai propi.",
        "Ja fa molts anys que necessitem un espai com aquest.",
        "El poble necessita un espai com aquest.",
        "Comentari amb 2 línies.\nAixí que aquí hi ha un segon.",
        "Comentari molt molt llarg que ocupa molt espai i no es pot veure bé.\nAixí que aquí hi ha un segon.\nAixí que aquí hi ha un tercer.\nAixí que aquí hi ha un quart. Així que aquí hi ha un cinquè, millor que així. Ah, i aquí hi ha un sisè, així que així. Fantàstic, no? I aqui un poema: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut.",
        faker.lorem.sentence(5),
      ])
    : "";

  // 50% chance to be public
  const isPublic = Math.random() > 0.5;

  // 40% chance to subscribe
  const isSubscribed = Math.random() < 0.4;

  return {
    id,
    name,
    surname,
    identificationDocument: dni.randomNIF(),
    birthDate,
    municipality: faker.helpers.arrayElement(["Begur", "Esclanyà"]),
    public: isPublic,
    comment,
    email: faker.internet
      .email({ firstName: name, lastName: surname.split(" ")[0] })
      .toLowerCase(),
    subscribed: isSubscribed,
    createdAt,
  };
}

// https://astro.build/db/seed
export default async function seed() {
  const randomSignatories = Array.from({ length: 200 }, (_, i) =>
    generateSignatory(i)
  );

  await db.insert(Signator).values(randomSignatories);
}
