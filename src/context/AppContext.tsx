import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  PassengerProfile, 
  DriverProfile, 
  BusUnit, 
  RouteItem, 
  BookingTicket, 
  IncidentReport, 
  SystemAlert, 
  PncStatus,
  PaymentMethod 
} from '../types';
import { 
  INITIAL_ROUTES, 
  INITIAL_DRIVERS, 
  INITIAL_BUSES, 
  INITIAL_PASSENGERS, 
  INITIAL_BOOKINGS, 
  INITIAL_INCIDENTS, 
  INITIAL_ALERTS 
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  loginUserByDpi: (cui: string, name?: string, isMinor?: boolean, guardianName?: string, guardianCui?: string) => { role: UserRole; name: string; info: string };
  logout: () => void;
  detectRoleFromDpi: (cui: string) => { role: UserRole; name?: string; label: string; busUnit?: string } | null;
  deviceViewMode: 'mobile' | 'desktop';
  setDeviceViewMode: (mode: 'mobile' | 'desktop') => void;
  
  // Passenger
  currentPassenger: PassengerProfile;
  allPassengers: PassengerProfile[];
  loginPassenger: (cui: string, fullName: string, isMinor: boolean, guardianName?: string, guardianCui?: string) => void;
  updatePncStatus: (status: PncStatus) => void;
  
  // Driver
  currentDriver: DriverProfile;
  allDrivers: DriverProfile[];
  setDriver: (driverId: string) => void;
  driverTripState: {
    tripActive: boolean;
    gpsActive: boolean;
    currentStopIndex: number;
    passengersOnBoard: number;
  };
  startDriverTrip: () => void;
  endDriverTrip: () => void;
  toggleDriverGps: () => void;
  nextDriverStop: () => void;
  collectCash: (bookingId: string, amount: number) => { change: number; success: boolean };
  
  // Fleet & Routes
  buses: BusUnit[];
  routes: RouteItem[];
  selectedBusId: string | null;
  setSelectedBusId: (id: string | null) => void;
  
  // Bookings
  bookings: BookingTicket[];
  createBooking: (data: {
    routeId: string;
    busUnit: string;
    seatNumber: number;
    boardingStopId: string;
    destinationStopId: string;
    price: number;
    paymentMethod: PaymentMethod;
  }) => BookingTicket;
  
  // Incidents & Alerts
  incidents: IncidentReport[];
  reportIncident: (type: IncidentReport['type'], location: string, description: string, severity: 'baja' | 'media' | 'alta') => void;
  resolveIncident: (id: string) => void;
  alerts: SystemAlert[];
  markAlertAsRead: (id: string) => void;
  addAlert: (alert: Omit<SystemAlert, 'id' | 'timestamp' | 'read'>) => void;
}

export const ADMIN_USER = {
  cui: '1001 00000 0101',
  name: 'Ing. Rodrigo Alvarado',
  role: 'admin' as UserRole,
  title: 'Director General de Operaciones y Flota'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('passenger');
  const [deviceViewMode, setDeviceViewMode] = useState<'mobile' | 'desktop'>('mobile');
  
  const [routes] = useState<RouteItem[]>(INITIAL_ROUTES);
  const [buses, setBuses] = useState<BusUnit[]>(INITIAL_BUSES);
  const [allDrivers] = useState<DriverProfile[]>(INITIAL_DRIVERS);
  const [currentDriver, setCurrentDriver] = useState<DriverProfile>(INITIAL_DRIVERS[0]);
  
  const [allPassengers, setAllPassengers] = useState<PassengerProfile[]>(INITIAL_PASSENGERS);
  const [currentPassenger, setCurrentPassenger] = useState<PassengerProfile>(INITIAL_PASSENGERS[0]);
  
  const [bookings, setBookings] = useState<BookingTicket[]>(INITIAL_BOOKINGS);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  
  const [selectedBusId, setSelectedBusId] = useState<string | null>('bus-01');
  
  // Driver Trip Live State
  const [driverTripState, setDriverTripState] = useState({
    tripActive: true,
    gpsActive: true,
    currentStopIndex: 2,
    passengersOnBoard: 28
  });

  // GPS Simulation: Smoothly move buses every 3 seconds along their routes
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => {
        return prevBuses.map((bus) => {
          if (bus.status === 'detenido') {
            return bus;
          }
          // Slight delta in lat/lng heading toward Guatemala City or Amatitlán
          const latDelta = (Math.random() * 0.0006 - 0.0002) * (bus.speedKmH > 0 ? 1 : 0);
          const lngDelta = (Math.random() * 0.0004 - 0.0001) * (bus.speedKmH > 0 ? 1 : 0);
          
          let newLat = bus.lat + latDelta;
          let newLng = bus.lng + lngDelta;

          // Keep in bounds roughly between Amatitlán (14.47) and Mixco/Z12 (14.63)
          if (newLat > 14.62) newLat = 14.49;
          if (newLat < 14.48) newLat = 14.50;

          // Speed fluctuation
          const speedFluctuation = Math.floor(Math.random() * 7) - 3;
          const newSpeed = Math.max(25, Math.min(65, bus.speedKmH + speedFluctuation));

          return {
            ...bus,
            lat: Number(newLat.toFixed(5)),
            lng: Number(newLng.toFixed(5)),
            speedKmH: newSpeed,
            lastUpdate: 'En vivo (ahora)'
          };
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const detectRoleFromDpi = (rawCui: string): { role: UserRole; name?: string; label: string; busUnit?: string } | null => {
    const clean = rawCui.replace(/\D/g, '');
    const lower = rawCui.trim().toLowerCase();

    // Check Administrator
    if (clean === ADMIN_USER.cui.replace(/\D/g, '') || lower.includes('admin')) {
      return {
        role: 'admin',
        name: ADMIN_USER.name,
        label: 'Administrador de Flota Central'
      };
    }

    // Check Registered Driver
    const driver = allDrivers.find(d => d.cui.replace(/\D/g, '') === clean);
    if (driver) {
      return {
        role: 'driver',
        name: driver.name,
        label: `Chofer Oficial (${driver.licenseNumber})`,
        busUnit: driver.assignedBusId.toUpperCase()
      };
    }

    // Check Registered Passenger
    const passenger = allPassengers.find(p => p.cui.replace(/\D/g, '') === clean);
    if (passenger) {
      return {
        role: 'passenger',
        name: passenger.fullName,
        label: passenger.isMinor ? 'Pasajero Menor de Edad (con tutor)' : 'Pasajero Frecuente'
      };
    }

    // If 13 digits, new passenger
    if (clean.length === 13) {
      return {
        role: 'passenger',
        label: 'Nuevo Pasajero (Registro Automático)'
      };
    }

    return null;
  };

  const loginUserByDpi = (
    cui: string, 
    name?: string, 
    isMinor: boolean = false, 
    guardianName?: string, 
    guardianCui?: string
  ): { role: UserRole; name: string; info: string } => {
    const clean = cui.replace(/\D/g, '');
    const lower = cui.trim().toLowerCase();

    // 1. Admin Login
    if (clean === ADMIN_USER.cui.replace(/\D/g, '') || lower.includes('admin')) {
      setRole('admin');
      setIsAuthenticated(true);
      addAlert({
        title: 'Sesión de Administrador Iniciada',
        message: `Bienvenido, ${ADMIN_USER.name}. Acceso total a consola de monitoreo, telemetría y flota.`,
        type: 'info'
      });
      return {
        role: 'admin',
        name: ADMIN_USER.name,
        info: 'Centro de Control General de Operaciones y Flota'
      };
    }

    // 2. Driver Login
    const driver = allDrivers.find(d => d.cui.replace(/\D/g, '') === clean);
    if (driver) {
      setCurrentDriver(driver);
      setRole('driver');
      setIsAuthenticated(true);
      addAlert({
        title: 'Turno de Chofer Activado',
        message: `Bienvenido Don ${driver.name.split(' ')[0]}. Unidad asignada: ${driver.assignedBusId.toUpperCase()}.`,
        type: 'info',
        busId: driver.assignedBusId
      });
      return {
        role: 'driver',
        name: driver.name,
        info: `Unidad de Bus: ${driver.assignedBusId.toUpperCase()} · Licencia ${driver.licenseType.split(' ')[0]}`
      };
    }

    // 3. Passenger Login / Registration
    const existingPassenger = allPassengers.find(p => p.cui.replace(/\D/g, '') === clean);
    if (existingPassenger) {
      setCurrentPassenger(existingPassenger);
      setRole('passenger');
      setIsAuthenticated(true);
      addAlert({
        title: 'Bienvenido a RutaBus GT',
        message: `Hola ${existingPassenger.fullName.split(' ')[0]}, tus viajes y saldo están sincronizados.`,
        type: 'info'
      });
      return {
        role: 'passenger',
        name: existingPassenger.fullName,
        info: 'Pasajero Verificado (PNC Limpio)'
      };
    }

    // New passenger registration
    const formattedCui = clean.length === 13 
      ? `${clean.slice(0, 4)} ${clean.slice(4, 9)} ${clean.slice(9)}` 
      : cui;
    const finalName = name?.trim() || 'Nuevo Pasajero';
    const newPassenger: PassengerProfile = {
      id: `pass-${Date.now()}`,
      cui: formattedCui,
      fullName: finalName,
      email: `${finalName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: '502 5500-1122',
      isMinor,
      guardianName,
      guardianCui,
      pncStatus: clean.endsWith('9') ? 'criminal_record' : 'clean',
      pncCheckDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      walletBalance: 50.00
    };

    setAllPassengers(prev => [newPassenger, ...prev]);
    setCurrentPassenger(newPassenger);
    setRole('passenger');
    setIsAuthenticated(true);

    addAlert({
      title: 'Registro de Pasajero Completado',
      message: `CUI ${formattedCui} verificado exitosamente en la base policial y municipal.`,
      type: 'success'
    });

    return {
      role: 'passenger',
      name: finalName,
      info: isMinor ? `Menor de edad (Tutor: ${guardianName || 'Registrado'})` : 'Usuario Aprobado para Viajar'
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const loginPassenger = (
    cui: string, 
    fullName: string, 
    isMinor: boolean, 
    guardianName?: string, 
    guardianCui?: string
  ) => {
    const existing = allPassengers.find(p => p.cui.replace(/\s+/g, '') === cui.replace(/\s+/g, ''));
    if (existing) {
      setCurrentPassenger(existing);
      return;
    }
    const newPassenger: PassengerProfile = {
      id: `pass-${Date.now()}`,
      cui,
      fullName,
      email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: '502 5500-1122',
      isMinor,
      guardianName,
      guardianCui,
      pncStatus: 'clean',
      pncCheckDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      walletBalance: 50.00
    };
    setAllPassengers(prev => [newPassenger, ...prev]);
    setCurrentPassenger(newPassenger);
  };

  const updatePncStatus = (status: PncStatus) => {
    setCurrentPassenger(prev => ({
      ...prev,
      pncStatus: status,
      pncCheckDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }));
  };

  const setDriver = (driverId: string) => {
    const found = allDrivers.find(d => d.id === driverId);
    if (found) {
      setCurrentDriver(found);
    }
  };

  const startDriverTrip = () => {
    setDriverTripState(prev => ({
      ...prev,
      tripActive: true,
      gpsActive: true
    }));
    addAlert({
      title: 'Viaje Iniciado',
      message: `${currentDriver.name} ha iniciado el recorrido en la unidad ${currentDriver.assignedBusId.toUpperCase()}.`,
      type: 'info',
      busId: currentDriver.assignedBusId,
      routeId: currentDriver.assignedRouteId
    });
  };

  const endDriverTrip = () => {
    setDriverTripState(prev => ({
      ...prev,
      tripActive: false,
      gpsActive: false
    }));
    addAlert({
      title: 'Viaje Finalizado',
      message: `El recorrido ha concluido exitosamente en terminal. Pasajeros desembarcados.`,
      type: 'success',
      busId: currentDriver.assignedBusId
    });
  };

  const toggleDriverGps = () => {
    setDriverTripState(prev => ({
      ...prev,
      gpsActive: !prev.gpsActive
    }));
  };

  const nextDriverStop = () => {
    setDriverTripState(prev => ({
      ...prev,
      currentStopIndex: Math.min(prev.currentStopIndex + 1, 6)
    }));
  };

  const collectCash = (bookingId: string, amount: number) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { change: 0, success: false };

    const change = Math.max(0, amount - booking.price);

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          paymentStatus: 'pagado',
          status: 'a_bordo'
        };
      }
      return b;
    }));

    // Update driver cash count
    setCurrentDriver(prev => ({
      ...prev,
      todayEarnings: {
        ...prev.todayEarnings,
        cashCollected: prev.todayEarnings.cashCollected + booking.price
      }
    }));

    addAlert({
      title: 'Cobro Registrado',
      message: `Se registraron Q${booking.price.toFixed(2)} de ${booking.passengerName}. Cambio: Q${change.toFixed(2)}.`,
      type: 'success'
    });

    return { change, success: true };
  };

  const createBooking = (data: {
    routeId: string;
    busUnit: string;
    seatNumber: number;
    boardingStopId: string;
    destinationStopId: string;
    price: number;
    paymentMethod: PaymentMethod;
  }) => {
    const route = routes.find(r => r.id === data.routeId) || routes[0];
    const bStop = route.stops.find(s => s.id === data.boardingStopId) || route.stops[0];
    const dStop = route.stops.find(s => s.id === data.destinationStopId) || route.stops[route.stops.length - 1];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newTicket: BookingTicket = {
      id: `TKT-GT-${randomSuffix}`,
      passengerId: currentPassenger.id,
      passengerName: currentPassenger.fullName,
      passengerCui: currentPassenger.cui,
      routeId: data.routeId,
      routeName: route.name,
      busUnit: data.busUnit,
      driverName: currentDriver.name,
      seatNumber: data.seatNumber,
      boardingStopId: data.boardingStopId,
      boardingStopName: bStop.name,
      destinationStopId: data.destinationStopId,
      destinationStopName: dStop.name,
      price: data.price,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'efectivo' ? 'pendiente_efectivo' : 'pagado',
      qrToken: `RTB-GT-2026-S${data.seatNumber}-${data.busUnit}-${randomSuffix}`,
      departureTime: 'Próxima Salida (10 min)',
      bookingDate: new Date().toISOString().substring(0, 10),
      status: 'valido'
    };

    setBookings(prev => [newTicket, ...prev]);

    // Add notification alert
    addAlert({
      title: 'Boleto Emitido con Éxito',
      message: `Asiento #${data.seatNumber} reservado en unidad ${data.busUnit}. Muestra tu código QR al abordar.`,
      type: 'success'
    });

    return newTicket;
  };

  const reportIncident = (
    type: IncidentReport['type'], 
    location: string, 
    description: string, 
    severity: 'baja' | 'media' | 'alta'
  ) => {
    const newInc: IncidentReport = {
      id: `inc-${Date.now()}`,
      busId: currentDriver.assignedBusId,
      busUnit: currentDriver.assignedBusId.toUpperCase(),
      driverName: currentDriver.name,
      routeId: currentDriver.assignedRouteId,
      type,
      location,
      description,
      timestamp: 'Ahora mismo',
      resolved: false,
      severity
    };

    setIncidents(prev => [newInc, ...prev]);

    // Mark bus as incident
    setBuses(prev => prev.map(b => b.id === currentDriver.assignedBusId ? { ...b, hasIncident: true } : b));

    addAlert({
      title: `Incidencia Reportada: ${type.toUpperCase()}`,
      message: `${location}: ${description}`,
      type: 'alert',
      busId: currentDriver.assignedBusId
    });
  };

  const resolveIncident = (id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, resolved: true } : i));
    addAlert({
      title: 'Incidencia Solventada',
      message: 'La alerta operativa ha sido resuelta por la central de monitoreo.',
      type: 'info'
    });
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const addAlert = (alertData: Omit<SystemAlert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: SystemAlert = {
      id: `alt-${Date.now()}`,
      ...alertData,
      timestamp: 'Hace un instante',
      read: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        loginUserByDpi,
        logout,
        detectRoleFromDpi,
        deviceViewMode,
        setDeviceViewMode,
        currentPassenger,
        allPassengers,
        loginPassenger,
        updatePncStatus,
        currentDriver,
        allDrivers,
        setDriver,
        driverTripState,
        startDriverTrip,
        endDriverTrip,
        toggleDriverGps,
        nextDriverStop,
        collectCash,
        buses,
        routes,
        selectedBusId,
        setSelectedBusId,
        bookings,
        createBooking,
        incidents,
        reportIncident,
        resolveIncident,
        alerts,
        markAlertAsRead,
        addAlert
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
