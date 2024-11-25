import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { FakeUser, Location, Instrument } from "../types";
import { InstrumentName, Genre } from "../enums";
import { LocationGenerator } from "./location.generator";
import * as bcrypt from 'bcrypt';

export class UserGenerator {
  static generateLocation(): Location {
    return LocationGenerator.generate();
  }
  static generatePhoneNumber(): string {
    const prefix = '+45';
    const number = faker.number.int({ min: 10000000, max: 99999999 }); // 8 digits
    return `${prefix}${number}`;
  }

  static generateInstrument(): Instrument {
    const allGenres = Object.values(Genre);
    return {
      name: faker.helpers.arrayElement(Object.values(InstrumentName)),
      level: faker.number.int({ min: 1, max: 6 }),
      genres: faker.helpers.arrayElements(
        allGenres,
        faker.number.int({ min: 1, max: 3 })
      ),
    };
  }

  static async generate(count: number = 1): Promise<FakeUser[]> {
    console.log("generating fake users");

    const users: FakeUser[] = [];
    const createdAt = faker.date.past({ years: 2 }); // A date within the past 2 years
    const lastSeen = faker.date.between({ from: createdAt, to: new Date() }); // Ensure lastSeen is after createdAt
    const hashedPassword = await bcrypt.hash("password123", 10);


    for (let i = 0; i < count; i++) {
      const user: FakeUser = {
        _id: new Types.ObjectId(),
        name: faker.person.firstName(),
        surname: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPassword, // Default password for all fake users
        authProvider: "local",
        phone: this.generatePhoneNumber(),
        location: this.generateLocation(),
        createdAt,
        lastSeen,
        dateOfBirth: faker.date.birthdate({ min: 18, max: 100, mode: 'age' }),
        profileText: faker.lorem.sentences(faker.number.int({ min: 2, max: 15 })),
        profilePicture: faker.image.avatar(),
        isSeeking: faker.datatype.boolean(),
        isSubscribedToNewsletter: faker.datatype.boolean(),
        instruments: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => this.generateInstrument()
        ),
        ensembleIds: [], // Will be populated later
      };
      users.push(user);
    }
    return users;
  }
}
