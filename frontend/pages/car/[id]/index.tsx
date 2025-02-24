import Head from "next/head";
import { useEffect } from "react";
import useCar from "@/lib/hooks/useCar";
import config from "@/lib/config";
import useAuthentication from "@/lib/hooks/useAuthentication";
import { useRouter } from "next/router";
import { useCarContext } from "@/CarContext";
import { useAuth } from "@/AuthContext";
import { CarStatus } from "@/lib/types";

/**
 * The Car Details Page component.
 *
 * @component
 * @returns {JSX.Element} The rendered Car details page.
 */
const CarPage = () => {
  const router = useRouter();
  const carId = router.query.id as string;

  const { getCarById } = useCar();
  const { carState: { car } } = useCarContext();
  const { token } = useAuthentication();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && carId) {
      getCarById(carId);
    }
  }, [isAuthenticated, router.query, token]);

  // Format date to a readable string
  const formatDateTime = (isoDateTime?: string) =>
    isoDateTime ? new Date(isoDateTime).toLocaleString() : "-";

  return (
    <>
      <Head>
        <title>{car?.make} {car?.model} {config.titleWithSeparator}</title>
        <meta name="description" content={`View details for ${car?.make} ${car?.model}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col md:flex-row pt-16 md:min-h-screen max-h-screen">
        {/* Car Image Section */}
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

        {/* Car Details Section */}
        <div className="w-full relative overflow-x-auto shadow-md p-4 lg:p-8">
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Make */}
            <div>
              <label htmlFor="car-make" className="block mb-2 text-sm font-medium">Make</label>
              <input
                id="car-make"
                type="text"
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={car?.make || "-"}
                readOnly
              />
            </div>

            {/* Model */}
            <div>
              <label htmlFor="car-model" className="block mb-2 text-sm font-medium">Model</label>
              <input
                id="car-model"
                type="text"
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={car?.model || "-"}
                readOnly
              />
            </div>

            {/* Body Type */}
            <div>
              <label htmlFor="car-body-type" className="block mb-2 text-sm font-medium">Body Type</label>
              <input
                id="car-body-type"
                type="text"
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={car?.bodyType || "-"}
                readOnly
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label htmlFor="car-fuel-type" className="block mb-2 text-sm font-medium">Fuel Type</label>
              <input
                id="car-fuel-type"
                type="text"
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={car?.fuelType || "-"}
                readOnly
              />
            </div>

            {/* First Registration */}
            <div>
              <label htmlFor="car-first-registration" className="block mb-2 text-sm font-medium">First Registration</label>
              <input
                id="car-first-registration"
                type="number"
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={car?.firstRegistration || "-"}
                readOnly
              />
            </div>

            {/* Power HP */}
            <div>
              <label htmlFor="car-power" className="block mb-2 text-sm font-medium">Power (HP)</label>
              <input
                id="car-power"
                type="number"
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={car?.powerHP || "-"}
                readOnly
              />
            </div>

            {/* Gear */}
            <div>
              <label htmlFor="car-gear" className="block mb-2 text-sm font-medium">Gear</label>
              <input
                id="car-gear"
                type="text"
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={car?.gear || "-"}
                readOnly
              />
            </div>

            {/* Mileage */}
            <div>
              <label htmlFor="car-mileage" className="block mb-2 text-sm font-medium">Mileage (km)</label>
              <input
                id="car-mileage"
                type="number"
                className="shadow-sm bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={car?.mileage || 0}
                readOnly
              />
            </div>

            {/* Created At */}
            <div>
              <label htmlFor="car-created-at" className="block mb-2 text-sm font-medium">Created At</label>
              <input
                id="car-created-at"
                type="text"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={formatDateTime(car?.createdAt)}
                readOnly
              />
            </div>

            {/* Updated At */}
            <div>
              <label htmlFor="car-updated-at" className="block mb-2 text-sm font-medium">Last Updated</label>
              <input
                id="car-updated-at"
                type="text"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                value={formatDateTime(car?.updatedAt)}
                readOnly
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="car-status" className="block mb-2 text-sm font-medium">Status</label>
              <input
                id="car-status"
                type="text"
                className={`shadow-sm border text-sm rounded-lg w-full p-2.5 ${car?.status === CarStatus.available ? "bg-green-100" : "bg-red-100"
                  }`}
                value={car?.status || CarStatus.reserved}
                readOnly
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CarPage;
