import { PickerSet } from '@src/PickerSet';

interface TestPerson {
    name: string;
    age: number;
    country: {
        city: {
            suburb: string;
        }
    },
    children: TestPerson[]
}

const shaggs: any = {
    name: 'Shaggs'
};

const chook: TestPerson = {
    name: 'Chook',
    age: 37,
    country: {
        city: {
            suburb: 'Kallio'
        }
    },
    children: [
        {
            name: 'Grommit',
            age: 5,
            country: {
                city: {
                    suburb: 'Munkkivuori'
                }
            },
            children: []
        },
        {
            name: 'Pothole',
            age: 8,
            country: {
                city: {
                    suburb: 'EIra'
                }
            },
            children: []
        }
    ]
};

describe('Tests all the ObjectGetterSetter functions', () => {

    beforeAll(() => {
    });

    test('if it picks the correct properties ', () => {
        // now check with a fake property. Should be ignored.
        let pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(chook);
        let value1: string = pickerSet.get('name').valueOrDefault('no name');
        let value2: number = pickerSet.get('age').valueOrDefault(0);
        let value3: string = pickerSet.get('country').get('city').get('suburb').valueOrDefault('no suburb');
        let value4: TestPerson[] = pickerSet.get('children').valueOrDefault([]);
        testContents(chook, value1, value2, value3, value4);
    });

    test('if it picks from array the correct properties ', () => {
        // now check with a fake property. Should be ignored.
        chook.children.forEach((testPerson: TestPerson, index: number) => {
            let pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(chook);
            let value1: string = pickerSet.get('children').getAtIndex(index, 'name').valueOrDefault('no name');
            let value2: number = pickerSet.get('children').getAtIndex(index, 'age').valueOrDefault(0);
            let value3: string = pickerSet.get('children').getAtIndex(index, 'country').get('city').get('suburb').valueOrDefault('no suburb');
            let value4: TestPerson[] = pickerSet.get('children').getAtIndex(index, 'children').valueOrDefault(null);

            let value5: string = pickerSet.get('children').index(index).get('name').valueOrDefault('no name');
            let value6: number = pickerSet.get('children').index(index).get('age').valueOrDefault(0);
            let value7: string = pickerSet.get('children').index(index).get('country').get('city').get('suburb').valueOrDefault('no suburb');
            let value8: TestPerson[] = pickerSet.get('children').index(index).get('children').valueOrDefault(null);

            testContents(testPerson, value1, value2, value3, value4);
            testContents(testPerson, value5, value6, value7, value8);
        });
    });

    test('if it sets the correct properties ', () => {
        // now check with a fake property. Should be ignored.
        let chook_copy: TestPerson = JSON.parse(JSON.stringify(chook));
        let pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(chook_copy);
        pickerSet.set('name', 'Bazza');
        pickerSet.set('age', 103);
        pickerSet.get('country').get('city').set('suburb', 'Haaga');

        pickerSet.get('children').index(0).set('name', 'Crow');
        pickerSet.get('children').index(0).set('age', 10);
        pickerSet.get('children').index(0).get('country').get('city').set('suburb', 'Punavuori');

        pickerSet.get('children').index(1).set('name', 'Mazza');
        pickerSet.get('children').index(1).set('age', 11);
        pickerSet.get('children').index(1).get('country').get('city').set('suburb', 'Tapiola');


        testContents(chook_copy, 'Bazza', 103, 'Haaga', [null, null]);
        testContents(chook_copy.children[0], 'Crow', 10, 'Punavuori', []);
        testContents(chook_copy.children[1], 'Mazza', 11, 'Tapiola', []);
    });

    test('if it deals with undefined and null properties ', () => {
        // now check with a fake property. Should be ignored.
        let pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(shaggs);
        let name: string = pickerSet.get('name').valueOrDefault('not set');
        let age: number = pickerSet.get('age').valueOrDefault(null);
        let suburb: string = pickerSet.get('country').get('city').get('suburb').valueOrDefault(null);
        expect(name).toEqual('Shaggs');
        expect(age).toEqual(null);
        expect(suburb).toEqual(null);
        // TODO how to handle array data
    });

});

function testContents(testPerson: TestPerson, value1: string, value2: number, value3: string, value4: TestPerson[]): void {
    expect(value1).not.toBeUndefined();
    expect(value2).not.toBeUndefined();
    expect(value3).not.toBeUndefined();
    expect(value4).not.toBeUndefined();
    expect(value1).not.toBeNull();
    expect(value2).not.toBeNull();
    expect(value3).not.toBeNull();
    expect(value4).not.toBeNull();
    expect(testPerson.name).toEqual(value1);
    expect(testPerson.age).toEqual(value2);
    expect(testPerson.country.city.suburb).toEqual(value3);
    expect(testPerson.children.length).toEqual(value4.length);
}
