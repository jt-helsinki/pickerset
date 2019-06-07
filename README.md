# Pickerset
Picking and setting properties on objects. Can handle nested properties too.

# Usage

See the test directory or examples.

```
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

const pickerSet: PickerSet<TestPerson> = new PickerSet<TestPerson>(chook);

const name = pickerSet.get('name');  // Chook
const age = pickerSet.get('age'); // 37
const suburb = pickerSet.get('country').get('city').get('suburb'); // Kallio
const child0 = pickerSet.get('children').index(0).get('country').get('city').get('suburb'); // Munkkivuori


console.log(name.valueOrDefault(), age.valueOrDefault(), suburb.valueOrDefault()); // 'Chook' 37 'Kallio'
console.log(suburb.path); // ['country', 'city', 'suburb']
console.log(child0.valueOrDefault()); // 'Munkkivuori'
console.log(child0.path); // ['children', 0, 'country', 'city', 'suburb']


const child0updated = pickerSet.get('children').index(0).get('country').get('city').set('suburb', 'Pasila');
console.log(child0updated.valueOrDefault(), chook.children[0].country.city.suburb); // 'Pasila', 'Pasila'
console.log(child0updated.path); // ['children', 0, 'country', 'city', 'suburb']

```

# Setup

Run `npm install`


