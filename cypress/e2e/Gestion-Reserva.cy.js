import {Reserva} from '../support/Pages/Gestion-Reserva.Page';
import data from '../fixtures/data.json';

describe('Gestion de Reservas App web', ()=>{
    beforeEach('Usuario debe estar ubicado en la web',()=>{
        cy.visit('/');
    })
    it.skip('TC01:Validar que se visualicen en la pantalla principal todas las reservas existentes y las columnas esperadas',()=>{
        // Este Test Case se ha salteado debido a que según la documentación  la pantalla principal debería de contar con
        // una estructura y nombres particulares para esos campos, esté test case podrá ejecutarse en cuanto se actualice 
        // la documentación o se acomode el frontend de acuerdo a la documentación ya existente
        Reserva.get.tablaDeReservas().should('be.visible');
        Reserva.get.nombresColumnas().then((columnasActuales)=>{
            expect(columnasActuales).deep.equal(data.pantallaPrincipal.columnasEsperadas);
        })
        Reserva.get.todaLaTabla().should('contain', data.pantallaPrincipal.botonNuevaReserva)
    })
    it('TC02: Validar que al seleccionar fechas y número de huéspedes se muestren las habitaciones disponibles',()=>{
        // Seleccionamos el botón de Nueva Reserva de la pantalla principal
        Reserva.get.botonNuevaReserva()
            .should('be.visible')
            .and('contain.text', data.pantallaPrincipal.botonNuevaReserva)
            .click();
        // Validamos la pantalla Nueva Reserva
        cy.url().should('contain',data.pantallaNuevaReserva.urlNuevaReserva);
        Reserva.get.pantallaNuevaReserva()
            .should('be.visible')
            .and('contain.text', data.pantallaNuevaReserva.botonBuscarDisponibilidad)
            .and('contain.text', data.pantallaNuevaReserva.fechaEntrada)
            .and('contain.text', data.pantallaNuevaReserva.fechaSalida);
        Reserva.tipoDeHabitacionActuales().then((HabitacionActuales)=>{
            expect(HabitacionActuales).deep.equal(Reserva.tipoHabitacionesEsperado());
        });
        // Ingresamos data random para cantidad de pasajeros
        Reserva.typeRandomCantPasajeros();
        // Validamos la cantidad de pasajeros
        Reserva.get.cantPasajeros().should('contain.value', Cypress.env('CantPasajeros'));
        // Ingresamos data random para fechas de entrada 
        Reserva.typeRandomFechaEntrada();
        // Validamos fecha de entrada
        Reserva.get.Entrada().should('contain.value', Cypress.env('FechaEntrada'))
        // Ingresamos data random para fecha de salida
        Reserva.typeRandomFechaSalida();
        // Validamos fecha salida
        Reserva.get.Salida().should('contain.value', Cypress.env('FechaSalida'))
        // Seleccionamos el botón para buscar disponibilidad
        Reserva.get.botonDisponibilidad().should('be.visible').click();
        // Validamos que se visualicen las habitaciones luego de buscar
        Reserva.get.tipoHabitacion().eq(1).invoke('text').then((HabitacionActuales)=>{
            const tipoHabitacion = data.pantallaNuevaReserva.detallesHabitación.filter(({ tipo }) => tipo===HabitacionActuales)
            const habitaciones = tipoHabitacion.map(({ capacidad }) => capacidad);
            Reserva.get.capacidad().should('contain.text', habitaciones);
        });
    })
    it('TC03:Validar al darle click al botón para seleccionar una habitación nos redirige al formulario de contacto a completar',()=>{
        // Seleccionamos fechas random y capacidad de pasajeros
        Reserva.clickOnNuevaReserva();
        Reserva.typeRandomCantPasajeros();
        Reserva.typeRandomFechaEntrada();
        Reserva.typeRandomFechaSalida();
        Reserva.get.botonDisponibilidad().click();
        Reserva.opcionRandomHabitación();
        // Validamos el cambio de pantalla
        cy.url().should('contain', data.pantallaFormularioReserva.urlFormulario)
        // Validamos que se visualicen los detalles de contacto
        Reserva.datosClientes().then((detalle)=>{
            expect(detalle).deep.equal(data.pantallaFormularioReserva.detalleClienteForm)
        })
    })
    it('TC04: Validar que el precio total basado en el número de días y tipo de habitación sea correcto',()=>{
        Reserva.clickOnNuevaReserva();
        Reserva.typeRandomFechaEntrada();
        Reserva.typeRandomFechaSalida();
        Reserva.get.botonDisponibilidad().click();
        // Validamos que los precios  de habitación por la cantidad de días sea correcto
        Reserva.get.precioIndividual().invoke('text').then((precio)=>{
            expect(precio).to.equal(Reserva.precioTotalEstadia(data.pantallaNuevaReserva.detallesHabitación[1].precio));
        })
        Reserva.get.precioDoble()
            .invoke('text')
            .then((precio)=>{
                expect(precio).to.equal(Reserva.precioTotalEstadia(data.pantallaNuevaReserva.detallesHabitación[2].precio));
        })
        Reserva.get.precioTriple()
            .invoke('text')
            .then((precio)=>{
                expect(precio).to.equal(Reserva.precioTotalEstadia(data.pantallaNuevaReserva.detallesHabitación[3].precio));
        })
        Reserva.get.precioCuadruple()
            .invoke('text')
            .then((precio)=>{
                expect(precio).to.equal(Reserva.precioTotalEstadia(data.pantallaNuevaReserva.detallesHabitación[4].precio));
        })
    })
    it('TC07: Validar que No se puede buscar si el n° de huéspedes es menor a 0',()=>{
        Reserva.clickOnNuevaReserva();
        Reserva.typeCantPasajeros(data.pantallaNuevaReserva.huespedes.invalido);
        Reserva.get.botonDisponibilidad().click();
        // Desde el frontend se visualiza un mensaje amigable con el texto :"el valor debe ser mayo de o
        // igual a 0", pero no se puede capturar el mensaje a traves del HTML
    })
    it('TC14: Validar crear reserva cuando se ingresan todos los campos del formulario con data válida',()=>{
        Reserva.clickOnNuevaReserva();
        Reserva.typeRandomCantPasajeros();
        Reserva.typeRandomFechaEntrada();
        Reserva.typeRandomFechaSalida();
        Reserva.get.botonDisponibilidad().click();
        Reserva.opcionRandomHabitación();
        // Validamos las Fechas ingresadas (se usaron de está forma debido que era el mismo selector que la pantalla Nueva Reserva)
        Reserva.get.Entrada().should('contain.value', Cypress.env('FechaEntrada')) 
        Reserva.get.Salida().should('contain.value', Cypress.env('FechaSalida'))
        // Rellenar Formulario
        Reserva.typeFormPasajero();
        Reserva.get.cantPasajeros()
            .invoke('val')
            .then(val=>{
                expect(val).to.equal(`${Cypress.env('CantidadPasajeros')}`);
            });
        Reserva.randomNumHabitación();
        Reserva.typeNombreCliente(data.pantallaFormularioReserva.datosCliente.nombre);
        Reserva.get.nombreCliente()
            .invoke('val')
            .then(nombre=>{
                expect(nombre).to.equal(data.pantallaFormularioReserva.datosCliente.nombre);
            });
        Reserva.typeCorreoElectronicoCliente(data.pantallaFormularioReserva.datosCliente.correoElectronico);
        Reserva.get.emailCliente()
            .invoke('val')
            .then(nombre=>{
                expect(nombre).to.equal(data.pantallaFormularioReserva.datosCliente.correoElectronico);
            });
        Reserva.typeNumTelefonoCliente(data.pantallaFormularioReserva.datosCliente.numeroTelefono);
        Reserva.get.telefonoCliente()
            .invoke('val')
            .then(nombre=>{
                expect(nombre).to.equal(data.pantallaFormularioReserva.datosCliente.numeroTelefono);
            });
        // Validamos el precio sea correcto
        Reserva.get.precioReserva().invoke('val').then((precio)=>{
            expect(precio).to.equal(Reserva.precioTotalEstadia(data.pantallaNuevaReserva.detallesHabitación[Cypress.env('maxPasajeros')].precio));
        })
    })
})