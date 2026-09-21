'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  onError: (errorMsg: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  disabled?: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            ux_mode?: 'popup' | 'redirect';
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
            }
          ) => void;
          prompt?: (notification?: unknown) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'continue_with',
  disabled = false,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      onError('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured');
      return;
    }

    if (typeof window !== 'undefined' && window.google?.accounts?.id && containerRef.current) {
      initializeAndRender();
    }
  }, [scriptLoaded, clientId]);

  function initializeAndRender() {
    if (!window.google?.accounts?.id || !containerRef.current || !clientId) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          if (response?.credential) {
            onSuccess(response.credential);
          } else {
            onError('Google did not return an ID token credential');
          }
        },
        ux_mode: 'popup',
        auto_select: false,
      });

      // Clear previous render if any
      containerRef.current.innerHTML = '';

      const containerWidth = containerRef.current.offsetWidth || 380;
      const targetWidth = Math.min(Math.max(containerWidth, 240), 400);

      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text,
        shape: 'rectangular',
        logo_alignment: 'left',
        width: targetWidth,
      });
    } catch (err: unknown) {
      console.error('Failed to initialize Google Identity Services:', err);
      onError('Failed to initialize Google Sign-In SDK');
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true);
          initializeAndRender();
        }}
        onError={() => onError('Failed to load Google Identity Services SDK')}
      />

      <div
        ref={containerRef}
        className={`w-full flex justify-center items-center min-h-[44px] transition-opacity ${
          disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      />
    </div>
  );
}
