import { AdminView } from './components/admin-view';
import { ClientServicesView } from './components/client-services-view';
import { ClientSignupView } from './components/client-signup-view';
import { FeedView } from './components/feed-view';
import { LandingView } from './components/landing-view';
import { LoginView } from './components/login-view';
import { ProviderPanelView } from './components/provider-panel-view';
import { ProviderProfileView } from './components/provider-profile-view';
import { ResultsView } from './components/results-view';
import { SignupChoiceView } from './components/signup-choice-view';
import { TenantDashboardView } from './components/tenant-dashboard-view';
import { TenantSignupView } from './components/tenant-signup-view';
import { VerifyEmailView } from './components/verify-email-view';
import { endSessionOnHistoryNavigation } from './session/session';

// Atrás/Adelante cierran la sesión (antes de dibujar cualquier vista).
endSessionOnHistoryNavigation();

// Selección temporal de vista por URL hasta que agreguemos el enrutador:
// /feed es la pantalla principal con sesión, /resultados la búsqueda y /proveedor?id= el perfil
// de un proveedor ("Ver perfil"); /mis-servicios (cliente) y /panel (proveedor) muestran los
// servicios contratados y prestados; cualquier otra ruta, la landing.
// /registro elige el tipo de cuenta: /registro/cliente o /registro/proveedor (alta de tenant).
// /login, /mi-negocio (gestión del tenant), /verificar (enlace del correo)
// y /admin (admin de plataforma) son de la demo multi-tenant.
function App() {
  switch (window.location.pathname) {
    case '/feed':
      return <FeedView />;
    case '/resultados':
      return <ResultsView />;
    case '/proveedor':
      return <ProviderProfileView />;
    case '/mis-servicios':
      return <ClientServicesView />;
    case '/panel':
      return <ProviderPanelView />;
    case '/login':
      return <LoginView />;
    case '/registro':
      return <SignupChoiceView />;
    case '/registro/cliente':
      return <ClientSignupView />;
    case '/registro/proveedor':
      return <TenantSignupView />;
    case '/mi-negocio':
      return <TenantDashboardView />;
    case '/verificar':
      return <VerifyEmailView />;
    case '/admin':
      return <AdminView />;
    default:
      return <LandingView />;
  }
}

export default App;
