import { RouteItem, BusUnit, DriverProfile, PassengerProfile, BookingTicket, IncidentReport, SystemAlert } from '../types';

export const INITIAL_ROUTES: RouteItem[] = [
  {
    id: 'route-01',
    code: 'R-01',
    name: 'Amatitlán ⇄ Cd. Guatemala (CENMA / Aguilar Batres / Z.12)',
    origin: 'Amatitlán Parque Central',
    destination: 'CENMA / Aguilar Batres Z.12',
    description: 'Corredor principal CA-9 Sur vía Autopista y Villa Nueva hacia Transmetro CENMA y Aguilar Batres.',
    basePrice: 12.00,
    durationMin: 45,
    color: '#1E3A8A',
    schedule: '04:30 AM - 09:30 PM (Cada 10 min)',
    activeBusesCount: 2,
    stops: [
      { id: 'st-101', name: 'Terminal Amatitlán (Parque Central)', municipality: 'Amatitlán', lat: 14.4880, lng: -90.6155, order: 1, estimatedWaitMin: 3 },
      { id: 'st-102', name: 'Entrada El Morlón (Km 28 CA-9)', municipality: 'Amatitlán', lat: 14.4985, lng: -90.6105, order: 2, estimatedWaitMin: 7 },
      { id: 'st-103', name: 'Paso Desnivel Cataluña / Metrocentro', municipality: 'Villa Nueva', lat: 14.5240, lng: -90.5900, order: 3, estimatedWaitMin: 15 },
      { id: 'st-104', name: 'Villa Nueva Centro (El Túnel)', municipality: 'Villa Nueva', lat: 14.5290, lng: -90.5870, order: 4, estimatedWaitMin: 22 },
      { id: 'st-105', name: 'Castañas / Monte María (Km 13.5)', municipality: 'Villa Nueva', lat: 14.5510, lng: -90.5650, order: 5, estimatedWaitMin: 30 },
      { id: 'st-106', name: 'Estación CENMA (Conexión Transmetro)', municipality: 'Villa Nueva / Z.12', lat: 14.5772, lng: -90.5516, order: 6, estimatedWaitMin: 38 },
      { id: 'st-107', name: 'Aguilar Batres 29 Calle (Entrada USAC)', municipality: 'Guatemala Z.12', lat: 14.5950, lng: -90.5450, order: 7, estimatedWaitMin: 45 }
    ]
  },
  {
    id: 'route-02',
    code: 'R-02',
    name: 'Amatitlán ⇄ Villa Nueva ⇄ Mixco (San Cristóbal / Roosevelt)',
    origin: 'Amatitlán Terminal',
    destination: 'Mixco Roosevelt / Eskala',
    description: 'Enlace directo de los municipios del sur con Mixco vía Bárcenas y Boulevard San Cristóbal.',
    basePrice: 15.00,
    durationMin: 55,
    color: '#0D9488',
    schedule: '05:00 AM - 08:30 PM (Cada 15 min)',
    activeBusesCount: 2,
    stops: [
      { id: 'st-201', name: 'Terminal Central Amatitlán', municipality: 'Amatitlán', lat: 14.4880, lng: -90.6155, order: 1, estimatedWaitMin: 4 },
      { id: 'st-202', name: 'Bárcenas Centro / San José', municipality: 'Villa Nueva', lat: 14.5120, lng: -90.6350, order: 2, estimatedWaitMin: 14 },
      { id: 'st-203', name: 'San José Villa Nueva (Puente Tubac)', municipality: 'Villa Nueva', lat: 14.5380, lng: -90.6210, order: 3, estimatedWaitMin: 24 },
      { id: 'st-204', name: 'San Cristóbal Sur / Pinares', municipality: 'Mixco', lat: 14.5820, lng: -90.5850, order: 4, estimatedWaitMin: 37 },
      { id: 'st-205', name: 'Blvd. San Cristóbal Centro / Campanero', municipality: 'Mixco', lat: 14.6050, lng: -90.5790, order: 5, estimatedWaitMin: 46 },
      { id: 'st-206', name: 'Calzada Roosevelt / Eskala Mixco', municipality: 'Mixco', lat: 14.6307, lng: -90.5720, order: 6, estimatedWaitMin: 55 }
    ]
  },
  {
    id: 'route-03',
    code: 'R-03',
    name: 'Amatitlán ⇄ San Miguel Petapa (Pradera Villa Hermosa)',
    origin: 'Amatitlán Parque',
    destination: 'Villa Hermosa / Petapa',
    description: 'Conexión oriental hacia Petapa, Villa Hermosa y El Frutal evitando la congestión de la CA-9.',
    basePrice: 10.00,
    durationMin: 35,
    color: '#D97706',
    schedule: '05:15 AM - 09:00 PM (Cada 12 min)',
    activeBusesCount: 1,
    stops: [
      { id: 'st-301', name: 'Amatitlán Parque Central', municipality: 'Amatitlán', lat: 14.4880, lng: -90.6155, order: 1, estimatedWaitMin: 2 },
      { id: 'st-302', name: 'Entrada Laguna Seca / Los Arcos', municipality: 'Amatitlán / Petapa', lat: 14.4950, lng: -90.5820, order: 2, estimatedWaitMin: 10 },
      { id: 'st-303', name: 'San Miguel Petapa (Parque Central)', municipality: 'San Miguel Petapa', lat: 14.5019, lng: -90.5592, order: 3, estimatedWaitMin: 18 },
      { id: 'st-304', name: 'El Frutal (Mercado Municipal)', municipality: 'Villa Nueva / Petapa', lat: 14.5260, lng: -90.5510, order: 4, estimatedWaitMin: 27 },
      { id: 'st-305', name: 'Pradera Villa Hermosa Terminal', municipality: 'San Miguel Petapa', lat: 14.5390, lng: -90.5480, order: 5, estimatedWaitMin: 35 }
    ]
  },
  {
    id: 'route-04',
    code: 'R-04',
    name: 'Ruta Interna Amatitlán (San Antonio ⇄ Hospital ⇄ Playa El Morlón)',
    origin: 'San Antonio Amatitlán',
    destination: 'El Morlón / Playa',
    description: 'Circuito urbano para comunidades locales, Hospital Nacional y acceso turístico al Lago de Amatitlán.',
    basePrice: 5.00,
    durationMin: 25,
    color: '#10B981',
    schedule: '05:30 AM - 08:00 PM (Cada 8 min)',
    activeBusesCount: 1,
    stops: [
      { id: 'st-401', name: 'Aldea San Antonio (Cabecera)', municipality: 'Amatitlán', lat: 14.4720, lng: -90.6280, order: 1, estimatedWaitMin: 3 },
      { id: 'st-402', name: 'Parque Central & Mercado Municipal', municipality: 'Amatitlán', lat: 14.4880, lng: -90.6155, order: 2, estimatedWaitMin: 9 },
      { id: 'st-403', name: 'Hospital Nacional de Amatitlán', municipality: 'Amatitlán', lat: 14.4920, lng: -90.6190, order: 3, estimatedWaitMin: 15 },
      { id: 'st-404', name: 'Playa Pública del Lago (Malecón)', municipality: 'Amatitlán', lat: 14.4850, lng: -90.6050, order: 4, estimatedWaitMin: 20 },
      { id: 'st-405', name: 'El Morlón (Embarcadero)', municipality: 'Amatitlán', lat: 14.4960, lng: -90.5980, order: 5, estimatedWaitMin: 25 }
    ]
  }
];

export const INITIAL_DRIVERS: DriverProfile[] = [
  {
    id: 'drv-01',
    name: 'José \'Don Chepe\' Morales',
    cui: '2418 90312 0101',
    licenseNumber: 'LIC-A-884920',
    licenseType: 'Tipo A (Pesado de Pasajeros)',
    phone: '502 5412-8891',
    experienceYears: 14,
    assignedBusId: 'bus-01',
    assignedRouteId: 'route-01',
    status: 'en_servicio',
    rating: 4.9,
    todayEarnings: {
      cashCollected: 384.00,
      digitalPaid: 576.00,
      commissionRate: 0.15,
      tripsCompleted: 4
    }
  },
  {
    id: 'drv-02',
    name: 'Carlos Méndez Estrada',
    cui: '1982 45210 0101',
    licenseNumber: 'LIC-A-549012',
    licenseType: 'Tipo A (Pesado de Pasajeros)',
    phone: '502 4190-2345',
    experienceYears: 9,
    assignedBusId: 'bus-02',
    assignedRouteId: 'route-01',
    status: 'en_servicio',
    rating: 4.8,
    todayEarnings: {
      cashCollected: 312.00,
      digitalPaid: 468.00,
      commissionRate: 0.15,
      tripsCompleted: 3
    }
  },
  {
    id: 'drv-03',
    name: 'Marvin Giovanni López',
    cui: '2301 77123 0101',
    licenseNumber: 'LIC-A-332901',
    licenseType: 'Tipo A (Pesado de Pasajeros)',
    phone: '502 5901-4472',
    experienceYears: 11,
    assignedBusId: 'bus-03',
    assignedRouteId: 'route-02',
    status: 'en_servicio',
    rating: 4.7,
    todayEarnings: {
      cashCollected: 420.00,
      digitalPaid: 390.00,
      commissionRate: 0.15,
      tripsCompleted: 3
    }
  },
  {
    id: 'drv-04',
    name: 'Erick Gómez Valladares',
    cui: '2541 33901 0101',
    licenseNumber: 'LIC-A-774902',
    licenseType: 'Tipo A (Pesado de Pasajeros)',
    phone: '502 3310-9988',
    experienceYears: 7,
    assignedBusId: 'bus-04',
    assignedRouteId: 'route-02',
    status: 'en_servicio',
    rating: 4.9,
    todayEarnings: {
      cashCollected: 270.00,
      digitalPaid: 510.00,
      commissionRate: 0.15,
      tripsCompleted: 3
    }
  },
  {
    id: 'drv-05',
    name: 'Roberto Salazar Cruz',
    cui: '1899 66014 0101',
    licenseNumber: 'LIC-A-120944',
    licenseType: 'Tipo A (Pesado de Pasajeros)',
    phone: '502 4455-6677',
    experienceYears: 16,
    assignedBusId: 'bus-05',
    assignedRouteId: 'route-03',
    status: 'en_servicio',
    rating: 4.9,
    todayEarnings: {
      cashCollected: 290.00,
      digitalPaid: 310.00,
      commissionRate: 0.15,
      tripsCompleted: 4
    }
  },
  {
    id: 'drv-06',
    name: 'Wilson Arévalo Ramos',
    cui: '2678 12890 0101',
    licenseNumber: 'LIC-A-990412',
    licenseType: 'Tipo A (Pesado de Pasajeros)',
    phone: '502 5599-2211',
    experienceYears: 5,
    assignedBusId: 'bus-06',
    assignedRouteId: 'route-04',
    status: 'en_servicio',
    rating: 4.6,
    todayEarnings: {
      cashCollected: 195.00,
      digitalPaid: 140.00,
      commissionRate: 0.15,
      tripsCompleted: 5
    }
  }
];

export const INITIAL_BUSES: BusUnit[] = [
  {
    id: 'bus-01',
    unitNumber: 'U-01',
    plate: 'C-784BLP',
    model: 'Mercedes-Benz O500 Express 2024',
    capacity: 40,
    currentOccupancy: 28,
    driverId: 'drv-01',
    driverName: 'José \'Don Chepe\' Morales',
    routeId: 'route-01',
    lat: 14.5240,
    lng: -90.5900,
    speedKmH: 48,
    heading: 35,
    status: 'en_ruta',
    lastUpdate: 'Hace 10 seg',
    nextStop: 'Villa Nueva Centro (El Túnel)',
    etaNextStopMin: 4
  },
  {
    id: 'bus-02',
    unitNumber: 'U-02',
    plate: 'C-319BMK',
    model: 'Hino Blue Ribbon Transit 2023',
    capacity: 40,
    currentOccupancy: 36,
    driverId: 'drv-02',
    driverName: 'Carlos Méndez Estrada',
    routeId: 'route-01',
    lat: 14.5680,
    lng: -90.5560,
    speedKmH: 42,
    heading: 25,
    status: 'en_ruta',
    lastUpdate: 'Hace 5 seg',
    nextStop: 'Estación CENMA (Conexión Transmetro)',
    etaNextStopMin: 3
  },
  {
    id: 'bus-03',
    unitNumber: 'U-03',
    plate: 'C-902BJR',
    model: 'Marcopolo Torino G7 2024',
    capacity: 40,
    currentOccupancy: 31,
    driverId: 'drv-03',
    driverName: 'Marvin Giovanni López',
    routeId: 'route-02',
    lat: 14.5380,
    lng: -90.6210,
    speedKmH: 35,
    heading: 10,
    status: 'en_ruta',
    lastUpdate: 'Hace 12 seg',
    nextStop: 'San Cristóbal Sur / Pinares',
    etaNextStopMin: 8
  },
  {
    id: 'bus-04',
    unitNumber: 'U-04',
    plate: 'C-145BTY',
    model: 'Volkswagen Volksbus 18.280 2023',
    capacity: 40,
    currentOccupancy: 24,
    driverId: 'drv-04',
    driverName: 'Erick Gómez Valladares',
    routeId: 'route-02',
    lat: 14.6150,
    lng: -90.5750,
    speedKmH: 52,
    heading: 350,
    status: 'en_ruta',
    lastUpdate: 'Hace 8 seg',
    nextStop: 'Calzada Roosevelt / Eskala Mixco',
    etaNextStopMin: 5
  },
  {
    id: 'bus-05',
    unitNumber: 'U-05',
    plate: 'C-558BLA',
    model: 'Mercedes-Benz Sprinter Intercity 2024',
    capacity: 40,
    currentOccupancy: 19,
    driverId: 'drv-05',
    driverName: 'Roberto Salazar Cruz',
    routeId: 'route-03',
    lat: 14.5019,
    lng: -90.5592,
    speedKmH: 30,
    heading: 45,
    status: 'en_ruta',
    lastUpdate: 'Hace 15 seg',
    nextStop: 'El Frutal (Mercado)',
    etaNextStopMin: 6
  },
  {
    id: 'bus-06',
    unitNumber: 'U-06',
    plate: 'C-663BZZ',
    model: 'Hino Coaster Urbana 2023',
    capacity: 40,
    currentOccupancy: 14,
    driverId: 'drv-06',
    driverName: 'Wilson Arévalo Ramos',
    routeId: 'route-04',
    lat: 14.4880,
    lng: -90.6155,
    speedKmH: 0,
    heading: 90,
    status: 'detenido',
    lastUpdate: 'Hace 20 seg',
    nextStop: 'Hospital Nacional de Amatitlán',
    etaNextStopMin: 5
  }
];

export const INITIAL_PASSENGERS: PassengerProfile[] = [
  {
    id: 'pass-01',
    cui: '3001 45892 0101',
    fullName: 'Ana Lucía Morales Castillo',
    email: 'ana.morales@miumg.edu.gt',
    phone: '502 4589-1122',
    isMinor: false,
    pncStatus: 'clean',
    pncCheckDate: '2026-10-04 09:15',
    walletBalance: 85.00
  },
  {
    id: 'pass-02',
    cui: '2845 10923 0101',
    fullName: 'Brayan Estuardo Pérez',
    email: 'brayan.perez99@gmail.com',
    phone: '502 5123-9944',
    isMinor: false,
    pncStatus: 'clean',
    pncCheckDate: '2026-10-01 14:20',
    walletBalance: 40.00
  },
  {
    id: 'pass-03',
    cui: '3200 88124 0101',
    fullName: 'Mateo Alejandro Ruiz (Menor)',
    email: 'tutor.ruiz@hotmail.com',
    phone: '502 4012-3344',
    isMinor: true,
    guardianName: 'Silvia Leticia Ruiz Coronado',
    guardianCui: '1987 55431 0101',
    pncStatus: 'clean',
    pncCheckDate: '2026-10-03 11:00',
    walletBalance: 120.00
  }
];

export const INITIAL_BOOKINGS: BookingTicket[] = [
  {
    id: 'TKT-GT-901',
    passengerId: 'pass-01',
    passengerName: 'Ana Lucía Morales Castillo',
    passengerCui: '3001 45892 0101',
    routeId: 'route-01',
    routeName: 'Amatitlán ⇄ Cd. Guatemala (CENMA)',
    busUnit: 'U-01',
    driverName: 'José \'Don Chepe\' Morales',
    seatNumber: 14,
    boardingStopId: 'st-101',
    boardingStopName: 'Terminal Amatitlán (Parque Central)',
    destinationStopId: 'st-106',
    destinationStopName: 'Estación CENMA (Conexión Transmetro)',
    price: 12.00,
    paymentMethod: 'tarjeta',
    paymentStatus: 'pagado',
    qrToken: 'RTB-GT-2026-A14-U01-CENMA',
    departureTime: 'Hoy 07:15 AM',
    bookingDate: '2026-10-05',
    status: 'valido'
  },
  {
    id: 'TKT-GT-902',
    passengerId: 'pass-02',
    passengerName: 'Brayan Estuardo Pérez',
    passengerCui: '2845 10923 0101',
    routeId: 'route-01',
    routeName: 'Amatitlán ⇄ Cd. Guatemala (CENMA)',
    busUnit: 'U-01',
    driverName: 'José \'Don Chepe\' Morales',
    seatNumber: 15,
    boardingStopId: 'st-103',
    boardingStopName: 'Paso Desnivel Cataluña / Metrocentro',
    destinationStopId: 'st-107',
    destinationStopName: 'Aguilar Batres 29 Calle (Entrada USAC)',
    price: 12.00,
    paymentMethod: 'efectivo',
    paymentStatus: 'pendiente_efectivo',
    qrToken: 'RTB-GT-2026-B15-U01-USAC',
    departureTime: 'Hoy 07:30 AM',
    bookingDate: '2026-10-05',
    status: 'valido'
  },
  {
    id: 'TKT-GT-903',
    passengerId: 'pass-03',
    passengerName: 'Mateo Alejandro Ruiz (Menor)',
    passengerCui: '3200 88124 0101',
    routeId: 'route-01',
    routeName: 'Amatitlán ⇄ Cd. Guatemala (CENMA)',
    busUnit: 'U-01',
    driverName: 'José \'Don Chepe\' Morales',
    seatNumber: 16,
    boardingStopId: 'st-101',
    boardingStopName: 'Terminal Amatitlán (Parque Central)',
    destinationStopId: 'st-105',
    destinationStopName: 'Castañas / Monte María (Km 13.5)',
    price: 12.00,
    paymentMethod: 'banco',
    paymentStatus: 'pagado',
    qrToken: 'RTB-GT-2026-C16-U01-CAST',
    departureTime: 'Hoy 07:15 AM',
    bookingDate: '2026-10-05',
    status: 'a_bordo'
  },
  {
    id: 'TKT-GT-880',
    passengerId: 'pass-01',
    passengerName: 'Ana Lucía Morales Castillo',
    passengerCui: '3001 45892 0101',
    routeId: 'route-01',
    routeName: 'Amatitlán ⇄ Cd. Guatemala (CENMA)',
    busUnit: 'U-02',
    driverName: 'Carlos Méndez Estrada',
    seatNumber: 8,
    boardingStopId: 'st-101',
    boardingStopName: 'Terminal Amatitlán (Parque Central)',
    destinationStopId: 'st-106',
    destinationStopName: 'Estación CENMA (Conexión Transmetro)',
    price: 12.00,
    paymentMethod: 'tarjeta',
    paymentStatus: 'pagado',
    qrToken: 'RTB-GT-2026-OLD-0880',
    departureTime: 'Ayer 06:30 AM',
    bookingDate: '2026-10-04',
    status: 'utilizado'
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-01',
    busId: 'bus-01',
    busUnit: 'U-01',
    driverName: 'José \'Don Chepe\' Morales',
    routeId: 'route-01',
    type: 'trafico',
    location: 'Km 14.5 CA-9 Sur (Cuesta de Villalobos)',
    description: 'Tráfico pesado en subida a Villalobos por camión averiado en carril derecho. Demora estimada +12 min.',
    timestamp: 'Hoy 07:10 AM',
    resolved: false,
    severity: 'media'
  }
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-01',
    title: 'Tu bus U-01 está cerca',
    message: 'El bus se encuentra en Paso Desnivel Cataluña. Llega a tu parada en aprox. 4 minutos.',
    type: 'info',
    timestamp: 'Hace 3 min',
    read: false,
    busId: 'bus-01',
    routeId: 'route-01'
  },
  {
    id: 'alt-02',
    title: 'Alerta de Tráfico CA-9',
    message: 'Reporte de congestión alta en subida de Villalobos hacia CENMA.',
    type: 'warning',
    timestamp: 'Hace 15 min',
    read: false,
    routeId: 'route-01'
  },
  {
    id: 'alt-03',
    title: 'Pago Confirmado',
    message: 'Boleto QR emitido exitosamente para asiento #14.',
    type: 'success',
    timestamp: 'Hace 25 min',
    read: true
  }
];
