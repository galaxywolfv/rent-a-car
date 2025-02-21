import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import config from "@/lib/config";
import { useAuth } from "@/AuthContext";
import useCar from "@/lib/hooks/useCar";
import useVehicle from "@/lib/hooks/useVehicle";
import ActionButton from "@/components/common/actionButton";
import { useRouter } from "next/router";
import { BodyType, FuelType, GearType } from "@/lib/types";
import { useVehicleContext } from "@/VehicleContext";
import useAuthentication from "@/lib/hooks/useAuthentication";

const CreateCar = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { token } = useAuthentication();
    const { createCar } = useCar();
    const { getVehicleMakes, getVehicleModels } = useVehicle();
    const { vehicleState } = useVehicleContext();

    const [selectedMake, setSelectedMake] = useState<string>("");
    const [car, setCar] = useState({
        make: "",
        model: "",
        bodyType: "",
        fuelType: "",
        firstRegistration: new Date().getFullYear(),
        powerHP: 100,
        gear: "",
        mileage: 0,
        image: "",
    });

    // Fetch vehicle makes when token is available
    useEffect(() => {
        if (token) getVehicleMakes();
    }, [token]);

    // Fetch models when make changes
    useEffect(() => {
        if (selectedMake) {
            getVehicleModels(selectedMake);
        }
    }, [selectedMake]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCar((prevCar) => ({ ...prevCar, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isAuthenticated) {
            await createCar(car).then(() => router.push("/"));
        }
    };

    return (
        <>
            <Head>
                <title>Register a Car {config.titleWithSeparator}</title>
                <meta name="description" content="Add a new car to the garage." />
            </Head>

            <div className="flex flex-col md:flex-row pt-16 md:min-h-screen max-h-screen">
                <div className="w-full relative overflow-x-auto p-4 lg:p-8 mx-auto l:max-w-5xl bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold mb-6">Register a <span className="text-brand">Car</span></h2>
                    <form className="w-full space-y-6" onSubmit={handleSubmit}>
                        {/* Make Selection */}
                        <div className="mb-4">
                            <label htmlFor="make" className="block mb-2 text-sm font-medium text-gray-900">
                                Make
                            </label>
                            <select
                                id="make"
                                name="make"
                                required
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                value={car.make}
                                onChange={(e) => {
                                    const selectedMakeName = e.target.value;
                                    setSelectedMake(selectedMakeName); // Update the selectedMake state
                                    handleInputChange({ target: { name: "make", value: selectedMakeName } } as ChangeEvent<HTMLInputElement>); // Update the car state
                                }} >
                                <option value="">Select Make</option>
                                {vehicleState?.makes.map((make) => (
                                    <option key={make.name} value={make.name}>
                                        {make.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Model Selection */}
                        <div className="mb-4">
                            <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900">
                                Model
                            </label>
                            <select
                                id="model"
                                name="model"
                                required
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                value={car.model}
                                onChange={handleInputChange}
                                disabled={!selectedMake}
                            >
                                <option value="">Select Model</option>
                                {vehicleState?.models.map((model) => (
                                    <option key={model.name} value={model.name}>
                                        {model.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Body Type */}
                        <div className="mb-4">
                            <label htmlFor="bodyType" className="block mb-2 text-sm font-medium text-gray-900">
                                Body Type
                            </label>
                            <select
                                id="bodyType"
                                name="bodyType"
                                required
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                value={car.bodyType}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Body Type</option>
                                {Object.values(BodyType).map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fuel Type */}
                        <div className="mb-4">
                            <label htmlFor="fuelType" className="block mb-2 text-sm font-medium text-gray-900">
                                Fuel Type
                            </label>
                            <select
                                id="fuelType"
                                name="fuelType"
                                required
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                value={car.fuelType}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Fuel Type</option>
                                {Object.values(FuelType).map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* First Registration Year */}
                        <div className="mb-4">
                            <label htmlFor="firstRegistration" className="block mb-2 text-sm font-medium text-gray-900">
                                First Registration Year
                            </label>
                            <input
                                type="number"
                                id="firstRegistration"
                                name="firstRegistration"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                min={1886}
                                max={new Date().getFullYear()}
                                value={car.firstRegistration}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Power (HP) */}
                        <div className="mb-4">
                            <label htmlFor="powerHP" className="block mb-2 text-sm font-medium text-gray-900">
                                Power (HP)
                            </label>
                            <input
                                type="number"
                                id="powerHP"
                                name="powerHP"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                min={1}
                                value={car.powerHP}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Gear Type */}
                        <div className="mb-4">
                            <label htmlFor="gear" className="block mb-2 text-sm font-medium text-gray-900">
                                Gear Type
                            </label>
                            <select
                                id="gear"
                                name="gear"
                                required
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                value={car.gear}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Gear Type</option>
                                {Object.values(GearType).map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mileage */}
                        <div className="mb-4">
                            <label htmlFor="mileage" className="block mb-2 text-sm font-medium text-gray-900">
                                Mileage (km)
                            </label>
                            <input
                                type="number"
                                id="mileage"
                                name="mileage"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                min={0}
                                value={car.mileage}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Image URL */}
                        <div className="mb-4">
                            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">
                                Image URL
                            </label>
                            <input
                                type="url"
                                id="image"
                                name="image"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                placeholder="https://example.com/car.jpg"
                                value={car.image}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <ActionButton
                            text="Create Car"
                            icon="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            customClasses="w-full md:w-max justify-center"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateCar;
