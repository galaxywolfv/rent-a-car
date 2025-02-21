import Head from "next/head";
import { ChangeEvent, useEffect, useState } from 'react';
import useModule from "@/lib/hooks/useModule";
import { Module } from "@/lib/types";
import config from "@/lib/config";
import useAuthentication from "@/lib/hooks/useAuthentication";
import { useRouter } from "next/router";
import { useModuleContext } from "@/ModuleContext";
import { useAuth } from "@/AuthContext";
import ActionButton from "@/components/common/actionButton";

/**
 * The create module page component.
 *
 * @component
 * @returns {JSX.Element} The rendered module page.
 */
const EditModule = () => {
    const router = useRouter();
    const moduleId = router.query.id as string;

    const { getModuleById, updateModuleById } = useModule();
    const { moduleState: { module } } = useModuleContext();
    const { setModuleState } = useModuleContext();
    const { token } = useAuthentication();

    const { isAuthenticated } = useAuth();
    const [editableModule, setModule] = useState<Partial<Module>>({
        name: '',
        description: '',
        ...module
    });

    const handleEditModule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (moduleId && isAuthenticated && editableModule.name && editableModule.description) {
            await updateModuleById(+moduleId, editableModule as Module).then((module) => {
                setModuleState((prevState) => ({
                    ...prevState,
                    module
                }));
                router.back()
            });
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setModule((prevModule) => ({
            ...prevModule,
            [name]: value
        }));
    };
    const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        const description: any = value;

        setModule((prevModule) => ({
            ...prevModule,
            [name]: description
        }));
    };

    useEffect(() => {
        if (isAuthenticated && moduleId) {
            getModuleById(+moduleId);
        }
    }, [isAuthenticated, router.query, token]);

    useEffect(() => {
        if (module) {
            setModule(module)
        }
    }, [module, router.query]);

    const formatDateTimeLocal = (isoDateTime: String | undefined) => {
        if (!isoDateTime) return;
        return isoDateTime.slice(0, 19).replace("T", " ") || "";
    }

    return (
        <>
            <Head>
                <title>Edit - {module?.name || "Unknown"}{config.titleWithSeparator}</title>
                <meta name="description" content="Writing. Fun, Intuitive." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </Head>

            <div className="flex flex-col md:flex-row pt-16 md:min-h-screen max-h-screen">
                <div className="bg-white lg:border lg:border-gray-200 rounded-lg lg:shadow p-5 flex items-center content-center justify-center min-w-fit">

                    <div className="flex flex-col items-center">
                        <img className="w-32 h-32 md:w-52 md:h-52 mr-1 rounded" src="../../favicon.svg" alt="logo" />
                        <div
                            className={`flex flex-col items-center rounded-2xl bg-opacity-50 z-10`}
                        >
                            <h5 className="mb-1 text-xl md:text-lg lg:text-xl font-semibold text-black text-center md:max-w-[10rem] lg:max-w-sm">
                                {module?.name || "Module Name"}
                            </h5>
                        </div>
                    </div>

                </div>
                <div className="w-full relative overflow-x-auto shadow-md p-4 lg:p-8">
                    <form className="w-full" onSubmit={handleEditModule}>
                        <div className="mb-6">
                            <label htmlFor="module-name" className="block mb-2 text-sm font-medium text-gray-900">
                                Module Name
                            </label>
                            <input
                                type="text"
                                id="module-name"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                placeholder={module?.name}
                                required
                                name="name"
                                value={editableModule?.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <label htmlFor="module-description" className="block mb-2 text-sm font-medium text-gray-900">
                            Description
                        </label>
                        <textarea
                            id="module-description"
                            rows={4}
                            className="block mb-6 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder={module?.description}
                            name="description"
                            value={editableModule?.description}
                            onChange={handleTextAreaChange}
                        ></textarea>

                        <label htmlFor="module_endpoints" className="block mb-2 text-sm font-medium text-gray-900">Endpoints</label>
                        <select disabled id="module_endpoints" className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5">
                            <option>-</option>
                        </select>

                        <label htmlFor="module_pricing" className="block mb-2 text-sm font-medium text-gray-900">Pricing Models</label>
                        <select disabled id="module_pricing" className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5">
                            <option>-</option>
                        </select>

                        <div className="flex flex-col md:flex-row">
                            <div className="md:mr-4 md:flex-grow">
                                <label htmlFor="module-created-at" className="block mb-2 text-sm font-medium text-gray-900">Created at</label>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                    </div>
                                    <input
                                        disabled
                                        type="datetime-local"
                                        id="module-created-at"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-2.5"
                                        placeholder="dd-mm-yyyy"
                                        name="created_at"
                                        value={formatDateTimeLocal(module?.createdAt)}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="md:flex-grow">
                                <label htmlFor="module-updated-at" className="block mb-2 text-sm font-medium text-gray-900">Updated at</label>
                                <div className="relative mb-6">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                                    </div>
                                    <input
                                        disabled
                                        type="datetime-local"
                                        id="module-updated-at"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-2.5"
                                        placeholder="dd-mm-yyyy"
                                        name="updated_at"
                                        value={formatDateTimeLocal(module?.updatedAt)}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <ActionButton onClick={() => handleEditModule} text="Save Changes" icon="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" customClasses="w-full md:w-max justify-center" />

                    </form>
                </div>
            </div>

        </>
    )
};

export default EditModule;
