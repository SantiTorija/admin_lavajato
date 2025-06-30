# LoginPage Component

## Descripción

El componente `LoginPage` es una pantalla de inicio de sesión completa y responsive para el panel de administración de Lavajato.

## Características

### ✅ Visuales

- **Diseño centrado**: Pantalla centrada vertical y horizontalmente en el viewport
- **Card de Bootstrap**: Estructura principal usando Card de React Bootstrap
- **Título**: "Iniciar sesión" con subtítulo descriptivo
- **Formulario completo**:
  - Input para email con validación
  - Input para contraseña con ícono de ojito para mostrar/ocultar
  - Botón de envío con estados de loading
- **Íconos SVG inline**: Para mostrar/ocultar contraseña (no requiere Bootstrap Icons)
- **Validación visual**: Mensajes de error en tiempo real
- **Diseño responsive**: Adaptable a todos los tamaños de pantalla

### ✅ Funcionales

- **Estado de autenticación**: Integrado con AuthContext
- **Redirección automática**: Si ya está logueado, redirige al dashboard
- **Validación de formulario**: Campos requeridos y formato de email
- **Manejo de errores**: Muestra errores de autenticación
- **Estados de loading**: Durante la verificación y envío del formulario
- **Navegación**: Usando React Router v6

## Uso

```jsx
import LoginPage from "./pages/LoginPage";

// En tus rutas
<Route path="/login" element={<LoginPage />} />;
```

## Dependencias

- React Bootstrap
- React Router DOM
- Context de autenticación personalizado
- Hook de servicio de autenticación

## Estructura de archivos relacionados

```
src/
├── pages/
│   └── LoginPage.jsx          # Componente principal
├── context/
│   └── AuthContext.jsx        # Contexto de autenticación
├── hooks/
│   └── useAuthService.js      # Servicio de autenticación
├── components/
│   └── ProtectedRoute.jsx     # Ruta protegida
└── routes/
    └── index.jsx              # Configuración de rutas
```

## Configuración

Para usar con tu backend, configura la variable de entorno:

```env
VITE_API_URL=http://localhost:3001
```

## Funcionalidades implementadas

1. ✅ Pantalla centrada vertical y horizontalmente
2. ✅ Card de Bootstrap como estructura principal
3. ✅ Título "Iniciar sesión"
4. ✅ Formulario con inputs para email y contraseña
5. ✅ Ícono de ojito para mostrar/ocultar contraseña
6. ✅ Validación de campos vacíos y formato de email
7. ✅ Estado `showPassword` con useState
8. ✅ Redirección automática según autenticación
9. ✅ Navegación con React Router v6
10. ✅ Diseño completamente responsive
11. ✅ Manejo de estados de loading
12. ✅ Integración con contexto de autenticación
13. ✅ Protección de rutas
14. ✅ Funcionalidad de logout
