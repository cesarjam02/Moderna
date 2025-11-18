import { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import logoBlanco from '@/images/logoblanco.png';
import logoRojo from '@/images/logored.jpeg';

export const Home: FunctionalComponent<{ path?: string }> = () => {
  const { isAuthenticated, user } = useAuth();

  // --- 1. VISTA AUTENTICADA (DASHBOARD) ---
  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-full p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center p-12 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 max-w-2xl w-full">
          <div className="mb-6 flex justify-center">
            <img
              src={logoBlanco}
              alt="Moderna Alimentos"
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">👋 Bienvenido</h1>
          <p className="text-3xl text-rojo-moderna font-semibold mb-6">
            {user?.name}
          </p>
          <p className="text-gray-300 text-lg mb-8">
            Sistema de Gestión de Permisos de Trabajo
          </p>
          <Button
            onClick={() => route('/permisos')}
            className="bg-rojo-moderna text-white hover:bg-rojo-moderna-dark px-8 py-3 text-lg"
          >
            Ver Permisos de Trabajo
          </Button>
        </div>
      </div>
    );
  }

  // --- 2. VISTA PÚBLICA (LANDING PAGE) ---
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 px-8 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img
            src={logoRojo}
            alt="Moderna Alimentos"
            className="h-12 w-auto object-contain"
          />
          <span className="text-xl font-bold text-gray-800">Moderna Alimentos S.A.</span>
        </div>
        <Button
          onClick={() => route('/login')}
          className="bg-rojo-moderna text-white hover:bg-rojo-moderna-dark px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Iniciar Sesión
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rojo-moderna via-red-600 to-rojo-moderna-dark text-white py-20 px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Sistema de Gestión de<br />
                <span className="text-yellow-300">Permisos de Trabajo</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-95 leading-relaxed">
                Moderna Alimentos S.A.
              </p>
              <p className="text-lg mb-10 opacity-90 max-w-2xl">
                Plataforma digital para la gestión segura y eficiente de permisos de trabajo, 
                garantizando el cumplimiento de normas de seguridad industrial y protección de nuestros trabajadores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  onClick={() => route('/login')}
                  className="bg-white text-rojo-moderna hover:bg-gray-100 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  Acceder al Sistema
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl transform rotate-6"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-2xl">
                  <img
                    src={logoBlanco}
                    alt="Moderna Alimentos Logo"
                    className="h-48 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gestión Integral de Permisos de Trabajo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sistema completo para la administración, seguimiento y control de permisos de trabajo 
              en las instalaciones de Moderna Alimentos S.A.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon="📋"
              title="Creación de Permisos"
              description="Formulario completo para crear permisos de trabajo con toda la información necesaria: fechas, áreas, tipos de trabajo, personal autorizado y análisis de trabajo seguro (ATS)."
              color="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon="✅"
              title="Flujo de Aprobaciones"
              description="Sistema de aprobaciones digitales con firma electrónica. Cadena de aprobación que incluye solicitante, trabajador, HSEQ, área, médica e inspector según corresponda."
              color="from-green-500 to-green-600"
            />
            <FeatureCard
              icon="📊"
              title="Seguimiento y Control"
              description="Visualización del estado de cada permiso en tiempo real. Monitoreo de firmas pendientes, permisos activos y cierre de trabajos con observaciones."
              color="from-purple-500 to-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Beneficios del Sistema
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard
              icon="⚡"
              title="Rapidez"
              desc="Procesos digitales que agilizan la gestión de permisos"
            />
            <BenefitCard
              icon="🔒"
              title="Seguridad"
              desc="Cumplimiento estricto de normas de seguridad industrial"
            />
            <BenefitCard
              icon="📱"
              title="Accesibilidad"
              desc="Acceso desde cualquier dispositivo con conexión a internet"
            />
            <BenefitCard
              icon="📈"
              title="Trazabilidad"
              desc="Registro completo del historial de cada permiso"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-rojo-moderna to-rojo-moderna-dark text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-10 opacity-95">
            Accede al sistema y gestiona los permisos de trabajo de forma eficiente y segura
          </p>
          <Button
            onClick={() => route('/login')}
            className="bg-white text-rojo-moderna hover:bg-gray-100 px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Iniciar Sesión
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-8">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-6">
            <img
              src={logoBlanco}
              alt="Moderna Alimentos"
              className="h-12 w-auto object-contain mx-auto mb-4"
            />
            <p className="text-lg font-semibold text-white">Moderna Alimentos S.A.</p>
          </div>
          <p className="text-sm">
            Sistema de Gestión de Permisos de Trabajo © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-componentes ---

const FeatureCard = ({ icon, title, description, color }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${color} text-white text-3xl mb-6 shadow-lg`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const BenefitCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);