import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { Garage } from './lib/types';

interface GarageState {
    garage: Garage | null;
}

interface GaragesState {
    garages: Garage[];
    savedGarages: Garage[];
}

type SetState<T> = Dispatch<SetStateAction<T>>;

interface GarageContextProps {
    garageState: GarageState;
    setGarageState: SetState<GarageState>;
    garagesState: GaragesState;
    setGaragesState: SetState<GaragesState>;
}

const GarageContext = createContext<GarageContextProps>({} as GarageContextProps);

export const GarageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [garageState, setGarageState] = useState<GarageState>({ garage: null });
    const [garagesState, setGaragesState] = useState<GaragesState>({
        garages: [],
        savedGarages: [],
    });

    return (
        <GarageContext.Provider value={{ garageState, setGarageState, garagesState, setGaragesState }}>
            {children}
        </GarageContext.Provider>
    );
};

export const useGarageContext = () => {
    const context = useContext(GarageContext);
    if (!context) {
        throw new Error('useGarageContext must be used within a GarageProvider');
    }
    return context;
};
