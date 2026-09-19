import { Farmer, AuthSession } from '../types';
import { mockService } from './mockService';

const SESSION_STORAGE_KEY = 'sih_farmer_session';

class AuthService {
  /**
   * Helper: Mask mobile number to +91 XXXXXXX432 (never expose full number)
   */
  private maskMobile(mobile: string): string {
    const clean = mobile.replace(/\D/g, '');
    const last3 = clean.slice(-3) || '432';
    return `+91 XXXXXXX${last3}`;
  }

  /**
   * Login with Mobile Number
   * Currently directly logs in without OTP for development purposes.
   */
  async loginWithMobile(mobile: string): Promise<{ success: boolean; farmer?: Farmer; errorMessage?: string }> {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const farmer = mockService.loginWithMobile(mobile);
    if (!farmer) {
      return {
        success: false,
        errorMessage: 'Mobile number not registered. Please register first.',
      };
    }

    this.setSession(farmer);
    return {
      success: true,
      farmer,
    };
  }

  /**
   * Authenticated Session Management
   */
  setSession(farmer: Farmer): AuthSession {
    const session: AuthSession = {
      token: `sih_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      farmer,
      authenticatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Fallback in case storage is restricted
    }

    return session;
  }

  getSession(): AuthSession | null {
    try {
      const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!data) return null;
      const parsed: AuthSession = JSON.parse(data);
      if (new Date(parsed.expiresAt).getTime() < Date.now()) {
        this.logout();
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  logout(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      mockService.setCurrentFarmer(null as unknown as Farmer);
    } catch {
      // ignore
    }
  }
}

export const authService = new AuthService();
