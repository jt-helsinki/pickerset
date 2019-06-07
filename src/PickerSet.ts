type Unarray<T> = T extends Array<infer U> ? U : T;


/**
 * Dynamically retrieves values out of an object based on property names and array indexes.
 *
 * This can (should) be used for setting values sent from react forms. Will allow for passing of values using one single action.
 */
export class PickerSet<T> {

    private readonly _wrappedValue: T | null | undefined;

    private _path: (string | number)[] = [];

    constructor(value: T | null | undefined, properties:(string | number)[] = []) {
        this._wrappedValue = value;
        this._path = properties;
    }

    /**
     * Gets a value asscoiated with the specified property.
     * @param {K} key The key to get the value against.
     * @return {PickerSet<T[K]>} The value found at that index wrapped in a PickerSet<K>.
     */
    public get<K extends keyof T>(key: K): PickerSet<T[K]> {
        return this.map(value => value[key], key as string);
    }

    /**
     * Gets a value at the specified value in the array.
     * Note: Does not check the array length so may get an out of bounds exception.
     * @param {number} index The index to retrieve.
     * @return {PickerSet<Unarray<T>>} The value found at that index wrapped in a PickerSet<K>.
     */
    public index(index: number): PickerSet<Unarray<T>> {
        return this.map(value => value[index], index);
    }

    /**
     * Sets a value on a key.
     *
     * @param {K} key the key to set the value against.
     * @param value the value to set.
     */
    public set<K extends keyof T>(key: K, value: any): PickerSet<T[K]> {
        return this.map(prop => prop[key] = value, key as string);
    }

    /**
     * Sets a value based on the current path value.
     *
     * @param {(number | string)[]} properties
     * @param value
     */
    public setByPath<T>(properties: (number|string)[], value: any): void {
        let pickerSet: any = this;
        properties.forEach((property: string | number, index: number): void => {
                if (index === properties.length - 1) {          // the final value in the properties[] so set the value.
                    pickerSet = pickerSet.set(property as any, value);
                } else if (typeof property === 'string') {      // string
                    pickerSet = pickerSet.get(property);
                } else {                                        // array
                    pickerSet = pickerSet.index(property);
                }

            }
        );
    }

    /**
     * Returns the path up to the current picker set.
     *
     * @return {(string | number)[]}
     */
    get path(): (string | number)[] {
        return this._path;
    }

    /**
     * Gets the current value of the PickerSet.
     *
     * @return {T} The value of the property contained within the current SickerSet
     */
    get value(): T {
        return this._wrappedValue
    }

    /**
     * Gets the value of matching the specified path.
     *
     * @param {T | null | undefined} defaultValue a default value if nothing is found.
     * @return {T} the value matching the sepcified path.
     */
    public valueOrDefault(defaultValue: T | null | undefined = null): T {
        return this.value ? this.value : defaultValue;
    }

    private map<U>(func: (value: T) => U, property: string | number): PickerSet<U> {
        if (!this._wrappedValue) {
            return this as PickerSet<any>;
        }
        const properties = this._path.slice(0);
        if (property !== null) {
            properties.push(property);
        }
        return new PickerSet(func(this._wrappedValue), properties);
    }
}
