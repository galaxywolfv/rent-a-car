const title = "Rent a Car";

const isProduction = false;

const baseUrl = isProduction ? "" : 'http://localhost:3000';
const racUrl = isProduction ? "" : 'http://localhost:4001/api/v1';

const config = {
    title,
    titleWithSeparator: ` | ${title}`,
    role: "user",
    baseUrl,
    user: `${racUrl}/users`,
    car: `${racUrl}/cars`,
    garage: `${racUrl}/garages`,
    reservation: `${racUrl}/reservations`,
    vehicle: `${racUrl}/vehicles`,
};

export default config;