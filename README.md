# Sales Dashboard – Prueba Técnica

Este proyecto corresponde a una prueba técnica que consiste en:
- Construir una API para consultar información de ventas.
- Consumir al menos un endpoint desde una interfaz web simple.
- Permitir seleccionar un rango de fechas y visualizar los resultados en una tabla y/o gráfico.

El objetivo principal fue priorizar claridad, mantenibilidad y buenas prácticas por sobre soluciones innecesariamente complejas.

---

## 🚀 Instrucciones para ejecutar el proyecto

### Requisitos
- Node.js >= 18
- npm
- (Opcional) entorno Linux / Unix / WSL para usar `make`

---

### Opción A: Usando Make (Linux / Unix / WSL)

Se incluye un `Makefile` para facilitar la ejecución:

```bash
make install   # Instala dependencias del backend y frontend
make start     # Ejecuta backend y frontend de forma concurrente
```

Otros comandos disponibles:
```bash
make start-back    # Ejecuta solo el backend
make start-front   # Ejecuta solo el frontend
```

---

### Opción B: Ejecución manual

#### Backend
```bash
npm install
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

El backend queda disponible en:
```
http://localhost:3000
```

Swagger:
```
http://localhost:3000/docs
```

El frontend queda disponible en:
```
http://localhost:5173
```

---

## 🧱 Estructura del proyecto

### Backend
El backend está estructurado en capas claras:

- **Domain**: contratos y reglas del negocio.
- **Application**: casos de uso.
- **Infrastructure**: Express, repositorios, controladores HTTP.
- **Shared**: manejo de errores y utilidades comunes.

Esta separación permite:
- Fácil mantenimiento.
- Cambiar el origen de datos sin afectar controladores.
- Escalar la solución sin reescribir todo el sistema.

---

## 🧠 Decisiones técnicas

### Backend

El backend fue desarrollado en **Node.js con Express**, utilizando una estructura inspirada fuertemente en **NestJS** y los principios **SOLID**.

No se utilizó NestJS ni TypeScript directamente porque no estaba explícitamente solicitado y el alcance del backend era acotado. Sin embargo, si el sistema creciera o tuviera que mantenerse a largo plazo, sin duda utilizaría NestJS por sus ventajas en robustez, tipado, estructura base y mantenibilidad.

Se aplicaron principios como:
- **Single Responsibility Principle**
- separación entre dominio, infraestructura y controladores
- bajo acoplamiento y alta cohesión

---

### Frontend

Para el frontend se utilizó **React + Vite**, manteniendo una interfaz simple y funcional.

Aunque se utilizaron herramientas modernas de asistencia (IA), el foco estuvo siempre en aplicar criterio técnico:
- entender qué información debía mostrarse
- diseñar una UI simple
- aplicar validaciones y una UX básica

La interfaz permite seleccionar un rango de fechas, consultar la API y visualizar los resultados en una tabla y un gráfico.

---
> **Nota sobre el uso de herramientas de asistencia**
>
> Durante el desarrollo se utilizaron herramientas modernas de asistencia basadas en IA como apoyo al flujo de trabajo.  
> La IA se empleó principalmente como acelerador de tareas repetitivas y generación de boilerplate, mientras que todas las decisiones de arquitectura, estructura del proyecto, validaciones, manejo de estados y lógica fueron definidas, revisadas y ajustadas manualmente.
>
> Considero que hoy en día estas herramientas forman parte del flujo real de desarrollo profesional y que su uso responsable permite mejorar la productividad sin reemplazar el criterio técnico ni la comprensión del código.


---

## ⚙️ Parte más compleja

La parte más compleja fue definir una estructura backend limpia sin sobredimensionar el proyecto, asegurando que pudiera escalar conceptualmente sin cambiar su diseño base.

---

## ❓ Respuestas a preguntas adicionales

### 1. ¿Cómo escalarías esta solución si los datos estuvieran en AWS S3?

La API podría consumir los datos desde S3 mediante un repositorio específico, manteniendo la misma interfaz de dominio. Idealmente, se usaría un proceso ETL intermedio para evitar consultas directas en tiempo real.

---

### 2. ¿Cómo optimizarías el rendimiento si el volumen creciera 100 veces?

- Uso de base de datos con índices.
- Cache (Redis) para consultas frecuentes.
- Evitar recalcular agregaciones.
- Paginación y filtros eficientes.

---

### 3. ¿Cómo asegurarías la API frente a accesos no autorizados?

- Autenticación mediante JWT u OAuth 2.0.
- Configuración correcta de CORS.
- Rate limiting y logging de accesos.
