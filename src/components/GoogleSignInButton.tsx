import React, { useEffect, useRef } from 'react';
import { googleAuthService } from '../services/googleAuth';

interface GoogleSignInButtonProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  onSuccess, 
  onError, 
  disabled = false 
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const initializeButton = async () => {
      try {
        await googleAuthService.initialize();
        
        if (buttonRef.current && !disabled) {
          googleAuthService.renderButton('google-signin-custom');
        }
      } catch (error) {
        console.error('Failed to initialize Google Sign-In button:', error);
        onError('Failed to load Google Sign-In');
      }
    };

    initializeButton();

    // Listen for Google auth events
    const handleSuccess = (event: any) => {
      setIsLoading(false);
      onSuccess(event.detail);
    };

    const handleError = (event: any) => {
      setIsLoading(false);
      onError(event.detail);
    };

    window.addEventListener('googleSignInSuccess', handleSuccess);
    window.addEventListener('googleSignInError', handleError);

    return () => {
      window.removeEventListener('googleSignInSuccess', handleSuccess);
      window.removeEventListener('googleSignInError', handleError);
    };
  }, [onSuccess, onError, disabled]);

  const handleManualSignIn = () => {
    if (disabled) return;
    
    setIsLoading(true);
    googleAuthService.promptSignIn();
  };

  if (disabled) {
    return (
      <div className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed">
        <div className="w-5 h-5 bg-gray-400 rounded"></div>
        <span className="text-sm font-medium text-gray-500">Google</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        id="google-signin-custom" 
        ref={buttonRef}
        className="w-full"
      >
        {/* Fallback button if Google button doesn't render */}
        <button
          onClick={handleManualSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="w-5 h-5 bg-blue-600 rounded"></div>
          )}
          <span className="text-sm font-medium text-gray-700">
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default GoogleSignInButton;