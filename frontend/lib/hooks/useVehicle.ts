import axios, { AxiosResponse } from 'axios';
import { useState } from 'react';
import { Make, Model } from '@/lib/types';
import { useNotification } from './useNotification';
import useAuthentication from './useAuthentication';
import { useVehicleContext } from '@/VehicleContext';
import config from '../config';

const useVehicle = () => {
    const { onError } = useNotification();
    const { token } = useAuthentication();

    const [loading, setLoading] = useState<boolean>(false);
    const { setVehicleState, vehicleState } = useVehicleContext();

    /**
     * Fetch vehicle makes from your API.
     */
    const getVehicleMakes = async (): Promise<void> => {
        setLoading(true);
        try {
            if (token) {
                const result: AxiosResponse<Make[]> = await axios.get(`${config.vehicle}/makes`, {
                    headers: {
                        bearer: token,
                    },
                });
                setVehicleState((prevState: any) => ({
                    ...prevState,
                    makes: result.data,
                }));
            }
        } catch (error) {
            console.error(error);
            onError('Failed to fetch vehicle makes.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch vehicle models based on make ID from your API.
     * @param name - The name of the selected make
     */
    const getVehicleModels = async (name: string): Promise<void> => {
        if (!name) return;
        setLoading(true);
        try {
            const response: AxiosResponse<Model[]> = await axios.get(`${config.vehicle}/models/${name}`, {
                headers: {
                    bearer: token,
                },
            });
            setVehicleState((prevState: any) => ({
                ...prevState,
                models: response.data,
            }));
        } catch (error) {
            console.error(error);
            onError('Failed to fetch vehicle models.');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        getVehicleMakes,
        getVehicleModels,
    };
};

export default useVehicle;
