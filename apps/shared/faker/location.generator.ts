import { fakerDA as faker } from '@faker-js/faker';

export interface Location {
  city: string;
  postCode: string;
}

export class LocationGenerator {
  static generate(): Location {
    const copenhagenRegion = [
      { city: 'Copenhagen', postCode: '1000' },
      { city: 'Frederiksberg', postCode: '1800' },
      { city: 'Hellerup', postCode: '2900' },
      { city: 'Gentofte', postCode: '2820' },
      { city: 'Glostrup', postCode: '2600' },
      { city: 'Brøndby', postCode: '2605' },
      { city: 'Valby', postCode: '2500' },
      { city: 'Rødovre', postCode: '2610' },
      { city: 'Albertslund', postCode: '2620' },
      { city: 'Herlev', postCode: '2730' },
      { city: 'Lyngby', postCode: '2800' },
      { city: 'Bagsværd', postCode: '2880' },
    ];

    return faker.helpers.arrayElement(copenhagenRegion);
  }
}
