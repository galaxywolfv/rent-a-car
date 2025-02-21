import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { Make, Model } from './lib/types';

interface VehicleState {
  makes: Make[];
  models: Model[];
}

type SetState<T> = Dispatch<SetStateAction<T>>;

interface VehicleContextProps {
  vehicleState: VehicleState;
  setVehicleState: SetState<VehicleState>;
}

const VehicleContext = createContext<VehicleContextProps>({} as VehicleContextProps);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicleState, setVehicleState] = useState<VehicleState>({
    makes: [],
    models: [],
  });

  return (
    <VehicleContext.Provider value={{ vehicleState, setVehicleState }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicleContext must be used within a VehicleProvider');
  }
  return context;
};
