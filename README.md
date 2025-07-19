# 📚 CerBrary - Sistema de Gestión de Biblioteca

CerBrary es un sistema moderno de gestión de biblioteca desarrollado con Next.js, que permite administrar libros, usuarios y transacciones de préstamos de manera eficiente.

## 🚀 Características

- **Gestión de Usuarios**: Sistema de autenticación con roles (Usuario/Administrador)
- **Catálogo de Libros**: CRUD completo para la gestión de libros
- **Sistema de Préstamos**: Gestión de préstamos y devoluciones
- **Panel de Administración**: Dashboard para administradores
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js para manejo seguro de sesiones
- **UI Moderna**: Componentes con Radix UI y Tailwind CSS
- **Storage**: Integración con Supabase para almacenamiento

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15.4** - Framework React con SSR/SSG
- **React 19** - Biblioteca para interfaces de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **Radix UI** - Componentes accesibles y sin estilos
- **Framer Motion** - Animaciones
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Backend
- **NextAuth.js** - Autenticación
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **Supabase** - Backend as a Service

### Herramientas de Desarrollo
- **ESLint** - Linting de código
- **Prisma Studio** - Visualización de base de datos

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Una cuenta de [Supabase](https://supabase.com/) (para la base de datos)

## 🔧 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/JohanSH7/cerbrary.git
   cd cerbrary
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:
   ```env
   # Base de datos
   DATABASE_URL="tu_database_url_aqui"
   DIRECT_URL="tu_direct_url_aqui"
   
   # NextAuth
   NEXTAUTH_SECRET="tu_secret_aqui"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="tu_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_supabase_anon_key"
   SUPABASE_SERVICE_ROLE_KEY="tu_service_role_key"
   ```

4. **Configura la base de datos**
   ```bash
   # Generar el cliente de Prisma
   npx prisma generate
   
   # Ejecutar migraciones
   npx prisma migrate deploy
   
   # (Opcional) Ver la base de datos
   npx prisma studio
   ```

## 🚀 Ejecución

### Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`

### Modo Producción
```bash
# Construir la aplicación
npm run build

# Iniciar el servidor de producción
npm start
```

### Comandos Útiles
```bash
# Linting
npm run lint

# Ver la base de datos en Prisma Studio
npx prisma studio

# Reset de la base de datos
npx prisma migrate reset
```

## 📁 Estructura del Proyecto

```
cerbrary/
├── prisma/                 # Esquema y migraciones de base de datos
│   ├── schema.prisma
│   └── migrations/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes React organizados por atomic design
│   │   ├── atoms/         # Componentes básicos
│   │   ├── molecules/     # Componentes compuestos
│   │   ├── organisms/     # Componentes complejos
│   │   ├── templates/     # Plantillas de página
│   │   └── ui/           # Componentes de UI (Radix UI)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilidades y configuraciones
│   ├── pages/             # Páginas de Next.js
│   │   ├── api/          # API routes
│   │   ├── admin/        # Panel de administración
│   │   └── dashboard/    # Dashboard de usuario
│   ├── styles/            # Estilos globales
│   └── utils/             # Funciones utilitarias
├── types/                  # Definiciones de tipos TypeScript
└── ...archivos de configuración
```

## 🎯 Funcionalidades Principales

### Para Usuarios
- ✅ Registro e inicio de sesión
- ✅ Búsqueda y navegación del catálogo de libros
- ✅ Solicitud de préstamos
- ✅ Visualización de historial de transacciones
- ✅ Gestión de perfil

### Para Administradores
- ✅ Gestión completa de usuarios (aprobar/rechazar registros)
- ✅ CRUD de libros (crear, leer, actualizar, eliminar)
- ✅ Gestión de préstamos y devoluciones
- ✅ Reportes y estadísticas
- ✅ Configuración del sistema

## 🔐 Roles y Permisos

### Usuario Regular (USER)
- Puede navegar el catálogo
- Puede solicitar préstamos
- Puede ver su historial personal

### Administrador (ADMIN)
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y libros
- Acceso al panel de administración

## 🗄️ Base de Datos

El proyecto utiliza PostgreSQL con Prisma ORM. Los principales modelos son:

- **User**: Usuarios del sistema con roles y estados
- **Book**: Catálogo de libros con información detallada
- **Transaction**: Préstamos y devoluciones con estados
- **Account/Session**: Autenticación (NextAuth)

### Estados de Usuario
- `PENDING`: Usuario registrado pendiente de aprobación
- `APPROVED`: Usuario aprobado para usar el sistema
- `REJECTED`: Usuario rechazado

### Estados de Transacción
- `ACTIVE`: Préstamo activo
- `COMPLETED`: Préstamo completado (devuelto)
- `OVERDUE`: Préstamo vencido

## 🔄 API Endpoints

### Autenticación
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signout` - Cerrar sesión
- `POST /api/register` - Registro de usuarios

### Libros
- `GET /api/book` - Obtener libros
- `POST /api/book` - Crear libro (Admin)
- `PUT /api/book/[id]` - Actualizar libro (Admin)
- `DELETE /api/book/[id]` - Eliminar libro (Admin)

### Usuarios
- `GET /api/users` - Obtener usuarios (Admin)
- `PUT /api/users/[id]` - Actualizar usuario (Admin)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Convenciones de Código

- Usar TypeScript para todo el código
- Seguir las reglas de ESLint configuradas
- Componentes en PascalCase
- Archivos en camelCase
- Usar async/await en lugar de .then()
- Arquitectura de componentes siguiendo Atomic Design

## 🚧 Roadmap

- [ ] Implementar notificaciones push
- [ ] Sistema de reservas
- [ ] Integración con código de barras
- [ ] App móvil con React Native
- [ ] Sistema de multas automático
- [ ] Reportes avanzados con gráficos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo de Desarrollo

Desarrollado como parte del taller en grupo de Ingeniería Web - Universidad de Antioquia.

## 📞 Soporte

Si tienes alguna pregunta o problema, puedes:

1. Abrir un issue en GitHub
2. Contactar al equipo de desarrollo
3. Revisar la documentación de las tecnologías utilizadas

---

⭐ ¡No olvides darle una estrella al proyecto si te fue útil!
