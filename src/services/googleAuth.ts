interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

class GoogleAuthService {
  private clientId = '1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com'; // Demo client ID
  private isInitialized = false;

  // Initialize Google Sign-In
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isInitialized) {
        resolve();
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Initialize Google Identity Services
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true
          });
          this.isInitialized = true;
          resolve();
        } else {
          reject(new Error('Google Identity Services failed to load'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };

      document.head.appendChild(script);
    });
  }

  // Handle Google credential response
  private handleCredentialResponse(response: GoogleAuthResponse): void {
    try {
      // Decode JWT token (in production, verify on server)
      const payload = this.parseJWT(response.credential);
      const googleUser: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name
      };

      // Store user data and trigger login
      this.handleGoogleLogin(googleUser);
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
      this.triggerError('Failed to process Google sign-in');
    }
  }

  // Parse JWT token (client-side only for demo)
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // Handle Google login
  private handleGoogleLogin(googleUser: GoogleUser): void {
    // Check if user exists in local storage
    const existingUsers = JSON.parse(localStorage.getItem('financebank_users') || '[]');
    let user = existingUsers.find((u: any) => u.email === googleUser.email);

    if (!user) {
      // Create new user from Google data
      user = {
        email: googleUser.email,
        password: 'google_auth', // Special marker for Google auth
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        phone: '', // Will be filled later if needed
        googleId: googleUser.id,
        picture: googleUser.picture,
        authMethod: 'google'
      };

      existingUsers.push(user);
      localStorage.setItem('financebank_users', JSON.stringify(existingUsers));
    } else {
      // Update existing user with Google data
      user.googleId = googleUser.id;
      user.picture = googleUser.picture;
      user.authMethod = 'google';
      localStorage.setItem('financebank_users', JSON.stringify(existingUsers));
    }

    // Trigger successful login
    this.triggerSuccess(user);
  }

  // Trigger success event
  private triggerSuccess(user: any): void {
    window.dispatchEvent(new CustomEvent('googleSignInSuccess', { detail: user }));
  }

  // Trigger error event
  private triggerError(message: string): void {
    window.dispatchEvent(new CustomEvent('googleSignInError', { detail: message }));
  }

  // Render Google Sign-In button
  renderButton(elementId: string): void {
    if (!this.isInitialized || !window.google) {
      console.error('Google Identity Services not initialized');
      return;
    }

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      }
    );
  }

  // Sign out
  async signOut(): Promise<void> {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    // Clear local session
    localStorage.removeItem('financebank_current_user');
  }

  // Prompt for Google account selection
  promptSignIn(): void {
    if (!this.isInitialized || !window.google) {
      console.error('Google Identity Services not initialized');
      return;
    }

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback to renderButton if prompt fails
        console.log('Google One Tap not available, using button');
      }
    });
  }
}

// Global type declarations
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export const googleAuthService = new GoogleAuthService();