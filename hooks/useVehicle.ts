import { useEffect } from 'react';
import { VehicleDataService } from '../services/vehicleData';
import { useUserStore } from '../store/userStore';

export const useVehicle = (vehicleId: string) => {
  const vehicle = VehicleDataService.getVehicleById(vehicleId);
  const { isFavorite, addFavorite, removeFavorite, addHistory } = useUserStore();

  useEffect(() => {
    if (vehicle) {
      addHistory({
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`,
        viewedAt: new Date().toISOString(),
      });
    }
  }, [vehicleId]);

  const toggleFavorite = () => {
    if (!vehicle) return;
    if (isFavorite(vehicle.id)) {
      removeFavorite(vehicle.id);
    } else {
      addFavorite({
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`,
        savedAt: new Date().toISOString(),
      });
    }
  };

  return {
    vehicle,
    isFavorite: vehicle ? isFavorite(vehicle.id) : false,
    toggleFavorite,
  };
};
