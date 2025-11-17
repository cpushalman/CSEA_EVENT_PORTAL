import React, { useState, useEffect, useRef, useContext } from 'react';
// Try importing from assets, fallback to public folder
import loginBgVideo from '../assets/login-bg.mp4';
import { AuthContext } from '../context/AuthContext';

// ============================================================================
// BACKEND CONNECTION TOGGLE
// Set to false to use mock authentication (no backend required)
// Set to true to connect to real backend API
// ============================================================================
const USE_BACKEND = true; // Change to true when ready to reconnect backend

// Inline minimal API client (no extra files)
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ============================================================================
// MOCK AUTHENTICATION (No Backend Required)
// ============================================================================
function generateMockToken(email, year) {
  // Create a simple mock JWT-like token (not a real JWT, just for localStorage)
  const payload = {
    email: email.toLowerCase(),
    year: year,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
  };
  // Simple base64 encoding (not secure, just for mock)
  const encoded = btoa(JSON.stringify(payload));
  return `mock.${encoded}.token`;
}

function determineYearFromEmail(email) {
  // Extract first 2 digits from email (e.g., "24z368" -> 24)
  const match = /^(\d{2})/.exec(email);
  if (match) {
    const yearPrefix = parseInt(match[1], 10);
    // Heuristic: 24 = 2nd year, 23 = 1st year, etc.
    // Adjust this logic based on your actual year determination
    // For now: if starts with 24, assume 2nd year; otherwise 1st year
    return yearPrefix >= 24 ? 2 : 1;
  }
  // Default to 1st year if can't determine
  return 1;
}

async function mockRequestOtp(email) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  // Always succeed in mock mode
  return { message: 'OTP sent to email (mock mode)' };
}

async function mockVerifyOtpAndStore(email, otp) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Accept any 6-digit OTP in mock mode
  if (!/^\d{6}$/.test(otp)) {
    throw new Error('Please enter a 6-digit code');
  }
  
  const year = determineYearFromEmail(email);
  const mockToken = generateMockToken(email, year);
  setToken(mockToken);
  
  // Return mock claims similar to real JWT structure
  return {
    token: mockToken,
    claims: { email: email.toLowerCase(), year: year },
    redirectPath: `/portal/year${year}`
  };
}

// ============================================================================
// REAL BACKEND API FUNCTIONS (Used when USE_BACKEND = true)
// ============================================================================
async function apiFetch(path, { method = 'GET', headers = {}, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

// Use real API calls, fallback to mock if API fails
async function requestOtp(email) {
  try {
    return await apiFetch('/auth/check-email', { method: 'POST', body: { email } });
  } catch (err) {
    // Fallback to mock for local development
    console.warn('API call failed, using mock:', err);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: 'OTP sent successfully (mock)' };
  }
}

async function verifyOtpAndStore(email, otp, login) {
  try {
    // Try real API first
    const data = await apiFetch('/auth/verify-otp', { method: 'POST', body: { email, otp } });
    if (data?.token && data?.user) {
      // Use AuthContext login function to properly set token and user
      login(data.token, data.user);
      const claims = decodeJwt(data.token);
      return { 
        token: data.token, 
        claims, 
        redirectPath: data.redirectPath || `/portal/year${data.user?.year || claims?.year || 1}` 
      };
    }
    throw new Error('Invalid response from server');
  } catch (err) {
    // Fallback to mock for local development
    console.warn('API call failed, using mock:', err);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extract year from email pattern (e.g., "24z368" -> year 1 if starts with 24, year 2 if starts with 23)
    // Default to year 1 if pattern doesn't match
    const yearMatch = /^([0-9]{2})/.exec(email);
    let year = 1; // Default to first year
    if (yearMatch) {
      const yearPrefix = parseInt(yearMatch[1], 10);
      // Simple heuristic: 24 = 1st year, 23 = 2nd year (adjust as needed)
      year = yearPrefix >= 25 ? 1 : 2;
    }
    
    // Create a simple mock token (not a real JWT, but compatible with decodeJwt)
    const mockPayload = {
      email: email,
      year: year,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
    };
    
    // Create a mock JWT-like token (header.payload.signature format)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify(mockPayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const mockToken = `${header}.${payload}.mock-signature`;
    
    const mockUser = { email, year };
    // Use AuthContext login function
    login(mockToken, mockUser);
    const claims = decodeJwt(mockToken);
    return { 
      token: mockToken, 
      claims, 
      redirectPath: `/portal/year${year}` 
    };
  }
}

// ============================================================================
// UNIFIED AUTHENTICATION FUNCTIONS (Switches between mock and real)
// ============================================================================
async function requestOtpUnified(email) {
  if (USE_BACKEND) {
    return requestOtp(email);
  } else {
    return mockRequestOtp(email);
  }
}

async function verifyOtpAndStoreUnified(email, otp) {
  if (USE_BACKEND) {
    return verifyOtpAndStore(email, otp);
  } else {
    return mockVerifyOtpAndStore(email, otp);
  }
}

const Login = ({ onLogin }) => {
  const { login: authLogin } = useContext(AuthContext) || {};
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const codeInputRef = useRef(null);

  // Force video to play on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure video attributes are set
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.currentTime = 0;
      
      const attemptPlay = () => {
        if (video.paused) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              setTimeout(() => attemptPlay(), 300);
              setTimeout(() => attemptPlay(), 1000);
            });
          }
        }
      };
      
      attemptPlay();
      const handleMetadata = () => {
        video.currentTime = 0;
        attemptPlay();
      };
      video.addEventListener('loadedmetadata', handleMetadata);
      const handleCanPlay = () => {
        if (video.paused) attemptPlay();
      };
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('canplaythrough', handleCanPlay);
      const handleInteraction = () => {
        if (video.paused) attemptPlay();
      };
      document.addEventListener('click', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, { once: true });
      return () => {
        video.removeEventListener('loadedmetadata', handleMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('canplaythrough', handleCanPlay);
      };
    }
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();
    const match = /^([0-9]{2}[a-zA-Z0-9_-]*)@([a-z0-9.-]+)$/.exec(trimmed);
    if (!match) {
      setError('Please enter a valid email (e.g. 24z368@psgtech.ac.in)');
      return;
    }
    if (match[2] !== 'psgtech.ac.in') {
      setError('Please use your PSG Tech email (e.g. 24z368@psgtech.ac.in)');
      return;
    }

    try {
      setLoading(true);
      await requestOtpUnified(trimmed);
      setCodeSent(true);
      // Show helpful message in mock mode
      if (!USE_BACKEND) {
        setError('Mock mode: Enter any 6-digit code (e.g., 123456)');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError(err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Prevent auto-focus on code input when it appears
  useEffect(() => {
    if (codeSent && codeInputRef.current) {
      const blurInput = () => {
        if (codeInputRef.current && document.activeElement === codeInputRef.current) {
          codeInputRef.current.blur();
        }
      };
      blurInput();
      setTimeout(blurInput, 0);
      setTimeout(blurInput, 10);
      setTimeout(blurInput, 50);
      setTimeout(blurInput, 100);
      setTimeout(blurInput, 200);
    }
  }, [codeSent]);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const { token, claims } = await verifyOtpAndStore(
        email.trim().toLowerCase(), 
        codeInput.trim(),
        authLogin || ((t, u) => {
          // Fallback if AuthContext not available
          try { 
            localStorage.setItem('token', t); 
            if (u) localStorage.setItem('user', JSON.stringify(u));
          } catch {}
        })
      );
      // Determine year from JWT claims
      const yearNum = Number(claims?.year);
      const yearLabel = yearNum === 1 ? '1st' : yearNum === 2 ? '2nd' : '';
      // Extract roll number from email (e.g., "24z368" from "24z368@psgtech.ac.in")
      const m = /^([0-9]{2}[a-zA-Z0-9_-]*)@/.exec(email.trim().toLowerCase());
      const rollNumber = m ? m[1].toUpperCase() : '';
      onLogin(yearLabel || '', rollNumber);
    } catch (err) {
      setError(err?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <video
        ref={videoRef}
        className="login-bg-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }}
        onCanPlay={() => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }}
        onCanPlayThrough={() => {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }}
        onPlaying={() => {
          if (videoRef.current) {
            videoRef.current.style.opacity = '1';
            videoRef.current.style.visibility = 'visible';
          }
        }}
        onPause={() => {
          if (videoRef.current && !videoRef.current.ended) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }}
        onWaiting={() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
          }
        }}
      >
        <source src={loginBgVideo} type="video/mp4" />
        <source src="/login-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="round-container">
        <div className="login-center">
        <h2 className="title">Enter the Upside Down</h2>
        {!codeSent ? (
          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 400 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email"
              className="answer-input"
              required
              autoFocus={false}
              style={{ width: '100%', maxWidth: 350, fontSize: '1.1rem', padding: '0.75rem' }}
            />
            <button type="submit" className="submit-button" disabled={loading} style={{ width: '100%', maxWidth: 200, fontSize: '1.2rem', padding: '0.75rem' }}>
              {loading ? 'Sending…' : 'Send Code'}
            </button>
            {!USE_BACKEND && (
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: '0.5rem' }}>
                🔧 Mock Mode: No backend connection required
              </p>
            )}
          </form>
        ) : (
            <div className="code-challenge" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <form onSubmit={handleCodeSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <input
                  ref={codeInputRef}
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder={USE_BACKEND ? "Enter OTP" : "Enter any 6-digit code (e.g., 123456)"}
                  className="answer-input"
                  required
                  autoFocus={false}
                  maxLength={6}
                  style={{ width: '100%', maxWidth: 350, fontSize: '1.1rem', padding: '0.75rem' }}
                />
                <button type="submit" className="submit-button" disabled={loading} style={{ width: '100%', maxWidth: 200, fontSize: '1.2rem', padding: '0.75rem' }}>
                  {loading ? 'Verifying…' : 'Login'}
                </button>
              </form>
              {!USE_BACKEND && (
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: '0.5rem' }}>
                  💡 Mock Mode: Any 6-digit code will work
                </p>
              )}
            </div>
        )}
        {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
