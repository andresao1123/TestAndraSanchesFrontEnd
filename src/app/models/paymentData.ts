import {} from 'jquery';
import { ApiService } from '../services/api.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EncryptionService } from '../services/encryption.service';

@Injectable({
    providedIn: 'root',
  })
export class PaymentData {

  constructor(private apiService:ApiService,private router: Router,private encryptionService: EncryptionService) {}

  public data = {
    /* Requerido. Email de la cuenta PagoPlux del Establecimiento */
    PayboxRemail: 'da.nielrolesppx@gmail.com',
    /* Requerido. Email del usuario que realiza el pago */
    PayboxSendmail: 'andresaoperez@gmail.com',
    /* Requerido. Nombre del establecimiento en PagoPlux */
    PayboxRename: 'Test Andres Sanchez',
    /* Requerido. Nombre del usuario que realiza el pago */
    PayboxSendname: 'Andres Sanchez',
    /* Requerido. Monto total de productos o servicios que no aplican
        impuestos, máximo 2 decimales. Ejemplo: 100.00, 10.00, 1.00 */
    PayboxBase0: '0.00',
    /* Requerido. Monto total de productos o servicios que aplican
        impuestos, el valor debe incluir el impuesto, máximo 2 decimales.
        Ejemplo: 100.00, 10.00, 1.00 posee el valor de los productos con su
        impuesto incluido */
    PayboxBase12: '10.25',
    /* Requerido. Descripción del pago */
    PayboxDescription: 'Test Andres Sanchez',

    /* Requerido Tipo de Ejecución
        * Production: true (Modo Producción, Se procesarán cobros y se
        cargarán al sistema, afectará a la tdc)
        * Production: false (Modo Prueba, se realizarán cobros de prueba y no
        se guardará ni afectará al sistema)
        */
    PayboxProduction: false,
    /* Requerido Ambiente de ejecución
        * prod: Modo Producción, Se procesarán cobros y se cargarán al
        sistema, afectará a la tdc.
        * sandbox: Modo Prueba, se realizarán cobros de prueba
        */
    PayboxEnvironment: 'sandbox',
    /* Requerido. Lenguaje del Paybox
     * Español: es | (string) (Paybox en español)
     */
    PayboxLanguage: 'es',
    /* Requerido. Identifica el tipo de iframe de pagoplux por defecto true
     */
    PayboxPagoPlux: true,
    /*
     * Requerido. dirección del tarjetahabiente
     */
    PayboxDirection: 'Urb prados de tanda',
    /*
     * Requerido. Teléfono del tarjetahabiente
     */
    PayBoxClientPhone: '0992699961',
    /* Opcionales
        * Solo aplica para comercios que tengan habilitado pagos
        internacionales
        */
    PayBoxClientName: '',
    PayBoxClientIdentification: '',
    /* SOLO PARA PAGOS RECURRENTES
        * Solo aplica para comercios que tengan habilitado pagos
        recurrentes
        */
    /* Requerido
        True -> en caso de realizar un pago recurrente
        False -> si es pago normal
        */
    PayboxRecurrent: false,
    /* Requerido
        Id o nombre exacto del plan registrado en el comercio en la
        plataforma de pagoplux
        */

    PayboxIdPlan: 'Plan Mensual',
    /**
        * true -> los cobros se realizan de manera automática según la
        frecuencia del plan asignado en PAGOPLUX
        * false -> los cobros se realizan mediante solicitud
        */
    PayboxPermitirCalendarizar: false,
    /* Requerido
        * true -> El débito se realiza en el momento del pago
        * false -> El débito se realizará en la fecha de corte según el plan
        contratado
        */
    PayboxPagoInmediato: true,
    /* Requerido
        true -> si desea realizar un pago de prueba de 1$ y reverso del
        mismo de manera automática
        NOTA: PayboxPagoImediato debe ser igual false
        false -> no se realizará ningún cobro de prueba
        */
    PayboxCobroPrueba: false,

    onAuthorize: (response: any) => {
      if (response.status === 'succeeded') {
        jQuery('.container-unpayed').hide(); //oculta la respuesta
        response.amount, //monto
          response.deferred, //diferidos
          response.interest, //tiene intereses
          response.interestValue, //monto intereses
          response.amountWoTaxes, //monto impuestos
          response.cardInfo, //número de tarjeta encriptado
          response.cardIssuer, //marca tarjeta Ejemplo: Visa
          response.cardType, //tipo tarjeta Ejemplo: Crédito
          response.clientID, //identificación tarjetahabiente
          response.clientName, //nombre tarjetahabiente
          response.fecha, //fecha de pago
          response.id_transaccion, //id de transacción pagoplux
          response.state, //estado del pago
          response.token, //voucher del pago
          response.tipoPago; //tipo de pago usado
          console.log(response);
          this.redirectToTarget(response.detail.clientID,response.detail.clientName)
      }
    },
  };

  redirectToTarget(documentId:string,name:string): void {
    const clientDocumentId = documentId; // Replace with your actual parameter value
    this.router.navigate(['/results', this.encryptionService.encrypt(clientDocumentId),this.encryptionService.encrypt(name)]);
  }
}
