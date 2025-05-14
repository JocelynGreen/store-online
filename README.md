# store-online
# Tienda Deportiva

# INTEGRANTES: 
HERNANDEZ RAMIREZ YARELY JOCELYN
RODRIGUEZ HUMBERTO FELIPE

Este proyecto consiste en una aplicación web completa que simula una tienda deportiva, con funcionalidades tanto de frontend como de backend. El sistema permite a los usuarios explorar productos, registrarse, iniciar sesión y gestionar un carrito de compras básico.

## Estructura del Repositorio

El repositorio está dividido en dos carpetas principales:

- `tienda/`: Contiene el frontend (interfaz del usuario).
- `tienda-api-deportiva-backend/`: Contiene el backend (API y lógica del servidor).

## Características Implementadas

- Carga y visualización de productos deportivos.
- Registro de nuevos usuarios.
- Inicio de sesión seguro utilizando JWT (JSON Web Tokens).
- Carrito de compras básico (añadir y eliminar productos).
- Protección de rutas mediante autenticación.
- Almacenamiento de datos en memoria (puede adaptarse a una base de datos).

## Cómo Ejecutar el Backend (API)

1. Abrir una terminal y navegar a la carpeta del backend:

   ```
   cd tienda-api-deportiva-backend
   ```

2. Instalar las dependencias necesarias:

   ```
   npm install
   ```

4. Iniciar el servidor de la API:

   ```
   npm start
   ```

5. La API estará disponible en la siguiente URL:

   ```
   http://localhost:3000
   ```

Nota importante: el archivo `.env` es necesario para que el sistema de autenticación JWT funcione correctamente. Sin él, no será posible iniciar sesión.

## Cómo Ejecutar el Frontend

1. Abrir una nueva terminal.
2. Navegar a la carpeta del frontend:

   ```
   cd tienda
   ```

3. Instalar el servidor estático http-server (si no está instalado):

   ```
   npm install -g http-server
   ```

4. Iniciar el servidor:

   ```
   http-server -p 8000
   ```

5. Acceder al frontend desde el navegador en una de las siguientes URLs:

   ```
   http://localhost:8000/index.html
   http://localhost:8000/catalogo.html
   ```

