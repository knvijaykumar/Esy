import { StaffUser } from '../types';

export interface RegisteredStaffUser {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  centreName: string;
  centreType: string;
  districtId: string;
  talukId: string;
  role: 'Center Manager' | 'Verification Officer' | 'Admin';
  registeredAt: string;
}

const REGISTERED_STAFF_STORAGE_KEY = 'esyfarm_registered_staff_users';
const LAST_REGISTERED_EMAIL_KEY = 'esyfarm_last_registered_staff_email';
const STAFF_SESSION_KEY = 'esyfarm_staff_session';

class StaffAuthService {
  /**
   * Retrieve all registered staff/centre accounts from storage
   */
  getRegisteredStaff(): RegisteredStaffUser[] {
    try {
      const data = localStorage.getItem(REGISTERED_STAFF_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Register a new procurement centre staff user
   */
  registerStaff(data: {
    name: string;
    email: string;
    password: string;
    mobile: string;
    centreName: string;
    centreType?: string;
    districtId?: string;
    talukId?: string;
    role?: 'Center Manager' | 'Verification Officer' | 'Admin';
  }): { success: boolean; user?: RegisteredStaffUser; errorMessage?: string } {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = this.getRegisteredStaff();

    // Check if email is already registered
    const duplicate = existing.find((u) => u.email.toLowerCase() === cleanEmail);
    if (duplicate) {
      return {
        success: false,
        errorMessage: 'A procurement centre is already registered with this official email. Please log in.',
      };
    }

    const newUser: RegisteredStaffUser = {
      id: `stf-reg-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password.trim(),
      mobile: data.mobile.trim(),
      centreName: data.centreName.trim(),
      centreType: data.centreType || 'APMC Market Yard',
      districtId: data.districtId || '',
      talukId: data.talukId || '',
      role: data.role || 'Center Manager',
      registeredAt: new Date().toISOString(),
    };

    existing.push(newUser);
    try {
      localStorage.setItem(REGISTERED_STAFF_STORAGE_KEY, JSON.stringify(existing));
      localStorage.setItem(LAST_REGISTERED_EMAIL_KEY, cleanEmail);
    } catch {
      // ignore
    }

    return { success: true, user: newUser };
  }

  /**
   * Attempt staff login with email & password
   */
  login(
    emailInput: string,
    passwordInput: string
  ): { success: boolean; user?: StaffUser; errorMessage?: string } {
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    if (!cleanEmail || !cleanPassword) {
      return {
        success: false,
        errorMessage: 'Please enter both your registered official email and password.',
      };
    }

    const registeredUsers = this.getRegisteredStaff();

    // Find registered user by email
    const matched = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return {
        success: false,
        errorMessage:
          'This email is not registered. Only registered procurement centre users can log in. Please register your centre first.',
      };
    }

    // Verify password
    if (matched.password && matched.password !== cleanPassword) {
      return {
        success: false,
        errorMessage: 'Incorrect password. Please enter the password created during registration.',
      };
    }

    const staffUser: StaffUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: matched.role || 'Center Manager',
      center_name: matched.centreName || 'Procurement Centre',
    };

    try {
      sessionStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(staffUser));
    } catch {
      // ignore
    }

    return { success: true, user: staffUser };
  }

  /**
   * Get the email of the most recently registered centre (for smooth login transition)
   */
  getLastRegisteredEmail(): string {
    try {
      return localStorage.getItem(LAST_REGISTERED_EMAIL_KEY) || '';
    } catch {
      return '';
    }
  }

  /**
   * Clear active staff session
   */
  logout(): void {
    try {
      sessionStorage.removeItem(STAFF_SESSION_KEY);
    } catch {
      // ignore
    }
  }

  /**
   * Get active staff session
   */
  getSession(): StaffUser | null {
    try {
      const data = sessionStorage.getItem(STAFF_SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}

export const staffAuthService = new StaffAuthService();
