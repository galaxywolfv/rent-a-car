// src/ReservationContext.tsx
import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { Reservation } from './lib/types';

interface ReservationState {
    reservation: Reservation | null;
}

interface ReservationsState {
    reservations: Reservation[];
    savedReservations: Reservation[];
}

type SetState<T> = Dispatch<SetStateAction<T>>;

interface ReservationContextProps {
    reservationState: ReservationState;
    setReservationState: SetState<ReservationState>;
    reservationsState: ReservationsState;
    setReservationsState: SetState<ReservationsState>;
}

const ReservationContext = createContext<ReservationContextProps>({} as ReservationContextProps);

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reservationState, setReservationState] = useState<ReservationState>({ reservation: null });
    const [reservationsState, setReservationsState] = useState<ReservationsState>({
        reservations: [],
        savedReservations: [],
    });

    return (
        <ReservationContext.Provider
            value={{ reservationState, setReservationState, reservationsState, setReservationsState }}
        >
            {children}
        </ReservationContext.Provider>
    );
};

export const useReservationContext = () => {
    const context = useContext(ReservationContext);
    if (!context) {
        throw new Error('useReservationContext must be used within a ReservationProvider');
    }
    return context;
};
