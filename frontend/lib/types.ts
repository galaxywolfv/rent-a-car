/**
 * User model type.
 * - _id: The unique identifier (MongoDB ObjectId as a string)
 * - username: The user's chosen name.
 * - email: The user's email address.
 * - role: The user's role (admin, user, or maintainer).
 * - createdAt/updatedAt: Timestamps.
 */
export type User = {
    _id: string;
    username: string;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
};

/**
 * Roles available in the system.
 */
export enum Role {
    admin = 'admin',
    user = 'user',
    maintainer = 'maintainer',
}

/**
 * Garage model type.
 * - _id: Unique identifier.
 * - name: The name of the garage.
 * - maintainer: The user who manages the garage.
 * - cars (optional): If you use virtual populate to include the cars.
 * - createdAt/updatedAt: Timestamps.
 */
export type Garage = {
    _id: string;
    name: string;
    maintainer: User; // or a string ID if not populated
    cars?: Car[];     // optional virtual field if you populate it
    createdAt: string;
    updatedAt: string;
};

/**
 * Car model type.
 * - _id: Unique identifier.
 * - make: Car make (from external API).
 * - model: Car model (from external API).
 * - bodyType: Type of car body.
 * - fuelType: Type of fuel used.
 * - firstRegistration: Year of first registration.
 * - powerHP: Car's horsepower.
 * - gear: Gear type.
 * - mileage: The car's mileage.
 * - garage: ID of the garage where the car is located.
 * - image: A URL to the car's image.
 * - status: The current status of the car.
 * - createdAt/updatedAt: Timestamps.
 */
export type Car = {
    _id?: string;
    make: string;
    model: string;
    bodyType: BodyType;
    fuelType: FuelType;
    firstRegistration: number;
    powerHP: number;
    gear: GearType;
    mileage: number;
    garage?: string; // stored as a string ID
    image?: string;
    status?: CarStatus;
    createdAt?: string;
    updatedAt?: string;
};

/**
 * Car status values.
 */
export enum CarStatus {
    available = 'Available',
    reserved = 'Reserved',
}

/**
 * Possible body types for cars.
 */
export enum BodyType {
    Compact = 'Compact',
    Convertible = 'Convertible',
    Coupe = 'Coupe',
    SUV = 'SUV/Off-Road/Pick-up',
    StationWagon = 'Station Wagon',
    Sedan = 'Sedan',
    Other = 'Other',
}

/**
 * Possible fuel types for cars.
 */
export enum FuelType {
    HybridGasoline = 'Hybrid (electric/gasoline)',
    HybridDiesel = 'Hybrid (electric/diesel)',
    Gasoline = 'Gasoline',
    CNG = 'CNG',
    Diesel = 'Diesel',
    Electric = 'Electric',
    Hydrogen = 'Hydrogen',
    LPG = 'LPG',
    Ethanol = 'Ethanol',
    Other = 'Other',
}

/**
 * Possible gear types.
 */
export enum GearType {
    Manual = 'Manual',
    Automatic = 'Automatic',
    Semiautomatic = 'Semiautomatic',
}

/**
 * Reservation model type.
 * - _id: Unique identifier.
 * - user: The user who made the reservation.
 * - car: The car being reserved.
 * - startDate/endDate: The reservation period.
 * - status: The current status of the reservation.
 * - createdAt/updatedAt: Timestamps.
 */
export type Reservation = {
    _id: string;
    user: User; // or a string ID if not populated
    car: Car;   // or a string ID if not populated
    startDate: string;
    endDate: string;
    status: ReservationStatus;
    createdAt: string;
    updatedAt: string;
};

/**
 * Reservation status values.
 */
export enum ReservationStatus {
    ongoing = 'ongoing',
    expired = 'expired',
}

/**
* Vehicle Make type.
*/
export type Make = {
    name: string;
};

/**
 * Vehicle Model type.
 */
export type Model = {
    name: string;
};
