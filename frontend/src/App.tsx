import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ChatAssistant } from './components/common/ChatAssistant';

// Farmer Pages
import { LandingPage } from './pages/LandingPage';
import { FarmerLoginPage } from './pages/farmer/FarmerLoginPage';
import { FarmerRegistrationPage } from './pages/farmer/FarmerRegistrationPage';
import { FarmerDashboardPage } from './pages/farmer/FarmerDashboardPage';
import { FarmerProfilePage } from './pages/farmer/FarmerProfilePage';
import { FindCenterPage } from './pages/farmer/FindCenterPage';
import { BookingPage } from './pages/farmer/BookingPage';
import { BookingConfirmationPage } from './pages/farmer/BookingConfirmationPage';
import { DigitalTokenPage } from './pages/farmer/DigitalTokenPage';
import { TrackStatusPage } from './pages/farmer/TrackStatusPage';
import { BookingHistoryPage } from './pages/farmer/BookingHistoryPage';
import { CropAssessmentPage } from './pages/farmer/CropAssessmentPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Staff Pages
import { StaffLoginPage } from './pages/staff/StaffLoginPage';
import { ProcurementCenterRegistrationPage } from './pages/staff/ProcurementCenterRegistrationPage';
import { StaffDashboardPage } from './pages/staff/StaffDashboardPage';
import { FarmerRecordsPage } from './pages/staff/FarmerRecordsPage';
import { ProcurementCentresPage } from './pages/staff/ProcurementCentresPage';
import { SlotManagementPage } from './pages/staff/SlotManagementPage';
import { TokenManagementPage } from './pages/staff/TokenManagementPage';
import { ProcurementRecordsPage } from './pages/staff/ProcurementRecordsPage';
import { ReportsPage } from './pages/staff/ReportsPage';
import { SettingsPage } from './pages/staff/SettingsPage';

// Mock Services, Auth, and Types
import { mockService } from './services/mockService';
import { authService } from './services/authService';
import { Farmer, StaffUser, Booking, ProcurementCenter } from './types';
import { MOCK_STAFF_USER, MOCK_FARMERS } from './data/mockData';

export interface RouteMapping {
  id: string;
  path: string;
  role: 'farmer' | 'staff' | 'landing';
  isProtected?: boolean;
}

export const ROUTE_CONFIG: RouteMapping[] = [
  { id: 'landing', path: '/', role: 'landing' },
  { id: 'farmer-login', path: '/farmer/login', role: 'farmer' },
  { id: 'farmer-register', path: '/farmer/register', role: 'farmer' },
  { id: 'farmer-dashboard', path: '/farmer/dashboard', role: 'farmer', isProtected: true },
  { id: 'crop-assessment', path: '/farmer/quick-crop-assessment', role: 'farmer', isProtected: true },
  { id: 'book-slot', path: '/farmer/book-slot', role: 'farmer', isProtected: true },
  { id: 'my-token', path: '/farmer/token', role: 'farmer', isProtected: true },
  { id: 'track-status', path: '/farmer/procurement-status', role: 'farmer', isProtected: true },
  { id: 'find-center', path: '/farmer/find-center', role: 'farmer' },
  { id: 'my-profile', path: '/farmer/profile', role: 'farmer', isProtected: true },
  { id: 'booking-confirmation', path: '/farmer/booking-confirmation', role: 'farmer', isProtected: true },
  { id: 'booking-history', path: '/farmer/booking-history', role: 'farmer', isProtected: true },

  { id: 'staff-login', path: '/staff/login', role: 'staff' },
  { id: 'staff-register-center', path: '/staff/register-center', role: 'staff' },
  { id: 'staff-dashboard', path: '/staff/dashboard', role: 'staff' },
  { id: 'farmer-records', path: '/staff/farmer-records', role: 'staff' },
  { id: 'procurement-centers', path: '/staff/procurement-centers', role: 'staff' },
  { id: 'slot-management', path: '/staff/slot-management', role: 'staff' },
  { id: 'token-management', path: '/staff/token-management', role: 'staff' },
  { id: 'procurement-records', path: '/staff/procurement-records', role: 'staff' },
  { id: 'staff-reports', path: '/staff/reports', role: 'staff' },
  { id: 'staff-settings', path: '/staff/settings', role: 'staff' },
];

const PATH_ALIASES: Record<string, string> = {
  '/farmer/crop-assessment': '/farmer/quick-crop-assessment',
  '/farmer/my-token': '/farmer/token',
  '/farmer/track-status': '/farmer/procurement-status',
  '/farmer/my-profile': '/farmer/profile',
  '/farmer/farmer-dashboard': '/farmer/dashboard',
  '/staff/staff-reports': '/staff/reports',
  '/staff/staff-settings': '/staff/settings',
};

export function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Normalize current pathname and resolve aliases
  const rawPathname =
    location.pathname.length > 1 && location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1)
      : location.pathname;

  const pathname = PATH_ALIASES[rawPathname] || rawPathname;
  const matchedRoute = ROUTE_CONFIG.find((r) => r.path === pathname);
  const isNotFound = !matchedRoute;

  // Active route ID for Header active tab styling & component routing
  const activeRoute = matchedRoute ? matchedRoute.id : 'not-found';
  const currentRole: 'farmer' | 'staff' | 'landing' = matchedRoute
    ? matchedRoute.role
    : pathname.startsWith('/staff')
    ? 'staff'
    : pathname.startsWith('/farmer')
    ? 'farmer'
    : 'landing';

  // Active Session Entities
  const [farmer, setFarmer] = useState<Farmer | null>(() => {
    const session = authService.getSession();
    if (session) return session.farmer;
    return mockService.getCurrentFarmer();
  });
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);

  // Flow State
  const [selectedCenterForBooking, setSelectedCenterForBooking] = useState<ProcurementCenter | undefined>();
  const [selectedCropIdForBooking, setSelectedCropIdForBooking] = useState<string | undefined>();
  const [activeBooking, setActiveBooking] = useState<Booking | undefined>(() => {
    const session = authService.getSession();
    const current = session?.farmer || mockService.getCurrentFarmer();
    if (current) {
      return mockService.getLatestBookingForFarmer(current.id, current.mobile);
    }
    return undefined;
  });
  const [trackingTokenNumber, setTrackingTokenNumber] = useState<string>(() => {
    const session = authService.getSession();
    const current = session?.farmer || mockService.getCurrentFarmer();
    if (current) {
      const b = mockService.getLatestBookingForFarmer(current.id, current.mobile);
      return b?.token_number || '';
    }
    return '';
  });

  // Automatically update farmer-specific active booking whenever active farmer changes (login/logout/register)
  useEffect(() => {
    if (farmer) {
      const latest = mockService.getLatestBookingForFarmer(farmer.id, farmer.mobile);
      setActiveBooking(latest);
      setTrackingTokenNumber(latest?.token_number || '');
    } else {
      setActiveBooking(undefined);
      setTrackingTokenNumber('');
    }
  }, [farmer]);

  // Enforce route protection if unauthenticated user attempts to access protected routes directly
  useEffect(() => {
    if (matchedRoute?.isProtected && !farmer) {
      navigate('/farmer/login', { replace: true });
    } else if (
      matchedRoute?.role === 'staff' &&
      matchedRoute?.id !== 'staff-login' &&
      matchedRoute?.id !== 'staff-register-center' &&
      !staffUser
    ) {
      navigate('/staff/login', { replace: true });
    }
  }, [matchedRoute, farmer, staffUser, navigate]);

  // Unified Navigation Handler (accepts either route ID or URL path)
  const handleNavigate = (target: string) => {
    let targetPath = target;
    const byId = ROUTE_CONFIG.find((r) => r.id === target);
    if (byId) {
      targetPath = byId.path;
    } else if (PATH_ALIASES[target]) {
      targetPath = PATH_ALIASES[target];
    }

    const targetRoute = ROUTE_CONFIG.find((r) => r.path === targetPath);

    // Route protection: redirect to login if farmer route is protected and unauthenticated
    if (targetRoute?.isProtected && !farmer) {
      navigate('/farmer/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Route protection: redirect to staff login if staff route requires authentication
    if (
      targetRoute?.role === 'staff' &&
      targetRoute?.id !== 'staff-login' &&
      targetRoute?.id !== 'staff-register-center' &&
      !staffUser
    ) {
      navigate('/staff/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Role Switcher
  const handleRoleSwitch = (role: 'farmer' | 'staff' | 'landing') => {
    if (role === 'landing') {
      handleNavigate('/');
    } else if (role === 'farmer') {
      handleNavigate(farmer ? '/farmer/dashboard' : '/farmer/login');
    } else if (role === 'staff') {
      handleNavigate(staffUser ? '/staff/dashboard' : '/staff/login');
    }
  };

  // Farmer Flow Callbacks
  const handleFarmerLoginSuccess = (loggedFarmer: Farmer) => {
    authService.setSession(loggedFarmer);
    setFarmer(loggedFarmer);
    handleNavigate('/farmer/dashboard');
  };

  const handleLogout = () => {
    if (currentRole === 'staff') {
      setStaffUser(null);
      handleNavigate('/staff/login');
    } else {
      authService.logout();
      setFarmer(null);
      setActiveBooking(undefined);
      setTrackingTokenNumber('');
      handleNavigate('/farmer/login');
    }
  };

  const handleRegistrationSuccess = (newFarmer: Farmer) => {
    authService.setSession(newFarmer);
    setFarmer(newFarmer);
    setActiveBooking(undefined);
    setTrackingTokenNumber('');
    handleNavigate('/farmer/dashboard');
  };

  const handleCenterSelectedFromFind = (center: ProcurementCenter, cropId?: string) => {
    setSelectedCenterForBooking(center);
    setSelectedCropIdForBooking(cropId);
    handleNavigate('/farmer/book-slot');
  };

  const handleBookingComplete = (newBooking: Booking) => {
    setActiveBooking(newBooking);
    setTrackingTokenNumber(newBooking.token_number);
    handleNavigate('/farmer/booking-confirmation');
  };

  const handleViewToken = (tokenNumber?: string) => {
    if (tokenNumber && farmer) {
      const b = mockService.getBookingByTokenForFarmer(tokenNumber, farmer.id, farmer.mobile);
      if (b) setActiveBooking(b);
    }
    handleNavigate('/farmer/token');
  };

  const handleTrackStatus = (tokenNumber?: string) => {
    if (tokenNumber && farmer) {
      setTrackingTokenNumber(tokenNumber);
      const b = mockService.getBookingByTokenForFarmer(tokenNumber, farmer.id, farmer.mobile);
      if (b) setActiveBooking(b);
    }
    handleNavigate('/farmer/procurement-status');
  };

  const handleStaffLoginSuccess = (user: StaffUser) => {
    setStaffUser(user);
    handleNavigate('/staff/dashboard');
  };

  const activeFarmer = farmer || mockService.getCurrentFarmer() || MOCK_FARMERS[0];
  const activeStaff = staffUser || MOCK_STAFF_USER;
  const currentBooking = activeBooking || (farmer ? mockService.getLatestBookingForFarmer(farmer.id, farmer.mobile) : undefined);

  return (
    <div className="app-container">
      {/* Universal Portal Header (Hidden on Landing Page and Login Page) */}
      {activeRoute !== 'landing' && activeRoute !== 'farmer-login' && (
        <Header
          currentRole={currentRole}
          currentFarmer={farmer}
          staffUser={staffUser}
          activeTab={activeRoute}
          onNavigate={handleNavigate}
          onRoleSwitch={handleRoleSwitch}
          onLogout={handleLogout}
        />
      )}

      {/* Main Routed Content Area */}
      <main
        className={
          activeRoute === 'landing' || activeRoute === 'farmer-login' ? '' : 'main-content'
        }
        style={
          activeRoute === 'landing' || activeRoute === 'farmer-login'
            ? { flex: 1, width: '100%' }
            : {}
        }
      >
        {/* LANDING PAGE */}
        {activeRoute === 'landing' && (
          <LandingPage
            onStartFarmer={() => {
              handleNavigate(farmer ? '/farmer/dashboard' : '/farmer/login');
            }}
            onStartStaff={() => {
              handleNavigate('/staff/login');
            }}
            onGoRegistration={() => {
              handleNavigate('/farmer/login');
            }}
          />
        )}

        {/* FARMER: Login (Aadhaar OR Mobile) */}
        {activeRoute === 'farmer-login' && (
          <FarmerLoginPage
            onLoginSuccess={handleFarmerLoginSuccess}
            onGoRegister={() => {
              handleNavigate('/farmer/register');
            }}
            onGoStaff={() => {
              handleNavigate('/staff/login');
            }}
            onCancel={() => handleRoleSwitch('landing')}
          />
        )}

        {/* FARMER: Registration */}
        {activeRoute === 'farmer-register' && (
          <FarmerRegistrationPage
            onRegistrationSuccess={handleRegistrationSuccess}
            onGoLogin={() => {
              handleNavigate('/farmer/login');
            }}
            onCancel={() => handleRoleSwitch('landing')}
          />
        )}

        {/* FARMER: Dashboard */}
        {activeRoute === 'farmer-dashboard' && (
          <FarmerDashboardPage
            farmer={activeFarmer}
            latestBooking={currentBooking}
            onNavigate={handleNavigate}
          />
        )}

        {/* FARMER: Quick Crop Assessment */}
        {activeRoute === 'crop-assessment' && (
          <CropAssessmentPage
            farmer={activeFarmer}
            activeBooking={currentBooking}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('/farmer/dashboard')}
          />
        )}

        {/* FARMER: My Profile */}
        {activeRoute === 'my-profile' && (
          <FarmerProfilePage
            farmer={activeFarmer}
            onProfileUpdated={(updated) => setFarmer(updated)}
            onLogout={handleLogout}
          />
        )}

        {/* FARMER: Booking Slot Wizard (Integrated with Find Near Me) */}
        {(activeRoute === 'book-slot' || activeRoute === 'find-center') && (
          <BookingPage
            farmer={activeFarmer}
            initialCenter={selectedCenterForBooking}
            initialCropId={selectedCropIdForBooking}
            onBookingComplete={handleBookingComplete}
            onCancel={() => handleNavigate('/farmer/dashboard')}
          />
        )}

        {/* FARMER: Booking Confirmation */}
        {activeRoute === 'booking-confirmation' && (
          <BookingConfirmationPage
            booking={currentBooking}
            onViewToken={() => handleViewToken(currentBooking?.token_number)}
            onTrackStatus={() => handleTrackStatus(currentBooking?.token_number)}
            onGoHome={() => handleNavigate('/farmer/dashboard')}
          />
        )}

        {/* FARMER: Digital Token Pass */}
        {activeRoute === 'my-token' && (
          <DigitalTokenPage
            booking={currentBooking}
            onTrackStatus={handleTrackStatus}
            onBackToDashboard={() => handleNavigate('/farmer/dashboard')}
          />
        )}

        {/* FARMER: Track Procurement Status Timeline */}
        {activeRoute === 'track-status' && (
          <TrackStatusPage
            farmer={activeFarmer}
            initialTokenNumber={trackingTokenNumber}
            onViewToken={handleViewToken}
          />
        )}

        {/* FARMER: Booking History */}
        {activeRoute === 'booking-history' && (
          <BookingHistoryPage
            farmer={activeFarmer}
            onViewToken={handleViewToken}
            onTrackStatus={handleTrackStatus}
            onNewBooking={() => {
              setSelectedCenterForBooking(undefined);
              setSelectedCropIdForBooking(undefined);
              handleNavigate('/farmer/book-slot');
            }}
          />
        )}

        {/* STAFF: Login */}
        {activeRoute === 'staff-login' && (
          <StaffLoginPage
            onLoginSuccess={handleStaffLoginSuccess}
            onCancel={() => handleRoleSwitch('landing')}
            onRegisterCenter={() => {
              handleNavigate('/staff/register-center');
            }}
          />
        )}

        {/* STAFF: Procurement Centre Registration */}
        {activeRoute === 'staff-register-center' && (
          <ProcurementCenterRegistrationPage
            onGoLogin={() => {
              handleNavigate('/staff/login');
            }}
            onCancel={() => handleRoleSwitch('landing')}
          />
        )}

        {/* STAFF: Dashboard */}
        {activeRoute === 'staff-dashboard' && (
          <StaffDashboardPage
            staffUser={activeStaff}
            onNavigate={handleNavigate}
          />
        )}

        {/* STAFF: Farmer Records */}
        {activeRoute === 'farmer-records' && <FarmerRecordsPage />}

        {/* STAFF: Procurement Centres Directory */}
        {activeRoute === 'procurement-centers' && <ProcurementCentresPage />}

        {/* STAFF: Slot Management */}
        {activeRoute === 'slot-management' && <SlotManagementPage />}

        {/* STAFF: Token Management */}
        {activeRoute === 'token-management' && (
          <TokenManagementPage staffUser={activeStaff} />
        )}

        {/* STAFF: Procurement Records */}
        {activeRoute === 'procurement-records' && <ProcurementRecordsPage />}

        {/* STAFF: Basic Reports */}
        {activeRoute === 'staff-reports' && <ReportsPage />}

        {/* STAFF: Settings */}
        {activeRoute === 'staff-settings' && (
          <SettingsPage staffUser={activeStaff} />
        )}

        {/* 404 NOT FOUND */}
        {isNotFound && (
          <NotFoundPage currentPath={location.pathname} onNavigate={handleNavigate} />
        )}
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Floating Farmer-friendly AI Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}

export default App;
