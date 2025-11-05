import { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import logoImage from '@/images/logoblanco.png';

export const Home: FunctionalComponent<{ path?: string }> = () => {
  const { isAuthenticated, user } = useAuth();

  // --- 1. VISTA AUTENTICADA (DASHBOARD) ---
  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="text-center p-12 bg-gray-800 rounded-xl shadow-lg border border-gray-700 max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-2">👋 Bienvenido</h1>
          <p className="text-2xl text-rojo-moderna font-semibold">
            {user?.name}
          </p>
        </div>
      </div>
    );
  }

  // --- 2. VISTA PÚBLICA (LANDING PAGE) ---
  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Navbar Pequeña */}
      <nav className="flex justify-between items-center p-4 px-8 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Logo rojo para fondo blanco */}
          {/* <img src={logoRojoImage} alt="Moderna Alimentos" className="h-10" /> */}
          <span className="text-lg font-bold text-gray-800">Moderna Alimentos S.A.</span>
        </div>
        <Button
          onClick={() => route('/login')}
          className="bg-rojo-moderna text-white hover:bg-rojo-moderna-dark"
        >
          Iniciar Sesión
        </Button>
      </nav>

      <div className="container mx-auto max-w-6xl p-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-rojo-moderna to-rojo-moderna-dark text-white p-12 text-center rounded-xl shadow-lg mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Bienvenidos a Moderna Alimentos S.A.
          </h1>
          <p className="text-xl opacity-90">
            Innovación, calidad y sabor ecuatoriano desde 1909
          </p>
        </section>

        {/* Grid de Secciones */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <InfoCard
            icon="🏢"
            title="Sobre Nosotros"
            description="Moderna Alimentos S.A. es una de las principales empresas ecuatorianas en la industria alimentaria, dedicada a la producción y comercialización de alimentos de alta calidad."
          />
          <InfoCard
            icon="🎯"
            title="Nuestra Misión"
            description="Brindar productos alimenticios que contribuyan al bienestar y nutrición de las familias ecuatorianas, impulsando la innovación y sostenibilidad."
          />
          <InfoCard
            icon="⭐"
            title="Compromiso"
            description="Garantizamos estándares de producción certificados bajo normas internacionales de inocuidad y sostenibilidad, con responsabilidad social y ambiental."
          />
        </div>

        {/* Sección de Valores */}
        <section className="bg-gray-100 p-12 rounded-xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Nuestros Valores</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <ValueCard icon="🌱" title="Sostenibilidad" desc="Comprometidos con el medio ambiente" />
            <ValueCard icon="🤝" title="Responsabilidad" desc="Social y empresarial" />
            <ValueCard icon="💡" title="Innovación" desc="Constante evolución tecnológica" />
            <ValueCard icon="❤️" title="Calidad" desc="Estándares internacionales" />
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Sub-componentes de la Landing Page ---

const InfoCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h2>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <div className="text-center bg-white p-6 rounded-lg shadow">
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);