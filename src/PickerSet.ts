type Unarray<T> = T extends Array<infer U> ? U : T;


/**
 * Dynamically retrieves values out of an object based on property names and array indexes.
 *
 * This can (should) be used for setting values sent from react forms. Will allow for passing of values using one single action.
 */
export class PickerSet<T> {

    private wrappedValue: T | null | undefined;

    constructor(value: T | null | undefined) {
        this.wrappedValue = value;
    }

    public static setValueOnObject<TT>(obj: TT, properties: (number|string)[], value: any): void {
        const setterGetter: PickerSet<TT> = new PickerSet<TT>(obj);
        properties.forEach((property: string | number, index: number): void => {
                if (index === properties.length - 1) {
                    setterGetter.set(property as any, value);
                } else if (typeof property === 'string') {
                    setterGetter.get(property as any); // any so compiler doesn't baulk
                } else {
                    setterGetter.index(property as number);
                }

            }
        );
    }

    /**
     * Gets a value asscoiated with the specified property.
     * @param {K} key The key to get the value against.
     * @return {PickerSet<T[K]>} The value found at that index wrapped in a PickerSet<K>.
     */
    public get<K extends keyof T>(key: K): PickerSet<T[K]> {
        return this.map(value => value[key]);
    }

    /**
     * Gets the value associated with the specified property from an index in the array.
     * @param {number} index index The index to retrieve.
     * @param {K} key The key to get the value against.
     * @return {PickerSet<Unarray<T>[K]>} The value found at that index wrapped in a PickerSet<K>.
     */
    public getAtIndex<K extends keyof Unarray<T>>(index: number, key: K): PickerSet<Unarray<T>[K]> {
        return this.map(value => value[index][key]);
    }

    /**
     * Gets a value at the specified value in the array.
     * Note: Does not check the array length so may get an out of bounds exception.
     * @param {number} index The index to retrieve.
     * @return {PickerSet<Unarray<T>>} The value found at that index wrapped in a PickerSet<K>.
     */
    public index(index: number): PickerSet<Unarray<T>> {
        return this.map(value => value[index]);
    }

    /**
     * Sets a value on a key.
     *
     * @param {K} key the key to set the value against.
     * @param value the value to set.
     */
    public set<K extends keyof T>(key: K, value: any): void {
        this.wrappedValue[key] = value;
    }

    /**
     * Gets the value of matching the specified path.
     *
     * @param {T | null | undefined} defaultValue a default value if nothing is found.
     * @return {T} the value matching the sepcified path.
     */
    public valueOrDefault(defaultValue: T | null | undefined): T {
        return this.wrappedValue ? this.wrappedValue : defaultValue;
    }

    private map<U>(func: (value: T) => U): PickerSet<U> {
        if (!this.wrappedValue) {
            return this as PickerSet<any>;
        }
        return new PickerSet(func(this.wrappedValue));
    }
}
