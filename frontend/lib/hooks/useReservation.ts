import axios, { AxiosResponse } from 'axios';
import { useNotification } from "./useNotification";
import config from "../config";
import { Reservation } from "../types";
import useAuthentication from './useAuthentication';
import { useReservationContext } from '@/ReservationContext';
import { useState } from 'react';

const useReservation = () => {
    const { onError } = useNotification();
    const { token } = useAuthentication();
    const { setReservationState } = useReservationContext();
    const [loading, setLoading] = useState<boolean>(false);

    // Create a new reservation
    const createReservation = async (reservationData: Partial<Reservation>): Promise<Reservation> => {
        try {
            const result: AxiosResponse<Reservation> = await axios.post(config.reservation, reservationData, {
               headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to create reservation.');
            throw error;
        }
    };

    // Get all reservations (for admins, all reservations; for others, only their own)
    const getReservations = async (): Promise<void> => {
        setLoading(true);
        try {
            const result: AxiosResponse<Reservation[]> = await axios.get(config.reservation, {
               headers: {
                    bearer: token,
                },
            });
            setReservationState((prevState: any) => ({
                ...prevState,
                reservations: result.data,
            }));
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch reservations.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Get a single reservation by ID
    const getReservationById = async (id: string): Promise<Reservation> => {
        try {
            const result: AxiosResponse<Reservation> = await axios.get(`${config.reservation}/${id}`, {
               headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to fetch reservation.');
            throw error;
        }
    };

    // Update a reservation by ID
    const updateReservationById = async (id: string, reservationData: Partial<Reservation>): Promise<Reservation> => {
        try {
            const result: AxiosResponse<Reservation> = await axios.put(`${config.reservation}/${id}`, reservationData, {
               headers: {
                    bearer: token,
                },
            });
            return result.data;
        } catch (error: any) {
            console.error(error);
            onError('Failed to update reservation.');
            throw error;
        }
    };

    // Delete a reservation by ID
    const deleteReservationById = async (id: string): Promise<void> => {
        try {
            await axios.delete(`${config.reservation}/${id}`, {
               headers: {
                    bearer: token,
                },
            });
        } catch (error: any) {
            console.error(error);
            onError('Failed to delete reservation.');
            throw error;
        }
    };

    return {
        createReservation,
        getReservations,
        getReservationById,
        updateReservationById,
        deleteReservationById,
        loading,
        setLoading,
    };
};

export default useReservation;
