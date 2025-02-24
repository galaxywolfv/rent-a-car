import Head from "next/head";
import { ChangeEvent, useEffect, useState } from "react";
import useCar from "@/lib/hooks/useCar";
import { Car } from "@/lib/types";
import config from "@/lib/config";
import useAuthentication from "@/lib/hooks/useAuthentication";
import { useRouter } from "next/router";
import { useCarContext } from "@/CarContext";
import { useAuth } from "@/AuthContext";
import ActionButton from "@/components/common/actionButton";

// Helper functions to format dates as YYYY-MM-DD
const getTodayDate = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getOneWeekLaterDate = (): string => {
  const today = new Date();
  today.setDate(today.getDate() + 7);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const RentCar = () => {
  const router = useRouter();
  const carId = router.query.id as string;

  const { getCarById } = useCar();
  const { carState: { car }, setCarState } = useCarContext();
  const { isAuthenticated } = useAuth();
  const { token } = useAuthentication();

  // Compute today's date for default & min value
  const todayDate = getTodayDate();
  const defaultEndDate = getOneWeekLaterDate();

  // Rental form state: default start date is today, end date is one week later
  const [rentalInfo, setRentalInfo] = useState({
    startDate: todayDate,
    endDate: defaultEndDate,
  });

  // Fetch the selected car when the page loads
  useEffect(() => {
    if (isAuthenticated && carId) {
      getCarById(carId);
    }
  }, [isAuthenticated, carId, token]);

  // Update local context when car data is loaded
  useEffect(() => {
    if (car) {
      setCarState((prev) => ({ ...prev, car }));
    }
  }, [car]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // When the start date changes, also ensure that the end date isn't before the new start date.
    setRentalInfo((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "startDate" && { endDate: value > prev.endDate ? value : prev.endDate }),
    }));
  };

  const handleRentCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would call your reservation service to create a rental reservation.
    console.log("Creating reservation for:", car, rentalInfo);
    // Redirect to a confirmation page or show a success message.
    router.push("/reservations/confirmation");
  };

  return (
    <>
      <Head>
        <title>
          Rent a {car?.make} {car?.model} {car?.bodyType} ({car?.firstRegistration}) {config.titleWithSeparator}
        </title>
        <meta name="description" content={`Rent ${car?.make} ${car?.model}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col md:flex-row pt-16 md:min-h-screen">
        {/* Car Information Section */}
        <div className="bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow p-5 flex items-center justify-center min-w-fit">
          <div className="flex flex-col items-center">
            <img
              className="w-40 h-40 md:w-56 md:h-56 rounded object-cover"
              src={car?.image || "/favicon.svg"}
              alt={`${car?.make} ${car?.model}`}
            />
            <h5 className="mt-3 text-xl font-semibold text-black text-center">
              {car?.make} {car?.model} ({car?.firstRegistration})
            </h5>
          </div>
        </div>

        {/* Rent Car Form */}
        <div className="w-full relative overflow-x-auto shadow-md p-4 lg:p-8">
          <form className="w-full grid grid-cols-1 gap-6" onSubmit={handleRentCar}>
            {/* Rental Start Date */}
            <div>
              <label htmlFor="startDate" className="block mb-2 text-sm font-medium">
                Rental Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={rentalInfo.startDate}
                onChange={handleInputChange}
                min={todayDate}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Rental End Date */}
            <div>
              <label htmlFor="endDate" className="block mb-2 text-sm font-medium">
                Rental End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={rentalInfo.endDate}
                onChange={handleInputChange}
                // Ensure the end date can't be before the selected start date
                min={rentalInfo.startDate}
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                required
              />
            </div>

            {/* Confirm Rent Button */}
            <div className="col-span-full">
              <ActionButton
                text="Create Reservation"
                customClasses="w-full justify-center bg-brand text-white"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RentCar;
