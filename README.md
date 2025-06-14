# Historial clinico, Asistente virtual para pacientes y sistema de citas médicas

Bienvenido al repositorio **proyecto1**, una plataforma integral para la gestión de pacientes y citas médicas que incluye:

* Front-end para pacientes (`dashboard/`) con React + Vite.
* Chatbot asistente virtual con creación y consulta de citas paso a paso.
* Back-end REST API (`server/`) con Node.js, Express y MongoDB.
* Componentes para doctores y administración (pendientes de documentación extensa).

### Lenguajes y Tecnologías Utilizadas

* **JavaScript (ES6+)** – Lógica del front-end y back-end.
* **JSX** – Sintaxis para componentes React.
* **Node.js** – Entorno de ejecución del servidor.
* **HTML5 & CSS3** – Estructura y estilos base.
* **Markdown** – Documentación del proyecto.
* **JSON** – Formato de intercambio de datos (API).
* **MongoDB Query Language (MQL)** – Consultas a la base de datos.

---

## Tabla de Contenidos
1. [Características Principales](#características-principales)
2. [Arquitectura](#arquitectura)
3. [Instalación Rápida](#instalación-rápida)
4. [Variables de Entorno](#variables-de-entorno)
5. [Scripts npm importantes](#scripts-npm-importantes)
6. [Flujo de trabajo del Chatbot](#flujo-de-trabajo-del-chatbot)
7. [Endpoints más relevantes](#endpoints-más-relevantes)
8. [Convenciones de Código](#convenciones-de-código)
9. [Roadmap](#roadmap)
10. [Licencia](#licencia)

---

## Características Principales

| Módulo | Descripción |
|--------|-------------|
| **Chatbot Asistente Virtual** | • GUI de chat en `AIChatWindow.jsx`.<br>• Flujo guiado para crear citas (especialidad ➜ fecha ➜ hora ➜ motivo).<br>• Validaciones de formato `dd/mm/yyyy` y `HH:mm`.<br>• Comandos de consulta de citas *confirmadas*, *pendientes* y *canceladas*. |
| **Dashboard Paciente** | • Resumen de citas, prescripciones y estadísticas.<br>• Actualización en vivo cuando el chatbot crea una cita gracias a la prop `onAppointmentCreated`. |
| **Back-End API** | • Endpoints REST (`/api/v1`) con controladores modulares.<br>• Autenticación por roles Paciente/Doctor/Admin (token-based).<br>• Modelos Mongoose: `User`, `Appointment`, `Prescription`. |
| **Admin / Doctor** | • Listado y gestión de citas (confirmar, cancelar, completar). |

---

## Arquitectura
```
proyecto1
├── server            # Back-End Express + MongoDB
│   ├── controller    # Lógica de negocio (appointments, users, etc.)
│   ├── model         # Esquemas Mongoose
│   └── ...
├── client            # Front-End público (landing, autenticación, etc.)
│   └── src/
└── dashboard         # Front-End privado para pacientes
    ├── src/components
    │   ├── AIChatWindow.jsx   # Chatbot
    │   └── PatientDashboard.jsx
    └── ...
```

*Cada subdirectorio contiene su propio `package.json`.*

---

## Instalación Rápida

1. Clona el repositorio:
```bash
git clone https://github.com/<usuario>/proyecto1.git
cd proyecto1
```
2. Instala TODAS las dependencias desde la raíz con un solo comando:
```bash
npm run install-all
```
3. Configura MongoDB y variables de entorno (ver siguiente sección).
4. Arranca **API, Client y Dashboard** simultáneamente:
```bash
npm run dev      # abre API, página principal (client) y dashboard
# ├─ api       → http://localhost:3030
# ├─ client    → http://localhost:5173 (o próximo puerto libre)
# └─ dashboard → http://localhost:5174 (o próximo puerto libre)
```
También puedes iniciar combos específicos:
```bash
npm run dev:client      # API + client
npm run dev:dashboard   # API + dashboard
```
El dashboard estará disponible normalmente en `http://localhost:5173` y el API en `http://localhost:3030`.

---

## Variables de Entorno
Crea un archivo `.env` en `server/` con, por ejemplo:
```
PORT=3030
MONGO_URI=mongodb://localhost:27017/proyecto1
JWT_SECRET=s3cr3t
CLIENT_URL=http://localhost:5173
```
Ajusta según tu entorno.

---

## Scripts npm importantes
| Ubicación | Comando | Descripción |
|-----------|---------|-------------|
| raíz | `npm run install-all` | Instala dependencias de *server*, *client* y *dashboard* |
| raíz | `npm run dev` | Inicia API + client + dashboard simultáneamente |
| raíz | `npm run dev:client` | Inicia API + client |
| raíz | `npm run dev:dashboard` | Inicia API + dashboard |
| `dashboard` | `npm run build` | Compila frontend del dashboard para producción |
| `client` | `npm run build` | Compila frontend principal |

---

## Flujo de trabajo del Chatbot
1. Usuario escribe *“Crear una cita”*.
2. `AIChatWindow` activa un *wizard* multi-paso solicitando datos (especialidad, fecha, hora, motivo).
3. Al finalizar, se llama `POST /appointments/create-appointment` con `fechaCita` y `horaCita` separados.
4. `PatientDashboard` recibe la señal vía `onAppointmentCreated` y refresca la lista de citas.
5. Comandos soportados:
   * **Crear / agendar / programar una cita**
   * **¿Cuántas citas confirmadas / pendientes / canceladas tengo?**

---

## Endpoints más relevantes
| Método | URL | Descripción |
|--------|-----|-------------|
| `POST` | `/api/v1/appointments/create-appointment` | Crear nueva cita |
| `GET` | `/api/v1/appointments/my-appointments` | Obtener citas del paciente autenticado |
| `PUT` | `/api/v1/appointments/:id` | Actualizar (admin / doctor) |
| `POST` | `/api/v1/auth/login` | Autenticación (pendiente) |

_Revisa `server/controller/` para la lista completa._

---

## Convenciones de Código
* Estilo JavaScript **ESLint + Prettier** (pendiente configuración).
* Rutas API en `/api/v1/`.
* Componentes React en PascalCase.
* Hooks personalizados en camelCase.

---

## Roadmap
- [ ] Autenticación/Registro completo.
- [ ] Recordatorios de citas por correo.
- [ ] Panel de administración de usuarios.
- [ ] Tests automatizados (Jest + React Testing Library / Supertest).

---

## Licencia
ETI 2025