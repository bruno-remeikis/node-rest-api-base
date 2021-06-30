export default interface User
{
    id?: number;
    name: string;
    email: string;
    pass: string;
    salt: string;
}

interface Field
{
    field?: string;
    min: number;
    max: number;
}

export const fields: {[name: string]: Field} =
{
    name: {
        field: 'name',
        min: 3,
        max: 40
    },
    email: {
        field: 'email',
        min: 5,
        max: 80
    },
    pass: {
        min: 5,
        max: 32
    },
    hash: {
        field: 'pass',
        min: 60,
        max: 60
    },
    salt: {
        field: 'salt',
        min: 29,
        max: 29
    }
}

export const isInRange = (field: Field, value: string): boolean =>
    value.length >= field.min && value.length <= field.max;