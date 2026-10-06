export type UserRole = 'passenger' | 'driver' | 'admin';

export type PncStatus = 'clean' | 'criminal_record' | 'pending';

export interface PassengerProfile {
  id: string;
  cui: string; // 13 digits DPI
  fullName: string;
  email: string;
  phone: string;
  isMinor: boolean;
  guardianName?: string;
  guardianCui?: string;
  pncStatus: PncStatus;
  pncCheckDate?: string;
  walletBalance: number;
}

export interface Stop {
  id: string;
  name: string;
  municipality: string;
  lat: number;
  lng: number;
  order: number;
  estimatedWaitMin?: number;
}

export interface RouteItem {
  id: string;
  code: string;
  name: string;
  origin: string;
  destination: string;
  description: string;
  basePrice: number;
  durationMin: number;
  color: string;
  schedule: string;
  stops: Stop[];
  activeBusesCount: number;
}

export interface BusUnit {
  id: string;
  unitNumber: string;
  plate: string;
  model: string;
  capacity: number; // e.g. 40 seats
  currentOccupancy: number;
  driverId: string;
  driverName: string;
  routeId: string;
  lat: number;
  lng: number;
  speedKmH: number;
  heading: number; // in degrees
  status: 'en_ruta' | 'detenido' | 'en_terminal' | 'mantenimiento';
  lastUpdate: string;
  nextStop: string;
  etaNextStopMin: number;
  hasIncident?: boolean;
}

export interface DriverProfile {
  id: string;
  name: string;
  cui: string;
  licenseNumber: string;
  licenseType: string;
  phone: string;
  experienceYears: number;
  assignedBusId: string;
  assignedRouteId: string;
  status: 'en_servicio' | 'en_descanso' | 'inactivo';
  rating: number;
  todayEarnings: {
    cashCollected: number;
    digitalPaid: number;
    commissionRate: number; // e.g. 0.15
    tripsCompleted: number;
  };
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'banco';

export interface BookingTicket {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerCui: string;
  routeId: string;
  routeName: string;
  busUnit: string;
  driverName: string;
  seatNumber: number;
  boardingStopId: string;
  boardingStopName: string;
  destinationStopId: string;
  destinationStopName: string;
  price: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pagado' | 'pendiente_efectivo';
  qrToken: string;
  departureTime: string;
  bookingDate: string;
  status: 'valido' | 'a_bordo' | 'utilizado' | 'cancelado';
}

export interface IncidentReport {
  id: string;
  busId: string;
  busUnit: string;
  driverName: string;
  routeId: string;
  type: 'trafico' | 'mecanico' | 'accidente' | 'bloqueo' | 'otro';
  location: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  severity: 'baja' | 'media' | 'alta';
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
  busId?: string;
  routeId?: string;
}
