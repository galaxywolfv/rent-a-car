import axios, { AxiosResponse } from 'axios';
import { useNotification } from "./useNotification";
import config from "../config";
import { Car } from "../types";
import useAuthentication from './useAuthentication';
import { useCarContext } from '@/CarContext';
import { useState } from 'react';

const useCar = () => {
    const { onError } = useNotification();
    const { token } = useAuthentication();
    const { setCarState } = useCarContext();
    const { setCarsState } = useCarContext();
    const [loading, setLoading] = useState<boolean>(false);

    // Create a new car
    const createCar = async (carData: Car): Promise<Car> => {
        try {
            const result: AxiosResponse<Car> = await axios.post(config.car, carData, {
                headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to create car.');
            throw error;
        }
    };

    // Get a car by its ID and update the Car context state
    const getCarById = async (id: string): Promise<void> => {
        try {
            if (token) {
                const result: AxiosResponse<Car> = await axios.get(`${config.car}/${id}`, {
                    headers: {
                        bearer: token,
                    },
                });
                setCarState((prevState: any) => ({
                    ...prevState,
                    car: result.data,
                }));
            }
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch car.');
            throw error;
        }
    };

    // Update a car by its ID
    const updateCarById = async (id: string, carData: Car): Promise<Car> => {
        try {
            const result: AxiosResponse<Car> = await axios.put(`${config.car}/${id}`, carData, {
                headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to update car.');
            throw error;
        }
    };

    // Delete a car by its ID
    const deleteCarById = async (id: string): Promise<void> => {
        try {
            await axios.delete(`${config.car}/${id}`, {
                headers: {
                    bearer: token,
                },
            });
        } catch (error: any) {
            console.error(error);
            onError('Failed to delete car.');
            throw error;
        }
    };

    // Get all cars
    const getCars = async (): Promise<Car[]> => {
        try {
            const result: AxiosResponse<Car[]> = await axios.get(config.car, {
                headers: {
                    bearer: token,
                },
            });
            setCarsState((prevState: any) => ({
                ...prevState,
                cars: result.data,
            }));
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch cars.');
            throw error;
        }
    };

    // Get available cars for a given date range.
    // If no endDate is provided, the end date defaults to the start date.
    const getAvailableCars = async (startDate: string, endDate?: string): Promise<Car[]> => {
        try {
            const effectiveEndDate = endDate || startDate;
            const result: AxiosResponse<Car[]> = await axios.get(`${config.car}/available`, {
                headers: {
                    bearer: token,
                },
                params: { startDate, endDate: effectiveEndDate }
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch available cars.');
            throw error;
        }
    };

    return {
        createCar,
        getCarById,
        updateCarById,
        deleteCarById,
        getCars,
        getAvailableCars,
        setLoading,
        loading,
    };
};

export default useCar;
