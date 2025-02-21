import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Garage, Car } from "@/lib/types";
import config from "@/lib/config";
import useGarage from "@/lib/hooks/useGarage";
import useCar from "@/lib/hooks/useCar";
import { useGarageContext } from "@/GarageContext";
import { useCarContext } from "@/CarContext";
import { useAuth } from "@/AuthContext";
import ActionButton from "@/components/common/actionButton";
import Link from "next/link";

/**
 * The Garage Details Page component.
 *
 * @component
 * @returns {JSX.Element} The rendered Garage page with a list of cars.
 */
const GaragePage = () => {
    const router = useRouter();
    const garageId = router.query.id as string;

    const { getGarageById } = useGarage();
    const { garageState: { garage } } = useGarageContext();

    const { getCars } = useCar();
    const { carsState: { cars } } = useCarContext();

    const { isAuthenticated, user } = useAuth();
    const isMaintainer = user?.role === "maintainer" && user?.garage === garageId;
    const isAdmin = user?.role === "admin";

    // Fetch Garage & Cars on Page Load
    useEffect(() => {
        if (garageId) {
            getGarageById(garageId);
            getCarsByGarage(garageId);
        }
    }, [garageId]);

    return (
        <>
            <Head>
                <title>{garage?.name || "Garage"} {config.titleWithSeparator}</title>
                <meta name="description" content="View garage details and available cars" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="flex flex-col pt-16 min-h-screen">
                <div className="w-full max-w-6xl mx-auto p-4">
                    {/* Garage Info */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">{garage?.name || "Garage"}</h1>

                        {/* Show Add Car Button for Admins & Maintainers */}
                        {(isAdmin || isMaintainer) && (
                            <ActionButton
                                text="Add Car"
                                href={`/car/create?garageId=${garageId}`}
                                customClasses="bg-brand text-white"
                            />
                        )}
                    </div>

                    {/* Cars in the Garage */}
                    <div className="relative overflow-x-auto shadow-md rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Car</th>
                                    <th scope="col" className="px-6 py-3">Make</th>
                                    <th scope="col" className="px-6 py-3">Model</th>
                                    <th scope="col" className="px-6 py-3">Year</th>
                                    <th scope="col" className="px-6 py-3">Mileage</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.length > 0 ? (
                                    cars.map((car: Car) => (
                                        <tr key={car._id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <img src={car.image || "/default-car.png"} alt="Car" className="h-16 w-24 object-cover rounded-lg" />
                                            </td>
                                            <td className="px-6 py-4">{car.make}</td>
                                            <td className="px-6 py-4">{car.model}</td>
                                            <td className="px-6 py-4">{car.year}</td>
                                            <td className="px-6 py-4">{car.mileage} km</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded text-xs font-bold ${car.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                    {car.status}
                                                </span>
                                            </td>
                                            <td className="flex items-center justify-end px-3 py-2 space-x-2">
                                                <Link href={`/car/${car._id}`}>
                                                    <ActionButton
                                                        text="View"
                                                        icon="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                                    />
                                                </Link>
                                                {(isAdmin || isMaintainer) && (
                                                    <Link href={`/car/${car._id}/edit`}>
                                                        <ActionButton
                                                            text="Edit"
                                                            icon="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                        />
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            No cars available in this garage.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GaragePage;
