import Head from "next/head";
import { ChangeEvent, useState } from "react";
import { Garage } from "@/lib/types";
import config from "@/lib/config";
import { useAuth } from "@/AuthContext";
import useGarage from "@/lib/hooks/useGarage";
import ActionButton from "@/components/common/actionButton";
import { useRouter } from "next/router";

/**
 * The Garage Creation Page component.
 *
 * @component
 * @returns {JSX.Element} The rendered Garage Creation page.
 */
const CreateGarage = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { createGarage } = useGarage();

    const [garage, setGarage] = useState<Partial<Garage>>({
        name: "",
    });

    // Handle form submission
    const handleCreateGarage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isAuthenticated && garage.name) {
            await createGarage(garage as Garage).then(() => router.back());
        }
    };

    // Handle input change
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setGarage((prevGarage) => ({
            ...prevGarage,
            [name]: value,
        }));
    };

    return (
        <>
            <Head>
                <title>Create a New Garage {config.titleWithSeparator}</title>
                <meta name="description" content="Create a new garage for car rentals" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex flex-col md:flex-row pt-16 md:min-h-screen max-h-screen">
                <div className="w-full relative overflow-x-auto p-4 lg:p-8 mx-auto lg:max-w-4xl">
                    <form className="w-full" onSubmit={handleCreateGarage}>
                        {/* Garage Name */}
                        <div className="mb-6">
                            <label htmlFor="garage-name" className="block mb-2 text-sm font-medium text-gray-900">
                                Garage Name
                            </label>
                            <input
                                type="text"
                                id="garage-name"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Enter garage name"
                                required
                                name="name"
                                value={garage.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <ActionButton
                            text="Create Garage"
                            icon="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            customClasses="w-full md:w-max justify-center"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateGarage;
