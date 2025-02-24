import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import useCar from "@/lib/hooks/useCar";
import { Car, BodyType, FuelType, GearType, CarStatus } from "@/lib/types";
import config from "@/lib/config";
import useAuthentication from "@/lib/hooks/useAuthentication";
import { useRouter } from "next/router";
import { useCarContext } from "@/CarContext";
import { useAuth } from "@/AuthContext";
import ActionButton from "@/components/common/actionButton";

/**
 * The Car Edit Page component.
 *
 * @component
 * @returns {JSX.Element} The rendered Car Edit page.
 */
const EditCar = () => {
  const router = useRouter();
  const carId = router.query.id as string;

  const { getCarById, updateCarById } = useCar();
  const { carState: { car }, setCarState } = useCarContext();
  const { token } = useAuthentication();
  const { isAuthenticated } = useAuth();

  const [editableCar, setCar] = useState<Partial<Car>>({
    make: "",
    model: "",
    bodyType: BodyType.Other,
    fuelType: FuelType.Other,
    firstRegistration: new Date().getFullYear(),
    powerHP: 100,
    gear: GearType.Manual,
    mileage: 0,
    image: "",
    status: CarStatus.available,
    ...car,
  });

  useEffect(() => {
    if (isAuthenticated && carId) getCarById(carId);
  }, [isAuthenticated, router.query, token]);

  useEffect(() => {
    if (car) setCar(car);
  }, [car]);

  const handleEditCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (carId && isAuthenticated && editableCar.make && editableCar.model) {
      const updatedCar = await updateCarById(carId, editableCar as Car);
      setCarState((prev) => ({ ...prev, car: updatedCar }));
      router.back();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: name === "firstRegistration" || name === "powerHP" || name === "mileage" ? Number(value) : value }));
  };

  return (
    <>
      <Head>
        <title>Edit - {car?.make} {car?.model} {config.titleWithSeparator}</title>
        <meta name="description" content="Edit car details" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col md:flex-row pt-16 md:min-h-screen max-h-screen">
        {/* Car Image */}
        <div className="bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow p-5 flex items-center justify-center min-w-fit">
          <div className="flex flex-col items-center">
            <img
              className="w-40 h-40 md:w-56 md:h-56 rounded object-cover"
              src={editableCar.image || "/favicon.svg"}
              alt={`${editableCar.make} ${editableCar.model}`}
            />
            <h5 className="mt-3 text-xl font-semibold text-black text-center">
              {editableCar.make} {editableCar.model} ({editableCar.firstRegistration})
            </h5>
          </div>
        </div>

        {/* Edit Form */}
        <div className="w-full relative overflow-x-auto shadow-md p-4 lg:p-8">
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleEditCar}>

            {/* Make */}
            <div>
              <label htmlFor="make" className="block mb-2 text-sm font-medium">Make</label>
              <input
                type="text"
                id="make"
                name="make"
                value={editableCar.make}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Model */}
            <div>
              <label htmlFor="model" className="block mb-2 text-sm font-medium">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                value={editableCar.model}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Body Type */}
            <div>
              <label htmlFor="bodyType" className="block mb-2 text-sm font-medium">Body Type</label>
              <select
                id="bodyType"
                name="bodyType"
                value={editableCar.bodyType}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              >
                <option value="">Select Body Type</option>
                {Object.values(BodyType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label htmlFor="fuelType" className="block mb-2 text-sm font-medium">Fuel Type</label>
              <select
                id="fuelType"
                name="fuelType"
                value={editableCar.fuelType}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              >
                <option value="">Select Fuel Type</option>
                {Object.values(FuelType).map((fuel) => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            {/* First Registration */}
            <div>
              <label htmlFor="firstRegistration" className="block mb-2 text-sm font-medium">First Registration</label>
              <input
                type="number"
                id="firstRegistration"
                name="firstRegistration"
                min={1886}
                max={new Date().getFullYear()}
                value={editableCar.firstRegistration}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Power */}
            <div>
              <label htmlFor="powerHP" className="block mb-2 text-sm font-medium">Power (HP)</label>
              <input
                type="number"
                id="powerHP"
                name="powerHP"
                value={editableCar.powerHP}
                min={1}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Gear */}
            <div>
              <label htmlFor="gear" className="block mb-2 text-sm font-medium">Gear</label>
              <select
                id="gear"
                name="gear"
                value={editableCar.gear}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              >
                <option value="">Select Gear Type</option>
                {Object.values(GearType).map((gear) => (
                  <option key={gear} value={gear}>{gear}</option>
                ))}
              </select>
            </div>

            {/* Mileage */}
            <div>
              <label htmlFor="mileage" className="block mb-2 text-sm font-medium">Mileage (km)</label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={editableCar.mileage}
                min={0}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block mb-2 text-sm font-medium">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                value={editableCar.image}
                placeholder="https://example.com/car.jpg"
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block mb-2 text-sm font-medium">Status</label>
              <select
                id="status"
                name="status"
                value={editableCar.status}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              >
                <option value={CarStatus.available}>Available</option>
                <option value={CarStatus.reserved}>Reserved</option>
              </select>
            </div>

            {/* Save Changes Button */}
            <div className="col-span-full">
              <ActionButton
                text="Save Changes"
                icon="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                customClasses="w-full justify-center"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCar;
