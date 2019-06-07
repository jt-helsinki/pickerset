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

    test('if it picks the correct path ', () => {
        // now check with a fake property. Should be ignored.
        let pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(chook);
        let value1: string = pickerSet.get('name').valueOrDefault('no name');
        let value2: number = pickerSet.get('age').valueOrDefault(0);
        let value3: string = pickerSet.get('country').get('city').get('suburb').valueOrDefault('no suburb');
        let value4: TestPerson[] = pickerSet.get('children').valueOrDefault([]);
        testContents(chook, value1, value2, value3, value4);
    });

    test('if it picks from array the correct path ', () => {
        // now check with a fake property. Should be ignored.
        chook.children.forEach((testPerson: TestPerson, index: number) => {
            let pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(chook);
            let value1: string = pickerSet.get('children').index(index).get('name').valueOrDefault('no name');
            let value2: number = pickerSet.get('children').index(index).get('age').valueOrDefault(0);
            let value3: string = pickerSet.get('children').index(index).get('country').get('city').get('suburb').valueOrDefault('no suburb');
            let value4: TestPerson[] = pickerSet.get('children').index(index).get('children').valueOrDefault(null);

            testContents(testPerson, value1, value2, value3, value4);
        });
    });

    test('if it sets the correct path ', () => {
        // now check with a fake property. Should be ignored.
        const chook_copy: TestPerson = JSON.parse(JSON.stringify(chook));
        const pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(chook_copy);

        expect(pickerSet.get('name').valueOrDefault()).toEqual('Chook');
        expect(pickerSet.get('age').valueOrDefault()).toEqual(37);
        expect(pickerSet.get('country').get('city').get('suburb').valueOrDefault()).toEqual('Kallio');


        const name = pickerSet.set('name', 'Bazza').path;
        const age = pickerSet.set('age', 103).path;
        const suburb = pickerSet.get('country').get('city').set('suburb', 'Haaga').path;

        expect(name).toEqual(['name']);
        expect(age).toEqual(['age']);
        expect(suburb).toEqual(['country', 'city', 'suburb']);

        expect(pickerSet.get('name').valueOrDefault()).toEqual('Bazza');
        expect(pickerSet.get('age').valueOrDefault()).toEqual(103);
        expect(pickerSet.get('country').get('city').get('suburb').valueOrDefault()).toEqual('Haaga');



        const name0 = pickerSet.get('children').index(0).set('name', 'Crow').path;
        const age0 = pickerSet.get('children').index(0).set('age', 10).path;
        const suburb0 = pickerSet.get('children').index(0).get('country').get('city').set('suburb', 'Punavuori').path;

        expect(name0).toEqual(['children', 0, 'name']);
        expect(age0).toEqual(['children', 0, 'age']);
        expect(suburb0).toEqual(['children', 0, 'country', 'city', 'suburb']);

        const name1 = pickerSet.get('children').index(1).set('name', 'Mazza').path;
        const age1 = pickerSet.get('children').index(1).set('age', 11).path;
        const suburb1 = pickerSet.get('children').index(1).get('country').get('city').set('suburb', 'Tapiola').path;

        expect(name1).toEqual(['children', 1, 'name']);
        expect(age1).toEqual(['children', 1, 'age']);
        expect(suburb1).toEqual(['children', 1, 'country', 'city', 'suburb']);

        testContents(chook_copy, 'Bazza', 103, 'Haaga', [null, null]);
        testContents(chook_copy.children[0], 'Crow', 10, 'Punavuori', []);
        testContents(chook_copy.children[1], 'Mazza', 11, 'Tapiola', []);
    });

    test('if it deals with undefined and null path ', () => {
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

    test('if itsets path using a path', () => {
        // now check with a fake property. Should be ignored.
        const chook_copy: TestPerson = JSON.parse(JSON.stringify(chook));

        expect(chook_copy.name).toEqual('Chook');
        expect(chook_copy.age).toEqual(37);
        expect(chook_copy.country.city.suburb).toEqual('Kallio');
        expect(chook_copy.children[0].country.city.suburb).toEqual('Munkkivuori');

        let pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(chook_copy);
        let nameProperties: (string | number)[] = pickerSet.get('name').path;
        let ageProperties: (string | number)[] = pickerSet.get('age').path;
        let suburbProperties: (string | number)[] = pickerSet.get('country').get('city').get('suburb').path;
        const suburbProperties0 = pickerSet.get('children').index(0).get('country').get('city').get('suburb').path;
        pickerSet.setByPath(nameProperties, 'Show Bags');
        pickerSet.setByPath(ageProperties, 57);
        pickerSet.setByPath(suburbProperties, 'Paloheinä');
        pickerSet.setByPath(suburbProperties0, 'Töölö');

        expect(chook_copy.name).toEqual('Show Bags');
        expect(chook_copy.age).toEqual(57);
        expect(chook_copy.country.city.suburb).toEqual('Paloheinä');
        expect(chook_copy.children[0].country.city.suburb).toEqual('Töölö');
        // // TODO how to handle array data
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
