import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { Car } from './lib/types';

interface CarState {
    car: Car | null;
}

interface CarsState {
    cars: Car[];
}

type SetState<T> = Dispatch<SetStateAction<T>>;

interface CarContextProps {
    carState: CarState;
    setCarState: SetState<CarState>;
    carsState: CarsState;
    setCarsState: SetState<CarsState>;
}

const CarContext = createContext<CarContextProps>({} as CarContextProps);

export const CarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [carState, setCarState] = useState<CarState>({ car: null });
    const [carsState, setCarsState] = useState<CarsState>({
        cars: [],
    });

    return (
        <CarContext.Provider value={{ carState, setCarState, carsState, setCarsState }}>
            {children}
        </CarContext.Provider>
    );
};

export const useCarContext = () => {
    const context = useContext(CarContext);
    if (!context) {
        throw new Error('useCarContext must be used within a CarProvider');
    }
    return context;
};
