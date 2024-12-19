import { fakerDA as faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { FakeEnsemble, FakeUser } from '../types';
import { 
  MusicianCount, 
  PracticeFrequency, 
  EnsembleType, 
  Genre 
} from '../enums';
import { LocationGenerator } from "./location.generator";
import { PostGenerator } from './post.generator';
import { FakePost } from '../types';

export class EnsembleGenerator {
  static generate(users: FakeUser[], count: number = 1): { ensembles: FakeEnsemble[], posts: FakePost[] } {
    console.log("generating fake ensembles");
    const ensembles: FakeEnsemble[] = [];
    const posts: FakePost[] = [];
    for (let i = 0; i < count; i++) {
      const memberCount = faker.number.int({ min: 2, max: Math.min(15, users.length) });
      const selectedUsers = faker.helpers.arrayElements(users, memberCount);
      const creator = selectedUsers[0];

      const ensemble: FakeEnsemble = {
        _id: new Types.ObjectId(),
        name: `${faker.music.genre()} ${faker.company.buzzNoun()}`,
        imageUrl: faker.image.url(),
        description: faker.lorem.sentences(faker.number.int({ min: 2, max: 15 })),
        homepageUrl: faker.internet.url(),
        location: LocationGenerator.generate(),
        number_of_musicians: faker.helpers.arrayElement(Object.values(MusicianCount)),
        practice_frequency: faker.helpers.arrayElement(Object.values(PracticeFrequency)),
        genres: faker.helpers.arrayElements(
          Object.values(Genre),
          faker.number.int({ min: 1, max: 3 })
        ),
        type: faker.helpers.arrayElement(Object.values(EnsembleType)),
        member_ids: selectedUsers.map(user => user._id),
        creator: creator._id,
      };

      ensembles.push(ensemble);

      // Update users with ensemble memberships
      selectedUsers.forEach(user => {
        user.ensembleIds.push(ensemble._id);
      });

      // Generate posts for the ensemble
      const generatedPosts = PostGenerator.generate(ensemble, faker.number.int({ min: 1, max: 5 }));
      posts.push(...generatedPosts);
    }

    return { ensembles, posts };
  }
}
