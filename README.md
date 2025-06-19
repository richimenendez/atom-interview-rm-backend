# Backend Entrevista para Atom
## Ricardo Antonio Menéndez Tobías

Este es el backend de la aplicación que desarrollé para la entrevista con Atom, es una API REST que maneja usuarios y tareas. Está construido con Node.js, TypeScript y Firebase Functions, siguiendo principios de Clean Architecture y algunos patrones de diseño. En este proyecto traté de implementar la mayoría de conceptos que he manejado como desarrollador, me apoyé con IA para agilizar el desarrollo, pero todo sobre conceptos que he manejado en proyectos de la vida real. 

## ¿Por qué usar esta arquitectura?

### Clean Architecture + Domain-Driven Design

Usar Clean Architecture es importante para generar un código que sea fácil de mantener y escalar. La idea es separar las responsabilidades en capas bien definidas:

- **Domain**: Aquí van las reglas de negocio puras, sin depender de nada externo
- **Application**: Los casos de uso que orquestan la lógica de negocio
- **Infrastructure**: Todo lo técnico (base de datos, autenticación, etc.)

Esto nos da varias ventajas:
- Podemos cambiar la base de datos sin tocar la lógica de negocio
- Es fácil hacer testing porque cada capa está aislada
- El código es más legible y mantenible

En mi experiencia en proyectos anteriores, he visto como tiene valor separar estas capas, ya que al sufrir cambios en alguna capa, el impacto en las otras es muy poco. Ademas de otorgar una estructura estandar que se puede estandarizar en la industria. 

### TypeScript

TypeScript ayuda a prevenir errores desde el momento que se escribe el código. Los tipos nos sirven como documentación y nos dan autocompletado en el IDE. Además, hace el refactoring mucho más seguro. Durante mi tiempo como desarrollador, me ha costado un poco el terminar de adaptar Interfaces, y tipados para mantener la logica en los datos, pero al final nos da una consistencia mucho mayor, con los beneficios de usar Javascript (en vez de migrar a un lenguaje fuertemente tipado para el desarrollo de una API)

## Tecnologías que usé, si bien ví que manejan Angular 17, trabaje con las ultimas versiones disponibles, una disculpa si era requerimiento.

### Core
- **Node.js 22**
- **Express 5.1.0**
- **TypeScript 5.8.3**

### Firebase
- **Firebase Functions**
- **Firestore**
- **Firebase Admin SDK**

### Seguridad y Validación
- **JWT**
- **Joi**
- **Helmet**
- **Rate Limiting**

### Testing
- **Jest**
- **Firebase Functions Test**

## Estructura del proyecto

```
src/
├── domain/           # Reglas de negocio y entidades
│   ├── entities/     # User, Task y sus comportamientos
│   └── ports/        # Interfaces para repositorios
├── application/      # Casos de uso
│   └── use-cases/    # Lógica de aplicación
├── infrastructure/   # Implementaciones técnicas
│   ├── controllers/  # Manejo de requests HTTP
│   ├── middleware/   # Validación, auth, etc.
│   ├── repositories/ # Acceso a datos
│   ├── routes/       # Definición de endpoints
│   └── services/     # Servicios técnicos
└── index.ts         # Punto de entrada
```

## ¿Cómo funciona la autenticación?

Usé JWT (JSON Web Tokens) porque es stateless y escalable. Pensaba usar Firebase Auth, pero al tener la limitante de solo usar correo, preferí generar un token personal yo, y usar JWT para "encriptarlo". El flujo es así:

1. El usuario se registra o hace login
2. Generamos un JWT con su información
3. El frontend guarda el token
4. En cada request, el frontend envía el token en el header Authorization
5. Nuestro middleware verifica el token y extrae la información del usuario

Los tokens expiran en 24 horas y hay un endpoint para refrescarlos.

### Repository Pattern

Implementé el patrón Repository para abstraer el acceso a datos. Esto significa que:
- La lógica de negocio no sabe nada sobre Firestore
- Podemos cambiar de base de datos fácilmente
- Es más fácil hacer testing con mocks

## Validación y seguridad

### Validación de entrada

Usamos Joi para validar todos los datos que llegan a la API con formatos y reglas definidas por nosotros.

### Middleware de seguridad

- **Helmet**: Configura headers de seguridad automáticamente
- **Rate Limiting**: Limita requests por IP para prevenir abuso
- **CORS**: Permite requests desde el frontend
- **Authentication**: Verifica JWT en rutas protegidas

## Testing

Hice tests para:
- **Casos de uso**: Lógica de negocio
- **Controladores**: Manejo de requests HTTP
- **Middleware**: Validación y autenticación
- **Servicios**: JWT, Firestore, etc.

Usé Jest con cobertura de código para asegurar que todo funciona correctamente.

## Scripts disponibles

```bash
npm run build          # Compila TypeScript
npm run serve          # Ejecuta en modo desarrollo
npm run deploy         # Deploy a Firebase
npm run test           # Ejecuta tests
npm run test:coverage  # Tests con cobertura
```

## Endpoints de la API

### Usuarios
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Login de usuario
- `POST /api/users/refresh-token` - Refrescar JWT

### Tareas
- `GET /api/tasks` - Obtener tareas del usuario
- `GET /api/tasks/:id` - Obtener tarea específica
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

Todos los endpoints de tareas requieren autenticación y verifican que el usuario sea dueño de la tarea.

## Manejo de errores

Tenemos un sistema robusto de manejo de errores:
- **HTTP status codes** apropiados
- **Mensajes de error** descriptivos
- **Try-catch** en cada capa
- **Middleware centralizado** para errores

## Variables de entorno

Necesitas configurar:
- `JWT_SECRET`: Clave secreta para firmar JWT
- `GOOGLE_APPLICATION_CREDENTIALS`: Credenciales de Firebase
