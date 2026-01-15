# 🔐 Sistema de Autenticación Mock - Guía de Uso

## Descripción

Se ha implementado un sistema de autenticación **mock-up** con datos de prueba que permite:
- ✅ Login con credenciales demo
- ✅ Navegación automática al dashboard tras login exitoso
- ✅ Gestión de sesión (localStorage)
- ✅ Cerrar sesión desde el dashboard

## 📝 Credenciales de Prueba

### Usuario Voluntario (Recomendado)
```
Email:    iryna_pavlenko@cuatrovientos.org
Password: password123
```

### Otros usuarios disponibles:
```
Email:    voluntario@test.com
Password: password123

Email:    entity@amabir.org
Password: password123

Email:    admin@cuatrovientos.org
Password: password123
```

**Nota:** Todos comparten la misma contraseña: `password123`

## 🏗️ Estructura de Archivos

### Archivos Creados/Modificados:

1. **`src/app/services/auth.service.ts`** (CREADO)
   - Servicio de autenticación con mock users
   - Métodos: `login()`, `logout()`, `getCurrentUser()`, `isAuthenticated()`
   - Persistencia en localStorage

2. **`src/app/features/dashboard/dashboard.ts`** (MODIFICADO)
   - Componente principal del dashboard
   - Datos mock de actividades por entidad
   - Proposiciones y otras entidades

3. **`src/app/features/dashboard/dashboard.html`** (MODIFICADO)
   - Template con header de bienvenida
   - Carouseles de actividades
   - Sección de propuestas
   - Otras entidades

4. **`src/app/features/dashboard/dashboard.scss`** (MODIFICADO)
   - Estilos completos del dashboard
   - Responsive design
   - Animaciones de gradient

5. **`src/app/features/auth/login/login.ts`** (MODIFICADO)
   - Integración con AuthService
   - Navegación al dashboard
   - Manejo de errores

6. **`src/app/features/auth/login/login.html`** (MODIFICADO)
   - Mostrar credenciales demo
   - Mensajes de error
   - Estado de loading

7. **`src/app/app.routes.ts`** (MODIFICADO)
   - Añadida ruta `/dashboard`
   - Importación de DashboardComponent

## 🚀 Cómo Probar

### 1. Instalar dependencias
```bash
cd Angular/WebVoluntariado
npm install
```

### 2. Ejecutar servidor de desarrollo
```bash
npm start
# O
npx ng serve --open
```

### 3. Ir al login
```
http://localhost:4200/login
```

### 4. Usar credenciales demo
- Email: `iryna_pavlenko@cuatrovientos.org`
- Password: `password123`

### 5. Verificar redirección
- Tras iniciar sesión exitosamente, serás redirigido a `/dashboard`
- Podrás ver tu nombre en el header
- Haz clic en "Cerrar sesión" para volver al login

## 🔄 Flujo de Autenticación

```
Login Form
    ↓
AuthService.login()
    ↓
Validación de credenciales
    ↓
Guardar token + usuario en localStorage
    ↓
Navegar a /dashboard
    ↓
DashboardComponent (verificar usuario autenticado)
    ↓
Mostrar dashboard con datos mock
```

## 📊 Datos Mock Disponibles

### Actividades por Entidad:
- **Amabir:** 3 actividades (jardín, manualidades, paseos)
- **Solera Asistencial:** 3 actividades (tareas, compañía, apoyo)

### Propuestas:
- 3 propuestas desde Cuatrovientos

### Otras Entidades:
- 3 entidades sugeridas (Cáritas, Cruz Roja, Fundación)

## 🔐 Seguridad (Notas para Producción)

⚠️ **Esto es un mock para desarrollo. En producción:**

1. **Reemplazar mock users** con llamadas reales a API
2. **JWT tokens** en lugar de localStorage directo
3. **Refresh tokens** para sesiones largas
4. **HTTPS obligatorio**
5. **CORS configuration** en backend
6. **Rate limiting** en login

## 📚 Estructura del AuthService

```typescript
// Métodos principales:
authService.login(email, password)         // Observable<{success, user, message}>
authService.logout()                        // void
authService.getCurrentUser()                // User | null
authService.getCurrentUser$()               // Observable<User | null>
authService.isAuthenticated()               // Observable<boolean>
authService.getToken()                      // string | null
authService.getMockUsers()                  // User[]
```

## 🎨 Estilos del Dashboard

- **Header:** Gradiente azul con info del usuario
- **Cards:** Blancas con sombra, animación hover
- **Carouseles:** Scroll horizontal con botones navegación
- **Progress bars:** Indica plazas ocupadas
- **Responsive:** Adaptado a móvil, tablet y desktop

## 🐛 Troubleshooting

### No redirige a dashboard:
- Verifica que `DashboardComponent` está importado en `app.routes.ts`
- Mira la consola (F12) para mensajes de error

### Credenciales no funcionan:
- Verifica que escribiste bien el email
- Password es: `password123` (exactamente)

### No aparece el usuario en el dashboard:
- Comprueba localStorage (DevTools > Application > localStorage)
- Verifica que `auth_user` tiene el objeto del usuario

## 📝 Próximos Pasos (Sugerencias)

1. [ ] Implementar guards para proteger rutas
2. [ ] Añadir API real en lugar de mock
3. [ ] Implementar refresh token
4. [ ] Agregar 2FA (two-factor authentication)
5. [ ] Mejorar manejo de errores de red
6. [ ] Añadir logout automático por timeout

---

**Creado:** Diciembre 4, 2025
**Estado:** ✅ Funcional con datos mock
