import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { FakeEnsemble, FakeUser } from '../types';
import { 
  MusicianCount, 
  PracticeFrequency, 
  EnsembleType, 
  Genre 
} from '../enums';
import { LocationGenerator } from "./location.generator";


export class EnsembleGenerator {
  static generate(users: FakeUser[], count: number = 1): FakeEnsemble[] {
    console.log("generating fake ensembles");
    const ensembles: FakeEnsemble[] = [];
    
    for (let i = 0; i < count; i++) {
      // Select random users for this ensemble
      const memberCount = faker.number.int({ min: 2, max: Math.min(8, users.length) });
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

      // Update the users with their ensemble
      selectedUsers.forEach(user => {
        user.ensembleIds.push(ensemble._id);
      });
    }
    return ensembles;
  }
}