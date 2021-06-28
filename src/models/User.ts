export default interface User
{
    id?: number;
    name: string;
    email: string;
    pass: string;
}

/*
interface Field
{
    field: string;
    min: number;
    max: number;
}

export const userFields: {[name: string]: Field} =
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
        field: 'pass',
        min: 5,
        max: 32
    }
}
*/