import React, { useEffect, useState } from 'react';
import { AppRouter } from './routing/AppRouter';
import { initWebVitals } from './services/performanceMonitor';
import { engagementApi } from './services/api';
import { ConsentBanner } from './components/ui/ConsentBanner';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { syncProgressToServer } from './services/progressSync';

export default function App() {
  const [consentGiven, setConsentGiven] = useState<boolean>(() => {
    return localStorage.getItem('tracking_consent') === 'true';
  });
  const [showBanner, setShowBanner] = useState(() => !localStorage.getItem('tracking_consent'));

  // Initialize Web Vitals once consent is given
  useEffect(() => {
    if (!consentGiven) return;

    initWebVitals((vital) => {
      engagementApi.submitBatch([{
        eventType: 'WEB_VITAL',
        pageId: window.location.pathname,
        timestamp: Date.now(),
        metadata: { name: vital.name, value: vital.value, rating: vital.rating },
      }], 'perf-session').catch(() => { });
    });
  }, [consentGiven]);

  // Sync localStorage progress to server on load
  useEffect(() => {
    syncProgressToServer().catch(() => { });
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('tracking_consent', String(accepted));
    setConsentGiven(accepted);
    setShowBanner(false);
  };

  return (
    <ErrorBoundary>
      <AppRouter />
      {showBanner && (
        <ConsentBanner onAccept={() => handleConsent(true)} onDecline={() => handleConsent(false)} />
      )}
    </ErrorBoundary>
  );
}
