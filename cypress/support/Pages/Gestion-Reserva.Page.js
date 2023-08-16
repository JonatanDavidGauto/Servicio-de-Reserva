import data from '../../fixtures/data.json';
import moment from 'moment/moment';

class reserva{
    get={
        //Pantalla Principal
        todaLaTabla:()=> cy.get('[class="container-lg bg-light mt-5 pt-3"]'),
        tablaDeReservas:()=> cy.get('[class="table table-hover table-responsive"]'),
        nombresColumnas:()=> cy.get('tr[class="justify-content-between"]'),
        botonNuevaReserva:()=>cy.get('.btn.btn-primary'),
        
        //Pantalla Nueva Reserva
        pantallaNuevaReserva:()=> cy.get('[class="container-lg bg-light mt-5 pt-3"]'),
        cantPasajeros:()=>cy.get('[name="guest_count"]'),
        Entrada:()=> cy.get('[name="start_date"]'),
        Salida:()=> cy.get('[name="end_date"]'),
        tipoHabitacion:()=> cy.get('.text-start'),
        botonDisponibilidad:()=> cy.get('.btn.btn-primary'), 
        capacidad:()=> cy.get('.text-center').eq(3),
        precioIndividual:()=> cy.get('.text-center').eq(5),
        precioDoble:()=> cy.get('.text-center').eq(8),
        precioTriple:()=> cy.get('.text-center').eq(11),
        precioCuadruple:()=> cy.get('.text-center').eq(14),
        botonSucces:()=> cy.get('[class$="text-success"]'),
        
        //Pantalla Formulario Reserva
        datoCliente:()=> cy.get('[for*="contact_info_"]'),
        dropdownHabitacion:()=>cy.get('[name="room_id"]'),
        nombreCliente:()=> cy.get('[name="contact_info_0"]'),
        emailCliente:()=> cy.get('[name="contact_info_1"]'),
        telefonoCliente:()=>cy.get('[name="contact_info_2"]'),
        precioReserva:()=>cy.get('[class="form-control text-end"]').eq(6),
    }
    clickOnNuevaReserva(){
        this.get.botonNuevaReserva().click();
    }
    typeRandomCantPasajeros(){
        const pasajeros=Cypress._.random(0,4);
        Cypress.env('CantPasajeros', pasajeros);
        this.get.cantPasajeros().should('be.visible').click().type(pasajeros);
    }
    typeCantPasajeros(cantidad){
        this.get.cantPasajeros().click().type(cantidad);
    }
    randomFechaEntrada() {
		const fechaRandom = new Date(data.limites.fechaMax).getTime();
		const timestamp = Math.floor(Math.random() * fechaRandom);
		const fechaElegida = new Date(timestamp).toLocaleDateString('en-US', {  month: '2-digit', day: '2-digit', year: 'numeric'}).split("/");
        const fechaEntrada= fechaElegida[2]+'-'+fechaElegida[0]+'-'+fechaElegida[1];
        Cypress.env('FechaEntrada', fechaEntrada);
        return fechaEntrada;
	}
    randomFechaSalida() {
            const fromTime = new Date(Cypress.env('FechaEntrada')).getTime();
            const toTime = new Date(data.limites.fechaMax).getTime();
            const timestamp= new Date(fromTime + Math.random() * (toTime - fromTime));
            const fechaElegida = new Date(timestamp).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).split("/");
            const fechaSalida= fechaElegida[2]+'-'+fechaElegida[0]+'-'+fechaElegida[1];
            Cypress.env('FechaSalida', fechaSalida);
            return fechaSalida;
    }
    typeRandomFechaEntrada(){
        this.get.Entrada()
            .should('be.visible')
            .click()
            .type(this.randomFechaEntrada());
    }
    typeRandomFechaSalida(){
        this.get.Salida()
            .should('be.visible')
            .click()
            .type(this.randomFechaSalida());
        
    }
    tipoDeHabitacionActuales(){
        let tipo=[];
        return this.get
                .tipoHabitacion()
                .each((element) => {
                    tipo.push(element.text())
                })
                .then(() => {
                    return tipo
                })
    }
    tipoHabitacionesEsperado() {
		const tipoHabitacion = data.pantallaNuevaReserva.detallesHabitación.filter(({ tipo }) => tipo)
		const habitaciones = tipoHabitacion.map(({ tipo }) => tipo);
		return habitaciones;
	}
    opcionRandomHabitación(){
        this.get.botonSucces().then((opciones)=>{
            let opcion= Cypress._.random(0,opciones.length-1);
            this.get.botonSucces().eq(opcion).click();
        })
    }
    datosClientes(){
        let detalle=[];
        return this.get.datoCliente()
                .should('be.visible')
                .each((element) => {
                    detalle.push(element.text())
                })
                .then(() => {
                    return detalle
                })
    }
    diasEntreFechas(){
        let fecha1=moment(Cypress.env('FechaEntrada'));
        let fecha2=moment(Cypress.env('FechaSalida'))
        let diferenciaDias= fecha2.diff(fecha1, 'days');
        return diferenciaDias;
    }
    precioTotalEstadia(tipoHabitacion){
        let total = tipoHabitacion * (this.diasEntreFechas());
        return total.toFixed(2).replace('.',',');
    }
    typeFormPasajero(){
        this.get.cantPasajeros().invoke('attr','min').then(minValue=>{
            this.get.cantPasajeros().invoke('attr','max').then(maxValue=>{
                Cypress.env('maxPasajeros',maxValue);
                const opcion=Cypress._.random(minValue,maxValue);
                this.typeCantPasajeros(opcion);
                Cypress.env('CantidadPasajeros',opcion);
            })
        })
    }
    randomNumHabitación(){
        this.get.dropdownHabitacion()
            .children()
            .then(opciones=>{
                let opcion=Cypress._.random(0,opciones.length-1);
                this.get.dropdownHabitacion()
                    .select(opcion)
                    .invoke('val') 
                    // Se debe revisar esto ya que los valores y el texto no coinciden lo cual no permitirá hacer la validar correctamente
                    .then(numero=>{
                        Cypress.env('NúmeroHabitación', numero);
                        cy.log(Cypress.env('NúmeroHabitación'))
                    });
            })
    }
    typeNombreCliente(Nombre){
        this.get.nombreCliente().click().type(Nombre);
    }
    typeCorreoElectronicoCliente(Correo){
        this.get.emailCliente().click().type(Correo);
    }
    typeNumTelefonoCliente(Telefono){
        this.get.telefonoCliente().click().type(Telefono);
    }
}

export const Reserva = new reserva();