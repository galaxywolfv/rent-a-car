import axios, { AxiosResponse } from 'axios';
import { useNotification } from "./useNotification";
import config from "../config";
import { Garage } from "../types";
import useAuthentication from './useAuthentication';
import { useGarageContext } from '@/GarageContext';
import { useState } from 'react';

const useGarage = () => {
    const { onError } = useNotification();
    const { token } = useAuthentication();
    const { setGarageState } = useGarageContext();
    const [loading, setLoading] = useState<boolean>(false);

    // Create a new garage.
    // The backend will automatically assign the creator as the maintainer,
    // update their role, and set the user's garage field accordingly.
    const createGarage = async (garageData: Garage): Promise<Garage> => {
        try {
            const result: AxiosResponse<Garage> = await axios.post(config.garage, garageData, {
                headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to create garage.');
            throw error;
        }
    };

    // Get all garages.
    const getAllGarages = async (): Promise<void> => {
        setLoading(true);
        try {
            const result: AxiosResponse<Garage[]> = await axios.get(config.garage, {
                headers: {
                    bearer: token,
                },
            });
            setGarageState((prevState: any) => ({
                ...prevState,
                garages: result.data,
            }));
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch garages.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Get a single garage by ID.
    const getGarageById = async (id: string): Promise<void> => {
        setLoading(true);
        try {
            const result: AxiosResponse<Garage> = await axios.get(`${config.garage}/${id}`, {
                headers: {
                    bearer: token,
                },
            });
            setGarageState((prevState: any) => ({
                ...prevState,
                garage: result.data,
            }));
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch garage.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update a garage by ID.
    const updateGarageById = async (id: string, garageData: Garage): Promise<Garage> => {
        try {
            const result: AxiosResponse<Garage> = await axios.put(`${config.garage}/${id}`, garageData, {
                headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to update garage.');
            throw error;
        }
    };

    // Delete a garage by ID.
    const deleteGarageById = async (id: string): Promise<void> => {
        try {
            await axios.delete(`${config.garage}/${id}`, {
                headers: {
                    bearer: token,
                },
            });
        } catch (error: any) {
            console.error(error);
            onError('Failed to delete garage.');
            throw error;
        }
    };

    return {
        createGarage,
        getAllGarages,
        getGarageById,
        updateGarageById,
        deleteGarageById,
        setLoading,
        loading,
    };
};

export default useGarage;
