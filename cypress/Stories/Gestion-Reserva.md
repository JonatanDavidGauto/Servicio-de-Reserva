# Servicio-de-Reserva


## Descripción
La aplicación web de reservas está diseñada para simplificar la gestión y reserva de habitaciones en un establecimiento hotelero. Permite a los usuarios buscar y seleccionar habitaciones disponibles para un rango de fechas específico, completar detalles de contacto y confirmar reservas. La aplicación facilita la visualización de listados de reservas existentes y garantiza el cálculo preciso de precios según el tipo de habitación y fechas. Con una interfaz intuitiva, brinda a los usuarios una experiencia fluida y eficiente en la planificación de estancias.


## Características Principales
- **Búsqueda Personalizada:** Los usuarios pueden buscar habitaciones según fechas, tipo de habitación y número de huéspedes.
- **Gestión de Reservas:** Permite a los usuarios ver y administrar sus reservas existentes.
- **Cálculo Preciso de Precios:** Calcula el precio total considerando fechas y tipo de habitación.
- **Interfaz Intuitiva:** Proporciona una experiencia de usuario amigable y fácil de usar.
- **Actualización en Tiempo Real:** Actualiza la disponibilidad de habitaciones en tiempo real.
- **Gestión de Habitaciones Disponibles:** Realiza un seguimiento automático de la disponibilidad.
- **Flexibilidad de Huéspedes:** Adapta la búsqueda según el número de huéspedes.

## Test Cases Automatizados
- **TC01:** Verificar la visualización de todas las reservas existentes en la pantalla principal, validando las columnas esperadas.
- **TC02:** Validar que al seleccionar fechas y número de huéspedes se muestren las habitaciones disponibles.
- **TC03:** Validar al darle click al botón para seleccionar una habitación nos redirige al formulario de contacto a completar.
- **TC04:** Validar que el precio total basado en el número de días y tipo de habitación sea correcto.
- **TC07:** Validar que No se puede buscar si el n° de huéspedes es menor a 0.
- **TC14:** Validar crear reserva cuando se ingresan todos los campos del formulario con data válida.
