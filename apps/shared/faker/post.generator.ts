import { FakeEnsemble, FakePost } from "types";
import { Types } from "mongoose";
import { fakerDA as faker } from '@faker-js/faker';
import { InstrumentName, Genre } from "../enums";

export class PostGenerator {
    static generate(ensemble: FakeEnsemble, count: number = 1): FakePost[] {
      console.log(`Generating ${count} posts for ensemble: ${ensemble.name}`);
      const posts: FakePost[] = [];
  
      for (let i = 0; i < count; i++) {
        const post: FakePost = {
          _id: new Types.ObjectId(),
          title: faker.lorem.words(faker.number.int({ min: 3, max: 7 })),
          description: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
          ensemble: ensemble._id,
          instrument: {
            name: faker.helpers.arrayElement(Object.values(InstrumentName)),
            level: faker.number.int({ min: 1, max: 6 }),
            genres: faker.helpers.arrayElements(
              Object.values(Genre),
              faker.number.int({ min: 1, max: 3 })
            ),
          },
          location: ensemble.location,
        };
  
        posts.push(post);
      }
  
      return posts;
    }
  }
  