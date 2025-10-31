import { FunctionalComponent } from 'preact';
import { route } from 'preact-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import logoImage from '@/images/logoblanco.png';

export const Home: FunctionalComponent<{ path?: string }> = () => {
  const { isAuthenticated, user } = useAuth();

  // Si está autenticado, mostrar solo bienvenida simple
  if (isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '600px',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '0 0 1rem 0',
              color: '#ffffff',
            }}
          >
            👋 Bienvenido
          </h1>
          <p
            style={{
              fontSize: '1.5rem',
              margin: 0,
              color: '#d32f2f',
              fontWeight: '600',
            }}
          >
            {user?.name}
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar contenido completo
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100%',
        width: '100%',
      }}
    >
      {/* Navbar pequeña */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={logoImage}
            alt="Moderna Alimentos"
            style={{
              height: '40px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1a1a1a',
            }}
          >
            Moderna Alimentos S.A.
          </span>
        </div>
        <Button
          onClick={() => route('/login')}
          style={{
            padding: '0.625rem 1.5rem',
            backgroundColor: '#d32f2f',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = '#b71c1c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#d32f2f';
          }}
        >
          Iniciar Sesión
        </Button>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          color: 'white',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          borderRadius: '12px',
          marginBottom: '3rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 0 0.75rem 0',
            letterSpacing: '0.5px',
          }}
        >
          Bienvenidos a Moderna Alimentos S.A.
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            margin: 0,
            opacity: 0.95,
            fontWeight: 300,
          }}
        >
          Innovación, calidad y sabor ecuatoriano desde 1909
        </p>
      </section>

      {/* Grid de Secciones */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}
      >
        {/* Sobre Nosotros */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f0f0f0',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#d32f2f',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
            }}
          >
            🏢
          </div>
          <h2
            style={{
              color: '#1a1a1a',
              margin: '0 0 1rem 0',
              fontSize: '1.5rem',
              fontWeight: '600',
            }}
          >
            Sobre Nosotros
          </h2>
          <p
            style={{
              color: '#666',
              lineHeight: '1.7',
              margin: 0,
              fontSize: '0.95rem',
            }}
          >
            <strong style={{ color: '#d32f2f' }}>Moderna Alimentos S.A.</strong> es
            una de las principales empresas ecuatorianas en la industria alimentaria,
            dedicada a la producción y comercialización de alimentos de alta calidad.
            Con más de 100 años de historia, ha consolidado marcas líderes en el
            mercado de harinas, panadería, pastas y productos saludables.
          </p>
        </div>

        {/* Nuestra Misión */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f0f0f0',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#d32f2f',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
            }}
          >
            🎯
          </div>
          <h2
            style={{
              color: '#1a1a1a',
              margin: '0 0 1rem 0',
              fontSize: '1.5rem',
              fontWeight: '600',
            }}
          >
            Nuestra Misión
          </h2>
          <p
            style={{
              color: '#666',
              lineHeight: '1.7',
              margin: 0,
              fontSize: '0.95rem',
            }}
          >
            Brindar productos alimenticios que contribuyan al bienestar y nutrición de
            las familias ecuatorianas, impulsando la innovación, sostenibilidad y el
            desarrollo del país.
          </p>
        </div>

        {/* Compromiso con la Calidad */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f0f0f0',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#d32f2f',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              fontSize: '1.5rem',
            }}
          >
            ⭐
          </div>
          <h2
            style={{
              color: '#1a1a1a',
              margin: '0 0 1rem 0',
              fontSize: '1.5rem',
              fontWeight: '600',
            }}
          >
            Compromiso con la Calidad
          </h2>
          <p
            style={{
              color: '#666',
              lineHeight: '1.7',
              margin: 0,
              fontSize: '0.95rem',
            }}
          >
            Moderna Alimentos garantiza estándares de producción certificados bajo
            normas internacionales de inocuidad y sostenibilidad. Su enfoque está en
            ofrecer productos confiables, nutritivos y elaborados con responsabilidad
            social y ambiental.
          </p>
        </div>
      </div>

      {/* Sección de Valores */}
      <section
        style={{
          backgroundColor: '#f8f9fa',
          padding: '3rem 2rem',
          borderRadius: '12px',
          marginTop: '2rem',
        }}
      >
        <h2
          style={{
            color: '#1a1a1a',
            textAlign: 'center',
            margin: '0 0 2.5rem 0',
            fontSize: '2rem',
            fontWeight: '600',
          }}
        >
          Nuestros Valores
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { icon: '🌱', title: 'Sostenibilidad', desc: 'Comprometidos con el medio ambiente' },
            { icon: '🤝', title: 'Responsabilidad', desc: 'Social y empresarial' },
            { icon: '💡', title: 'Innovación', desc: 'Constante evolución tecnológica' },
            { icon: '❤️', title: 'Calidad', desc: 'Estándares internacionales' },
          ].map((valor) => (
            <div
              key={valor.title}
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {valor.icon}
              </div>
              <h3
                style={{
                  color: '#1a1a1a',
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                }}
              >
                {valor.title}
              </h3>
              <p
                style={{
                  color: '#666',
                  margin: 0,
                  fontSize: '0.9rem',
                }}
              >
                {valor.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
