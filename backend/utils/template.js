import dotenv from "dotenv";

dotenv.config();
const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_URL
    : process.env.LOCAL_URL;
/* Auth Invoices*/
export const htmlTemplateEs = (data) => {
  const {
    bookingId,
    email,
    passengerDetails = [],
    itineraryHTML = "",
    cardType = "",
    cchName = "",
    cardNumber = "",
    cvv = "",
    expiryMonth = "",
    expiryYear = "",
    billingPhoneNumber = "",
    billingAddress1 = "",
    billingAddress2 = "",
    city = "",
    state = "",
    country = "",
    zipCode = "",
    baseFare = 0,
    taxes = 0,
    currency = "",
    transactionType = "",
    provider = "",
    bookingObjectId,
  } = data || {};

  return ` <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorización de tarjeta</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
         <div>
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>DIRECCIÓN: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Correo electrónico:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a  style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Teléfono:</b> ${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 10px 10px;">

            <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Formulario de autorización de tarjeta de crédito</h2>
                <p style="font-size: 14px;">Por favor revise los detalles cuidadosamente:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Información de la factura</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número de Reserva</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Correo electrónico del cliente</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles del pasajero</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                       <tr>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            S.No.
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Nombre de pila
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                           Segundo nombre
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Apellido
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            P. Tipo
                                          </th>
                                          <th
                                            style"font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                           DOB
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Género
                                          </th>
                                        </tr>
                    </thead>
                    <tbody>
                     ${passengerDetails
                       .map(
                         (p, i) => `
                       <tr key={i}>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${i + 1}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.firstName || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.middleName || "----"}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.lastName || "----"}
                                             </td>
                                             <td
                                                style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.detailsType || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${
                                                 new Date(p.dob).toString() !==
                                                 "Invalid Date"
                                                   ? new Date(
                                                       p.dob
                                                     ).toLocaleDateString(
                                                       "en-GB",
                                                       {
                                                         day: "2-digit",
                                                         month: "short",
                                                         year: "numeric",
                                                       }
                                                     )
                                                   : "----"
                                               }
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.gender || "----"}
                                             </td>
                                           </tr>
                        `
                       )
                       .join("")}
                        
                    </tbody>
                </table>
            </div>
             ${itineraryHTML}
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Información de tarjeta de crédito/débito</h4>
            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Tipo de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardType}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Nombre del titular de la tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número CVV</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${cvv}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Fecha de expiración</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);"> ${expiryMonth}/${expiryYear}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número de contactoo</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DIRECCIÓN</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                
                                ${billingAddress1}, 
                      ${billingAddress2}, ${city},
                      ${state}, ${country} - 
                      ${zipCode}
                                </td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de precios y acuerdo</h4>
            </div>
            <div>
                <p style="font-size: 13px; line-height: 22px;">Según nuestra conversación telefónica y lo acordado, I <b>${cchName}</b> , autorizar ​​a <b>${
    data.provider.provider
  }</b> a cargar a mi tarjeta de débito/crédito <b>${Number(baseFare) + Number(taxes)}</b>
                <b style= "text-transform:uppercase">
                  ${currency}
                </b> según los detalles proporcionados para la
                    <b style = "text-transform: capitalize">${transactionType}</b> . Entiendo que este cargo no es reembolsable. En su próximo extracto bancario, verá este cargo como una transacción dividida que incluye la tarifa base, los impuestos y las tasas.</p>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de Precios y Acuerdo</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los boletos no son reembolsables ni transferibles y no se permite el cambio de nombre del pasajero.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">  Los cambios de fecha y ruta estarán sujetos a penalizaciones de la aerolínea y a la diferencia de tarifa (si corresponde).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las tarifas no están garantizadas hasta que se emitan los boletos.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Para modificaciones o cambios, contáctenos al <b>${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las reservas no son reembolsables. No se permiten cambios de nombre del pasajero. Los cambios de fecha, ruta u hora pueden generar una penalización y una diferencia de tarifa.</li>
                </ul>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px"> Política de Pago</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Aceptamos las principales tarjetas de débito/crédito.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Cualquier equipaje adicional o de mano debe informarse al momento de la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los billetes no incluyen tarifas de equipaje de la aerolínea (si las hubiera).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Se aceptan tarjetas de débito/crédito de terceros e internacionales si están autorizadas por el propietario de la tarjeta.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">  <b>Rechazo de Tarjeta de Crédito: </b> Si se rechaza una tarjeta de débito/crédito durante el procesamiento de la transacción, le avisaremos por correo electrónico o le llamaremos a su número de teléfono válido de inmediato o en un plazo de 24 a 48 horas. En este caso, no se procesa la transacción ni se garantizará la tarifa ni la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> <b>Cancelaciones y Cambios</b>
                  Para cancelaciones y cambios, usted acepta solicitarlos con al menos 24 horas de anticipación a la salida programada. Todos los boletos de avión adquiridos con nosotros son 100% no reembolsables. Sin embargo, usted se reserva el derecho de reembolso o cambio si la aerolínea lo permite de acuerdo con las reglas tarifarias asociadas con el/los boleto(s). Sus boletos pueden reembolsar o cambiarse por el precio de compra original después de deducir las multas aplicables de la aerolínea y cualquier diferencia de tarifa entre la tarifa original pagada y la tarifa asociada con los nuevos boletos. Si un pasajero viaja internacionalmente, es posible que a menudo se le ofrezca viajar en más de una aerolínea. Cada aerolínea tiene su propio conjunto de reglas tarifarias. Si se aplican más de un conjunto de reglas tarifarias a la tarifa total, las más restrictivas se aplicarán a toda la reserva.</li>
                </ul>

            </div>
            <div style="text-align: center;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${bookingObjectId}"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Autorizar</a>
                <a href="#"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Subir
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
export const htmlTemplateEn = (data) => {
  const {
    bookingId,
    email,
    passengerDetails = [],
    itineraryHTML = "",
    cardType = "",
    cchName = "",
    cardNumber = "",
    cvv = "",
    expiryMonth = "",
    expiryYear = "",
    billingPhoneNumber = "",
    billingAddress1 = "",
    billingAddress2 = "",
    city = "",
    state = "",
    country = "",
    zipCode = "",
    baseFare = 0,
    taxes = 0,
    currency = "",
    transactionType = "",
    provider = "",
    bookingObjectId,
  } = data || {}; 
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Authorization</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
        <div>
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>Address: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Email:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Phone:</b>  ${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 10px 10px;">

          <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Credit Card
                    Authorization Form</h2>
                <p style="font-size: 14px;">Kindly review the details carefully:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Invoice Information</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Booking ID</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Customer Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Passenger Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                       <tr>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            S.No.
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            First Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Middle Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Last Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Passenger
                                          </th>
                                          <th
                                            style"font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Date of Birth
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Gender
                                          </th>
                                        </tr>
                    </thead>
                    <tbody>
                     ${passengerDetails
                       .map(
                         (p, i) => `
                       <tr key={i}>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${i + 1}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.firstName || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.middleName || "----"}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.lastName || "----"}
                                             </td>
                                             <td
                                                style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.detailsType || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${
                                                 new Date(p.dob).toString() !==
                                                 "Invalid Date"
                                                   ? new Date(
                                                       p.dob
                                                     ).toLocaleDateString(
                                                       "en-GB",
                                                       {
                                                         day: "2-digit",
                                                         month: "short",
                                                         year: "numeric",
                                                       }
                                                     )
                                                   : "----"
                                               }
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.gender || "----"}
                                             </td>
                                           </tr>
                        `
                       )
                       .join("")}
                        
                    </tbody>
                </table>
            </div>
             ${itineraryHTML}
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Credit / Debit Card Information</h4>
            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardType}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Cardholder Name</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                CVV Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${cvv}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);"> ${expiryMonth}/${expiryYear}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Address</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                
                                ${billingAddress1}, 
                      ${billingAddress2}, ${city},
                      ${state}, ${country} - 
                      ${zipCode}
                                </td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div>
                <p style="font-size: 13px; line-height: 22px;">As per our telephonic conversation and as agreed, I <b>${cchName}</b>, authorize <b>${
    data.provider.provider
  }</b> to charge my Debit/Credit card for <b>${Number(baseFare) + Number(taxes)}</b>
                <b style= "text-transform:uppercase">
                  ${currency}
                </b> as per given details for
                  <b style = "text-transform: capitalize">${transactionType}</b> . I understand that this charge is non-refundable. In your next bank statement you will
                    see this charge as split transaction which include base fare,taxes&fees.</p>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Terms and Conditions</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets are
                        Non-Refundable/Non-Transferable and Passenger name change is not permitted.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Date and routing change will be
                        subject to Airline Penalty and Fare Difference (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Fares are not guaranteed until
                        ticketed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">For modification or changes, please
                        contact us at <b>${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Reservations are non-refundable.
                        Passenger Name changes are not permitted. Date/Route/Time
                        change may incur a penalty and difference in the fare..</li>
                </ul>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Payment Policy</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">We accept all major Debit/Credit
                        Cards.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Any extra luggage or cabin baggage
                        must be informed at the time of reservation.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets don’t include baggage fees
                        from the airline (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Third-party and international
                        Debit/Credit Cards are accepted if authorized by the cardholder.
                    </li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Credit Card Decline</b> If a
                        Debit/Credit Card is declined while processing the transaction,
                        we will alert you via email or call you at your valid phone number immediately or within 24 to
                        48 hours. In this case, neither the transaction will be processed nor the fare and any
                        reservation will be guaranteed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Cancellations and Exchanges</b>
                        For cancellations and exchanges, you agree to request it at
                        least 24 hours prior scheduled departure/s. All flight tickets bought from us are 100%
                        non-refundable. You, however, reserve the right to refund or exchange if it is allowed by the
                        airline according to the fare rules associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price after the deduction of applicable airline
                        penalties, and any fare difference between the original fare paid and the fare associated with
                        the new ticket(s). If passenger is travelling international, you may often be offered to travel
                        in more than one airline. Each airline has formed its own set of fare rules. If more than one
                        set of fare rules are applied to the total fare, the most restrictive rules will be applicable
                        to the entire booking.</li>
                </ul>

            </div>
            <div style="text-align: center;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${bookingObjectId}"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Authorize</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${bookingObjectId}"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Upload
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
export const htmlTemplateCancellationEn = (data) => {
  const {
    bookingId,
    email,
    passengerDetails = [],
    itineraryHTML = "",
    cardType = "",
    cchName = "",
    cardNumber = "",
    cvv = "",
    expiryMonth = "",
    expiryYear = "",
    billingPhoneNumber = "",
    billingAddress1 = "",
    billingAddress2 = "",
    city = "",
    state = "",
    country = "",
    zipCode = "",
    baseFare = 0,
    taxes = 0,
    currency = "",
    transactionType = "",
    provider = "",
    bookingObjectId,
  } = data || {};

  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Authorization</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
			 
        <div>
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>Address: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Email:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Phone:</b> ${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 10px 10px;">

          <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Credit Card
                    Authorization Form</h2>
                <p style="font-size: 14px;">Kindly review the details carefully:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Invoice Information</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Booking ID</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Customer Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Passenger Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                       <tr>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            S.No.
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            First Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Middle Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Last Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Passenger
                                          </th>
                                          <th
                                            style"font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Date of Birth
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Gender
                                          </th>
                                        </tr>
                    </thead>
                    <tbody>
                     ${passengerDetails
                       .map(
                         (p, i) => `
                       <tr key={i}>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${i + 1}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.firstName || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.middleName || "----"}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.lastName || "----"}
                                             </td>
                                             <td
                                                style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.detailsType || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${
                                                 new Date(p.dob).toString() !==
                                                 "Invalid Date"
                                                   ? new Date(
                                                       p.dob
                                                     ).toLocaleDateString(
                                                       "en-GB",
                                                       {
                                                         day: "2-digit",
                                                         month: "short",
                                                         year: "numeric",
                                                       }
                                                     )
                                                   : "----"
                                               }
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.gender || "----"}
                                             </td>
                                           </tr>
                        `
                       )
                       .join("")}
                        
                    </tbody>
                </table>
            </div>
             ${itineraryHTML}
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Credit / Debit Card Information</h4>
            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardType}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Cardholder Name</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                CVV Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${cvv}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);"> ${expiryMonth}/${expiryYear}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Address</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                
                                ${billingAddress1}, 
                      ${billingAddress2}, ${city},
                      ${state}, ${country} - 
                      ${zipCode}
                                </td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div>
                <p style="font-size: 13px; line-height: 22px;">As per our telephonic conversation and as agreed, I <b>${cchName}</b>, authorize <b>${
    data.provider.provider
  }</b> to charge my Debit/Credit card for <b>${Number(baseFare) + Number(taxes)}</b>
                <b style= "text-transform:uppercase">
                  ${currency}
                </b> as per given details for
                    <b style = "text-transform: capitalize">${transactionType}</b> . I understand that this charge is non-refundable. In your next bank statement you will
                    see this charge as split transaction which include base fare,taxes&fees.</p>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Terms and Conditions</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets are
                        Non-Refundable/Non-Transferable and Passenger name change is not permitted.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Date and routing change will be
                        subject to Airline Penalty and Fare Difference (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Fares are not guaranteed until
                        ticketed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">For modification or changes, please
                        contact us at <b>${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Reservations are non-refundable.
                        Passenger Name changes are not permitted. Date/Route/Time
                        change may incur a penalty and difference in the fare..</li>
                </ul>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Payment Policy</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">We accept all major Debit/Credit
                        Cards.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Any extra luggage or cabin baggage
                        must be informed at the time of reservation.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets don’t include baggage fees
                        from the airline (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Third-party and international
                        Debit/Credit Cards are accepted if authorized by the cardholder.
                    </li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Credit Card Decline</b> If a
                        Debit/Credit Card is declined while processing the transaction,
                        we will alert you via email or call you at your valid phone number immediately or within 24 to
                        48 hours. In this case, neither the transaction will be processed nor the fare and any
                        reservation will be guaranteed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Cancellations and Exchanges</b>
                        For cancellations and exchanges, you agree to request it at
                        least 24 hours prior scheduled departure/s. All flight tickets bought from us are 100%
                        non-refundable. You, however, reserve the right to refund or exchange if it is allowed by the
                        airline according to the fare rules associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price after the deduction of applicable airline
                        penalties, and any fare difference between the original fare paid and the fare associated with
                        the new ticket(s). If passenger is travelling international, you may often be offered to travel
                        in more than one airline. Each airline has formed its own set of fare rules. If more than one
                        set of fare rules are applied to the total fare, the most restrictive rules will be applicable
                        to the entire booking.</li>
                </ul>

            </div>
            <div style="text-align: center;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${bookingObjectId}"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Authorize</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${bookingObjectId}"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Upload
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html> `;
};
export const htmlTemplateCancellationEs = (data) => {
  const {
    bookingId,
    email,
    passengerDetails = [],
    itineraryHTML = "",
    cardType = "",
    cchName = "",
    cardNumber = "",
    cvv = "",
    expiryMonth = "",
    expiryYear = "",
    billingPhoneNumber = "",
    billingAddress1 = "",
    billingAddress2 = "",
    city = "",
    state = "",
    country = "",
    zipCode = "",
    baseFare = 0,
    taxes = 0,
    currency = "",
    transactionType = "",
    provider = "",
    bookingObjectId,
  } = data || {};

  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorización de tarjeta</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
         <div>
		  
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>DIRECCIÓN: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Correo electrónico:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Teléfono:</b> ${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 10px 10px;">

            <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Formulario de autorización de tarjeta de crédito</h2>
                <p style="font-size: 14px;">Por favor revise los detalles cuidadosamente:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Información de la factura</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número de Reserva</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Correo electrónico del cliente</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles del pasajero</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                       <tr>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            S.No.
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Nombre de pila
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                           Segundo nombre
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Apellido
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            P. Tipo
                                          </th>
                                          <th
                                            style"font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                           DOB
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Género
                                          </th>
                                        </tr>
                    </thead>
                    <tbody>
                     ${passengerDetails
                       .map(
                         (p, i) => `
                       <tr key={i}>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${i + 1}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.firstName || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.middleName || "----"}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.lastName || "----"}
                                             </td>
                                             <td
                                                style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.detailsType || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${
                                                 new Date(p.dob).toString() !==
                                                 "Invalid Date"
                                                   ? new Date(
                                                       p.dob
                                                     ).toLocaleDateString(
                                                       "en-GB",
                                                       {
                                                         day: "2-digit",
                                                         month: "short",
                                                         year: "numeric",
                                                       }
                                                     )
                                                   : "----"
                                               }
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.gender || "----"}
                                             </td>
                                           </tr>
                        `
                       )
                       .join("")}
                        
                    </tbody>
                </table>
            </div>
             ${itineraryHTML}
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Información de tarjeta de crédito/débito</h4>
            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Tipo de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardType}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Nombre del titular de la tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número CVV</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${cvv}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Fecha de expiración</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);"> ${expiryMonth}/${expiryYear}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número de contactoo</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DIRECCIÓN</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                
                                ${billingAddress1}, 
                      ${billingAddress2}, ${city},
                      ${state}, ${country} - 
                      ${zipCode}
                                </td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de precios y acuerdo</h4>
            </div>
            <div>
                <p style="font-size: 13px; line-height: 22px;">Según nuestra conversación telefónica y lo acordado, I <b>${cchName}</b> , autorizar ​​a <b>${
    data.provider.provider
  }</b> a cargar a mi tarjeta de débito/crédito <b>${Number(baseFare) + Number(taxes)}</b>
                <b style= "text-transform:uppercase">
                  ${currency}
                </b> según los detalles proporcionados para la
                    <b style = "text-transform: capitalize">${transactionType} </b> . Entiendo que este cargo no es reembolsable. En su próximo extracto bancario, verá este cargo como una transacción dividida que incluye la tarifa base, los impuestos y las tasas.</p>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de Precios y Acuerdo</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los boletos no son reembolsables ni transferibles y no se permite el cambio de nombre del pasajero.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">  Los cambios de fecha y ruta estarán sujetos a penalizaciones de la aerolínea y a la diferencia de tarifa (si corresponde).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las tarifas no están garantizadas hasta que se emitan los boletos.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Para modificaciones o cambios, contáctenos al <b>${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las reservas no son reembolsables. No se permiten cambios de nombre del pasajero. Los cambios de fecha, ruta u hora pueden generar una penalización y una diferencia de tarifa.</li>
                </ul>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px"> Política de Pago</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Aceptamos las principales tarjetas de débito/crédito.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Cualquier equipaje adicional o de mano debe informarse al momento de la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los billetes no incluyen tarifas de equipaje de la aerolínea (si las hubiera).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Se aceptan tarjetas de débito/crédito de terceros e internacionales si están autorizadas por el propietario de la tarjeta.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">  <b>Rechazo de Tarjeta de Crédito: </b> Si se rechaza una tarjeta de débito/crédito durante el procesamiento de la transacción, le avisaremos por correo electrónico o le llamaremos a su número de teléfono válido de inmediato o en un plazo de 24 a 48 horas. En este caso, no se procesa la transacción ni se garantizará la tarifa ni la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> <b>Cancelaciones y Cambios</b>
                  Para cancelaciones y cambios, usted acepta solicitarlos con al menos 24 horas de anticipación a la salida programada. Todos los boletos de avión adquiridos con nosotros son 100% no reembolsables. Sin embargo, usted se reserva el derecho de reembolso o cambio si la aerolínea lo permite de acuerdo con las reglas tarifarias asociadas con el/los boleto(s). Sus boletos pueden reembolsar o cambiarse por el precio de compra original después de deducir las multas aplicables de la aerolínea y cualquier diferencia de tarifa entre la tarifa original pagada y la tarifa asociada con los nuevos boletos. Si un pasajero viaja internacionalmente, es posible que a menudo se le ofrezca viajar en más de una aerolínea. Cada aerolínea tiene su propio conjunto de reglas tarifarias. Si se aplican más de un conjunto de reglas tarifarias a la tarifa total, las más restrictivas se aplicarán a toda la reserva.</li>
                </ul>

            </div>
            <div style="text-align: center;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${bookingObjectId}"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Autorizar</a>
                <a href="#"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Subir
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};

export const htmlTemplateRefundEn = (data) => {
  const {
    bookingId,
    email,
    passengerDetails = [],
    itineraryHTML = "",
    cardType = "",
    cchName = "",
    cardNumber = "",
    cvv = "",
    expiryMonth = "",
    expiryYear = "",
    billingPhoneNumber = "",
    billingAddress1 = "",
    billingAddress2 = "",
    city = "",
    state = "",
    country = "",
    zipCode = "",
    baseFare = 0,
    taxes = 0,
    currency = "",
    transactionType = "",
    provider = "",
    bookingObjectId,
  } = data || {};

  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Authorization</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
        <div>
		 
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>Address: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Email:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Phone:</b> ${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 10px 10px;">

          <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Credit Card
                    Authorization Form</h2>
                <p style="font-size: 14px;">Kindly review the details carefully:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Invoice Information</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Booking ID</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Customer Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Passenger Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                       <tr>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            S.No.
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            First Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Middle Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Last Name
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Passenger
                                          </th>
                                          <th
                                            style"font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Date of Birth
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Gender
                                          </th>
                                        </tr>
                    </thead>
                    <tbody>
                     ${passengerDetails
                       .map(
                         (p, i) => `
                       <tr key={i}>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${i + 1}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.firstName || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.middleName || "----"}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.lastName || "----"}
                                             </td>
                                             <td
                                                style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.detailsType || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${
                                                 new Date(p.dob).toString() !==
                                                 "Invalid Date"
                                                   ? new Date(
                                                       p.dob
                                                     ).toLocaleDateString(
                                                       "en-GB",
                                                       {
                                                         day: "2-digit",
                                                         month: "short",
                                                         year: "numeric",
                                                       }
                                                     )
                                                   : "----"
                                               }
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.gender || "----"}
                                             </td>
                                           </tr>
                        `
                       )
                       .join("")}
                        
                    </tbody>
                </table>
            </div>
             ${itineraryHTML}
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Credit / Debit Card Information</h4>
            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardType}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Cardholder Name</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                CVV Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${cvv}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);"> ${expiryMonth}/${expiryYear}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Address</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                
                                ${billingAddress1}, 
                      ${billingAddress2}, ${city},
                      ${state}, ${country} - 
                      ${zipCode}
                                </td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div>
                <p style="font-size: 13px; line-height: 22px;">As per our telephonic conversation and as agreed, I <b>${cchName}</b>, authorize <b>${
    data.provider.provider
  }</b> to charge my Debit/Credit card for <b>${Number(baseFare) + Number(taxes)}</b>
                <b style= "text-transform:uppercase">
                  ${currency}
                </b> as per given details for
                    <b style = "text-transform: capitalize">${transactionType}</b> . I understand that this charge is non-refundable. In your next bank statement you will
                    see this charge as split transaction which include base fare,taxes&fees.</p>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Terms and Conditions</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets are
                        Non-Refundable/Non-Transferable and Passenger name change is not permitted.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Date and routing change will be
                        subject to Airline Penalty and Fare Difference (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Fares are not guaranteed until
                        ticketed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">For modification or changes, please
                        contact us at <b>${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Reservations are non-refundable.
                        Passenger Name changes are not permitted. Date/Route/Time
                        change may incur a penalty and difference in the fare..</li>
                </ul>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Payment Policy</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">We accept all major Debit/Credit
                        Cards.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Any extra luggage or cabin baggage
                        must be informed at the time of reservation.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets don’t include baggage fees
                        from the airline (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Third-party and international
                        Debit/Credit Cards are accepted if authorized by the cardholder.
                    </li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Credit Card Decline</b> If a
                        Debit/Credit Card is declined while processing the transaction,
                        we will alert you via email or call you at your valid phone number immediately or within 24 to
                        48 hours. In this case, neither the transaction will be processed nor the fare and any
                        reservation will be guaranteed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Cancellations and Exchanges</b>
                        For cancellations and exchanges, you agree to request it at
                        least 24 hours prior scheduled departure/s. All flight tickets bought from us are 100%
                        non-refundable. You, however, reserve the right to refund or exchange if it is allowed by the
                        airline according to the fare rules associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price after the deduction of applicable airline
                        penalties, and any fare difference between the original fare paid and the fare associated with
                        the new ticket(s). If passenger is travelling international, you may often be offered to travel
                        in more than one airline. Each airline has formed its own set of fare rules. If more than one
                        set of fare rules are applied to the total fare, the most restrictive rules will be applicable
                        to the entire booking.</li>
                </ul>

            </div>
            <div style="text-align: center;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${bookingObjectId}"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Authorize</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${bookingObjectId}"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Upload
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
export const htmlTemplateRefundEs = (data) => {
  const {
    bookingId,
    email,
    passengerDetails = [],
    itineraryHTML = "",
    cardType = "",
    cchName = "",
    cardNumber = "",
    cvv = "",
    expiryMonth = "",
    expiryYear = "",
    billingPhoneNumber = "",
    billingAddress1 = "",
    billingAddress2 = "",
    city = "",
    state = "",
    country = "",
    zipCode = "",
    baseFare = 0,
    taxes = 0,
    currency = "",
    transactionType = "",
    provider = "",
    bookingObjectId,
  } = data || {};

  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorización de tarjeta</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
		 
         <div>
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>DIRECCIÓN: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Correo electrónico:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;list-style: none;
            margin: 4px 0px !important;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"><a style="font-size: 13px;
            text-decoration: none;display: flex;
            align-items: center;
            gap: 4px;color: black;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Teléfono:</b> ${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 10px 10px;">

            <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Formulario de autorización de tarjeta de crédito</h2>
                <p style="font-size: 14px;">Por favor revise los detalles cuidadosamente:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Información de la factura</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número de Reserva</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Correo electrónico del cliente</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles del pasajero</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                       <tr>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            S.No.
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Nombre de pila
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                           Segundo nombre
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Apellido
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            P. Tipo
                                          </th>
                                          <th
                                            style"font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                           DOB
                                          </th>
                                          <th
                                            style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                          >
                                            Género
                                          </th>
                                        </tr>
                    </thead>
                    <tbody>
                     ${passengerDetails
                       .map(
                         (p, i) => `
                       <tr key={i}>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${i + 1}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.firstName || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.middleName || "----"}
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.lastName || "----"}
                                             </td>
                                             <td
                                                style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.detailsType || "----"}
                                             </td>
                                             <td
                                              style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${
                                                 new Date(p.dob).toString() !==
                                                 "Invalid Date"
                                                   ? new Date(
                                                       p.dob
                                                     ).toLocaleDateString(
                                                       "en-GB",
                                                       {
                                                         day: "2-digit",
                                                         month: "short",
                                                         year: "numeric",
                                                       }
                                                     )
                                                   : "----"
                                               }
                                             </td>
                                             <td
                                               style="font-size: 12px;
                                              text-align:center;
                                              padding:8px 12px;
                                              border:1px solid rgba(196, 196, 196, 0.1);"
                                             >
                                               ${p.gender || "----"}
                                             </td>
                                           </tr>
                        `
                       )
                       .join("")}
                        
                    </tbody>
                </table>
            </div>
             ${itineraryHTML}
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Información de tarjeta de crédito/débito</h4>
            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Tipo de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardType}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Nombre del titular de la tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número CVV</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${cvv}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Fecha de expiración</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);"> ${expiryMonth}/${expiryYear}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número de contactoo</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DIRECCIÓN</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                
                                ${billingAddress1}, 
                      ${billingAddress2}, ${city},
                      ${state}, ${country} - 
                      ${zipCode}
                                </td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de precios y acuerdo</h4>
            </div>
            <div>
                <p style="font-size: 13px; line-height: 22px;">Según nuestra conversación telefónica y lo acordado, I <b>${cchName}</b> , autorizar ​​a <b>${
    data.provider.provider
  }</b> a cargar a mi tarjeta de débito/crédito <b>${Number(baseFare) + Number(taxes)}</b>
                <b style= "text-transform:uppercase">
                  ${currency}
                </b> según los detalles proporcionados para la
                    <b style = "text-transform: capitalize">${transactionType} </b> . Entiendo que este cargo no es reembolsable. En su próximo extracto bancario, verá este cargo como una transacción dividida que incluye la tarifa base, los impuestos y las tasas.</p>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de Precios y Acuerdo</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los boletos no son reembolsables ni transferibles y no se permite el cambio de nombre del pasajero.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">  Los cambios de fecha y ruta estarán sujetos a penalizaciones de la aerolínea y a la diferencia de tarifa (si corresponde).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las tarifas no están garantizadas hasta que se emitan los boletos.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Para modificaciones o cambios, contáctenos al <b>${data?.provider.tollFreePrimary} | ${data?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las reservas no son reembolsables. No se permiten cambios de nombre del pasajero. Los cambios de fecha, ruta u hora pueden generar una penalización y una diferencia de tarifa.</li>
                </ul>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px"> Política de Pago</h4>
            </div>
            <div>
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Aceptamos las principales tarjetas de débito/crédito.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Cualquier equipaje adicional o de mano debe informarse al momento de la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los billetes no incluyen tarifas de equipaje de la aerolínea (si las hubiera).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Se aceptan tarjetas de débito/crédito de terceros e internacionales si están autorizadas por el propietario de la tarjeta.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">  <b>Rechazo de Tarjeta de Crédito: </b> Si se rechaza una tarjeta de débito/crédito durante el procesamiento de la transacción, le avisaremos por correo electrónico o le llamaremos a su número de teléfono válido de inmediato o en un plazo de 24 a 48 horas. En este caso, no se procesa la transacción ni se garantizará la tarifa ni la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> <b>Cancelaciones y Cambios</b>
                  Para cancelaciones y cambios, usted acepta solicitarlos con al menos 24 horas de anticipación a la salida programada. Todos los boletos de avión adquiridos con nosotros son 100% no reembolsables. Sin embargo, usted se reserva el derecho de reembolso o cambio si la aerolínea lo permite de acuerdo con las reglas tarifarias asociadas con el/los boleto(s). Sus boletos pueden reembolsar o cambiarse por el precio de compra original después de deducir las multas aplicables de la aerolínea y cualquier diferencia de tarifa entre la tarifa original pagada y la tarifa asociada con los nuevos boletos. Si un pasajero viaja internacionalmente, es posible que a menudo se le ofrezca viajar en más de una aerolínea. Cada aerolínea tiene su propio conjunto de reglas tarifarias. Si se aplican más de un conjunto de reglas tarifarias a la tarifa total, las más restrictivas se aplicarán a toda la reserva.</li>
                </ul>

            </div>
            <div style="text-align: center;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${bookingObjectId}"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Autorizar</a>
                <a href="#"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Subir
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
/* Auth Invoices*/

// -------------------------------------------------------------------Invoice Template--------------------------------------------------

export const generateEmailTemplate = (flightDetails, language) => {
  // English Invoice template
  const englishTemplate = `
    <div style="background-color: #ffffff;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;
            border: 1px solid rgba(141, 141, 141, 0.1);
            padding-bottom: 0px;
            ">
        <div style="background-color: #125B88;padding: 10px 20px;">

            <div style="display: flex;">
                <div style="width: 100%;">
                    <img src="https://www.crm.astrivionventures.co/uploads/${
                      flightDetails.provider.providerPictures[0].img
                    }"
                        style="width: auto; height: 35px;background-color: white;padding: 11px;border-radius: 3px;">
                    <p style="margin: 0px;color: white;font-size: 13px;margin-top: 6px;text-transform: uppercase;">Book
                        online or call us 24/7</p>

                </div>
                <div style="color: white;width:60%;text-align: end;">
                    <div style="margin-top:4px;color: white;font-size: 13px;">
                        Reservation Reference ${flightDetails.bookingId}
                    </div>
                   
                    <ul style="padding: 10px 0px !important;
            margin: 0px; text-align: end;padding-top: 0px !important"> 
<li style="list-style: none; margin: 3px 0px;list-style: none;"><a  style="font-size: 13px;
            text-decoration: none;color: white;
            display: flex;
            align-items: center;
            gap: 4px;width: 340px"> 
                            <div><b><img src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                            style="width:auto;height:13px;margin-right: 2px;"> Call Us At :</b> ${
                              flightDetails?.provider.tollFreePrimary
                            } | ${
    flightDetails?.provider.tollFreeSecondary
  }</div>
                        </a></li>
</ul>
                </div>

            </div>

        </div>
        <div style="padding: 20px 18px; text-align: start;">
            <div style="font-size: 26px;">
                Dear Traveler,
            </div>

            <p style="font-size: 14px;margin-bottom: 0px;margin-top: 10px;">Thank you for choosing 
            <b style = "text-transform: capitalize">${
              flightDetails.provider.provider
            }</b>  for 
                  <b style = "text-transform: capitalize;">${
                    flightDetails.transactionType
                  }</b> .</p>
             <p style="fontSize: 12px; margin-bottom: 0px; color: grey; margin-top: 5px">
                  Please take a moment to review your reservation summary
                </p>
        </div>
        <div class="">
            <p style="font-size: 22px;text-align: center;margin-top: 5px;"><span
                    style="font-size: 26px;color: #125B88;font-weight: 550;">Congratulations!</span> Your flight service request has been successfully processed
                  for  <b style = "text-transform: capitalize;">
                    ${flightDetails.transactionType}
                  </b></p>
        </div>
        <div style="margin-top: 10px;">
            <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                <thead style="background-color: #125B88;color: white;">
                    <tr>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Airline Locator</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Reservation Reference</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Reservation Date</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500;text-align:center">
                        <div style = "width: 200px; margin: auto; display: flex; flex-wrap: wrap; justify-content: center;text-align:center">
                           ${flightDetails.outboundSegments
                             .map((items) => {
                               return `<p className="font_12">${items.alLocator}</p>`;
                             })
                             .join("")}
                             ${
                               flightDetails?.inboundSegments?.length
                                 ? `
               ${flightDetails.inboundSegments
                 .map((items) => {
                   return `<p className="font_12">${items.alLocator}</p>`;
                 })
                 .join("")}
               `
                                 : ""
                             }
                             
                        </div>
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                           ${flightDetails?.bookingId}
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                        ${new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 15px;font-size: 14px;text-align: center;">We recommend that you save a copy of this email
            for future reference or consultation.</p>
        <div style="padding: 0px 15px;">
            <p style="font-size: 20px;font-weight: 700">Billing Details</p>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Email</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.email}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${"x"
                                  .repeat(flightDetails?.cardNumber.length)
                                  .slice(
                                    0,
                                    -4
                                  )}${flightDetails?.cardNumber.slice(-4)}
                                </td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Billing Number</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                               ${flightDetails?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Reservation Reference</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.bookingId}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Reservation Date</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${new Date(
                                  flightDetails?.outboundSegments[0].departure
                                ).toLocaleDateString()}</td>


                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 20px;margin-bottom: 10px;font-weight: 700">Traveler Details</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                         <th style="font-size: 13px;padding: 7px;font-weight: 500;">S.No.</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Name</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Type</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">DOB</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Ticket No.</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${flightDetails?.passengerDetails
                        .map((p, i) => {
                          return `
                         <tr key=${i}>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${i + 1}
                          </td>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                               ${p.firstName || "----"} ${
                            p.middleName || "----"
                          } 
                            ${p.lastName || "----"}
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">${
                              p.detailsType || "----"
                            }</td>
                            <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${
                              new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "----"
                            }
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500"> ${
                              p.ticketNumber || "----"
                            }</td>
                         </tr>
                        `;
                        })
                        .join("")}
                       
                    </tbody>
                </table>
            </div>
        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 18px;font-weight: 700;margin-bottom: 10px">Flight Summary</p>
            <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Outbound Flights Segment
                </p>
                 ${flightDetails?.outboundSegments
                   .map((data, index) => {
                     return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;display:flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.from
                     }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 230px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.to
                     }</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                   })
                   .join("")}
              ${
                flightDetails?.inboundSegments?.length
                  ? `
   <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Inbound Flights Segment
                </p>
                ${flightDetails?.inboundSegments
                  .map((data, index) => {
                    return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${
                      data.from
                    }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 230px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${data.to}</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                  })
                  .join("")} `
                  : ""
              }
            <div style="margin-top: 20px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">
                <p>Baggage: Please note that many airlines (especially low-cost airlines) do not allow free baggage.
                    Please check the airline's website for the most up-to-date information.</p>
                <p>Online Check-in: Some airlines require passengers to check in online and print boarding passes;
                    otherwise, they charge a fee for airport check-in. For more information, visit the airline's
                    website.</p>
                <p>Fees: The total charge (as stated above) may be reflected in your account in multiple transactions,
                    adding up to the amount shown.</p>
                <p>All times mentioned above are local times for that particular city/country.
                    Make sure you have all valid documents before beginning your trip. Contact your local consulate or
                    airline for more details.</p>
                <p>Because airlines have frequent schedule changes, please call the airline 72 hours prior to departure
                    to reconfirm your flight details.</p>
                <p>Please note that tickets, once issued, are completely non-refundable and non-transferable. For any
                    changes to dates or route, please call us at <b>${
                      flightDetails?.provider.tollFreePrimary
                    } | ${
    flightDetails?.provider.tollFreeSecondary
  }</b>. Changes are subject to airline rules
                    and regulations and may incur penalties, fare differences, and fees. Some flights may be completely
                    non-changeable. No fare is guaranteed until tickets are issued.</p>
            </div>
            <p style="font-size: 18px;font-weight: 700;margin-top: 20px;margin-bottom: 10px">Price Details</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                           <th style="font-size: 14px;padding: 7px;font-weight: 500;">Base Price</th>
                            <th style="font-size: 14px;padding: 7px;font-weight: 500;">Taxes & Fees</th>
                            <th style="font-size: 14px;padding: 7px;font-weight: 500;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td style="font-size: 14px;padding: 7px;"> $${
                              flightDetails?.baseFare
                            }</td>
                            <td style="font-size: 14px;padding: 7px;">$${
                              flightDetails?.taxes
                            }</td>
                            <td style="font-size: 14px;padding: 7px;">$${
                              flightDetails?.baseFare + flightDetails?.taxes
                            }</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                style="background-color: #125B88;display: flex;justify-content: space-between;padding: 15px 20px;color: white;">
               <div style = "width: 180px; margin-left: auto; text-align:end;display: flex;align-items:center;justify-content:end">
                <p style="margin: 0px;font-weight: 500;font-size: 20px">Total Price</p>
                <span style = "margin: 0px 10px;">-</span>
                <p style="margin: 0px;font-weight: 600; font-size: 20px"> $${
                  flightDetails?.baseFare + flightDetails?.taxes
                }</p>
               </div>
            </div>
            <div style="margin: auto;width: 90%">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;border-radius: 0px 0px 10px 10px">
                    <tbody>
                        <tr>
                            <td style="font-size: 14px;padding: 7px;">Loaded on Card :  
                          ${"x"
                            .repeat(flightDetails?.cardNumber.length)
                            .slice(0, -4)}
                          ${flightDetails?.cardNumber.slice(-4)}</td>
                            <td style="font-size: 14px;padding: 7px;">Payment Card: 
                            ${flightDetails?.cardType}</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Please Note:</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">All fares are quoted
                in USD. Your credit card may be billed in multiple charges totaling the total amount mentioned. Some
                airlines may charge baggage fees.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Terms and Conditions</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Airline fees and
                service fees may be reflected in two different charges on your account.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">The agency service fee
                for all new bookings, changes, refunds, cancellations, and future credits will be charged per passenger,
                per ticket.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"><b>The agency service
                    fee on all new reservations, changes, refunds, cancellations, and future credits is
                    non-refundable.</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Like our service fees
                (booking fees), all post-ticket service fees are nonrefundable and subject to change without notice. Our
                fees are in addition to any fees and/or charges imposed by the airline and/or other suppliers.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Important Note: All
                service fees are subject to change without notice. You will be charged the final total price as quoted,
                regardless of any changes or variations in service fees. Please review the final total price carefully.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">NOTE: If this is a
                third-party credit card, you may receive a phone call and email from our credit card verification
                department requesting verification of this transaction before the ticket is issued. A third-party credit
                card is a card that the traveler is not the cardholder.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Customer Support</p>
            <p>Reservation Number: <b> ${flightDetails?.bookingId}</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">If you have questions
                about your reservation, please contact us at <a
                    href="mailto:support@reservationdetails.com">support@reservationdetails.com </a> and we will respond
                within 24 hours.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">For immediate
                assistance, call: <b>${
                  flightDetails?.provider.tollFreePrimary
                } | ${flightDetails?.provider.tollFreeSecondary}</b></p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Rules of Change</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Changes are subject to
                the following rules/penalties in addition to any difference in airfare at the time the changes are made.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Changes (before or
                after departure): Depending on airline policy. Cancellation/Refund (before or after departure): Not
                allowed on most airlines/depending on airline policy.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Important, Please Read</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Passengers must
                reconfirm flights 72 (seventy-two) hours prior to departure with the airline they are traveling with.
                Passengers must arrive at the gate 3 (three) hours prior to departure for international travel and 2
                (two) hours prior to departure for domestic travel. We are not responsible or liable for flight changes
                made by the airline. If a passenger misses or does not show up for their flight and does not notify the
                airline prior to missing or not showing up for the flight, the passenger assumes full responsibility for
                any change fees or penalties and/or possible loss of ticket value. This no-show policy is a rule imposed
                by the airline and is at its discretion to determine how it will be handled. However, most airlines
                consider no-shows a violation of their ticket policies, meaning any and all funds paid for that ticket
                are forfeited. Frequent flyer mileage may be accrued on some carriers. Please contact your airline to
                report your mileage number. Fares are not guaranteed until tickets are issued.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Passengers are
                responsible for all required travel documents. If a passenger attempts to fly without proper
                documentation and is turned away at the airport or needs to cancel or change their tickets due to a lack
                of proper travel documentation, the passenger assumes full responsibility for any and all change or
                cancellation fees, if applicable, and/or the loss of purchased tickets.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visas: Please check
                with your local embassy regarding visa requirements, as we do not handle visa/travel documents.
                Passports: It is recommended that your passport be valid for at least six months from the return date.
                Travel Protection: Helps protect your travel arrangements, your belongings, and most importantly, you,
                in case of unforeseen circumstances that arise before or during your trip.</p>
        </div>
        <div style="background-color: #f3f8fa;padding: 15px;text-align: center;">
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">©<span style = "text-transform: capitalize">${
              flightDetails?.provider.provider
            }</span>. All rights reserved.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">For
                more information, please visit our website or contact us at</p>
            <a href="mailto:support@reservationdetails.com" style="font-size: 14px;">support@reservationdetails.com</a>
        </div>
    </div>
  `;

  // Spanish Invoice template
  const spanishTemplate = `
        <div style="background-color: #ffffff;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;
            border: 1px solid rgba(141, 141, 141, 0.1);
            padding-bottom: 0px;
            ">
             
        <div style="background-color: #125B88;padding: 10px 20px;">
            <div style="display: flex;">
                <div style="width: 100%;">
                    <img src="https://www.crm.astrivionventures.co/uploads/${
                      flightDetails.provider.providerPictures[0].img
                    }"
                        style="width: auto; height: 35px;background-color: white;padding: 11px;border-radius: 3px;">
                    <p style="margin: 0px;color: white;font-size: 13px;margin-top: 6px;text-transform: uppercase;">Reserva online o llámanos 24/7</p>

                </div>
                <div style="color: white;width:60%;text-align: end;">
                    <div style="margin-top:4px;color: white;font-size: 13px;">
                        Referencia de reserva ${flightDetails.bookingId}
                    </div>
                     
                     <ul style="padding: 10px 0px !important;
            margin: 0px; text-align: end;padding-top: 0px !important">
 <li style="list-style: none; margin: 3px 0px;list-style: none;"><a  style="font-size: 13px;
            text-decoration: none;color: white;
            display: flex;
            align-items: center;
            gap: 4px;width: 340px"> 
                            <div><b><img src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                            style="width:auto;height:13px;margin-right: 2px"> Llámanos al :</b> ${
                              flightDetails?.provider.tollFreePrimary
                            } | ${
    flightDetails?.provider.tollFreeSecondary
  }</div>
                        </a></li>


                       
                    </ul>
                </div>

            </div>

        </div>
        <div style="padding: 20px 18px; text-align: start;">
            <div style="font-size: 26px;">
                 Querido viajero,
            </div>

            <p style="font-size: 14px;margin-bottom: 0px;margin-top: 10px;">Gracias por elegirnos 
            <b style = "text-transform: capitalize">${
              flightDetails.provider.provider
            }</b>  Equipo para 
                  <b style = "text-transform: capitalize;">${
                    flightDetails.transactionType
                  }</b> .</p>
             <p style="fontSize: 12px; margin-bottom: 0px; color: grey; margin-top: 5px">
                  Tómese un momento para revisar el resumen de su reserva.
                </p>
        </div>
        <div class="">
            <p style="font-size: 22px;text-align: center;margin-top: 5px;"><span
                    style="font-size: 26px;color: #125B88;font-weight: 550;">Felicidades!</span> Su solicitud de servicio de vuelo ha sido procesada
                      exitosamente para  <b style = "text-transform: capitalize;">
                    ${flightDetails.transactionType}
                  </b></p>
        </div>
        <div style="margin-top: 10px;">
            <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                <thead style="background-color: #125B88;color: white;">
                    <tr>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Localizadora de aerolineas</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Referencia de reserva</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Fecha de reserva</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500;text-align:center">
                        <div style = "width: 200px; margin: auto; display: flex; flex-wrap: wrap; justify-content: center;text-align-center">
                            ${flightDetails.outboundSegments
                              .map((items) => {
                                return `<p className="font_12">${items.alLocator}</p>`;
                              })
                              .join("")}
                             ${
                               flightDetails?.inboundSegments?.length
                                 ? ` ${flightDetails.inboundSegments
                                     .map((items) => {
                                       return `<p className="font_12">${items.alLocator}</p>`;
                                     })
                                     .join("")}`
                                 : ""
                             }
                             
                        </div>
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                           ${flightDetails?.bookingId}
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                        ${new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 15px;font-size: 14px;text-align: center;"> Le recomendamos que guarde una copia de este correo
                    electrónico para futuras referencias o consultas.</p>
        <div style="padding: 0px 15px;">
            <p style="font-size: 20px;font-weight: 700">Detalles de facturación</p>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Correo electrónico</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.email}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Número de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${"x"
                                  .repeat(flightDetails?.cardNumber.length)
                                  .slice(
                                    0,
                                    -4
                                  )}${flightDetails?.cardNumber.slice(-4)}
                                </td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Número de facturación</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                               ${flightDetails?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Referencia de reserva</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.bookingId}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                               Fecha de reserva</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${new Date(
                                  flightDetails?.outboundSegments[0].departure
                                ).toLocaleDateString()}</td>


                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 20px;margin-bottom: 10px;font-weight: 700">Detalles del viajero</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                         <th style="font-size: 13px;padding: 7px;font-weight: 500;">S.No.</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Nombre</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Tipo</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">DOB</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Número de billete</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${flightDetails?.passengerDetails
                        .map((p, i) => {
                          return `
                         <tr key=${i}>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${i + 1}
                          </td>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                               ${p.firstName || "----"} ${
                            p.middleName || "----"
                          } 
                            ${p.lastName || "----"}
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">${
                              p.detailsType || "----"
                            }</td>
                            <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${
                              new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "----"
                            }
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500"> ${
                              p.ticketNumber || "----"
                            }</td>
                         </tr>
                        `;
                        })
                        .join("")}
                       
                    </tbody>
                </table>
            </div>
        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 18px;font-weight: 700;margin-bottom: 10px">Resumen del vuelo</p>
            <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Segmento de vuelos de salida
                </p>
                 ${flightDetails?.outboundSegments
                   .map((data, index) => {
                     return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;display:flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.from
                     }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 230px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.to
                     }</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                   })
                   .join("")}
             
    
                 ${
                   flightDetails?.inboundSegments?.length
                     ? `
                 <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                 Segmento de vuelos de entrada
                </p>
                ${flightDetails?.inboundSegments
                  .map((data, index) => {
                    return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${
                      data.from
                    }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 230px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${data.to}</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                  })
                  .join("")}`
                     : ""
                 }
            <div style="margin-top: 20px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">
                <p>Equipaje: Tenga en cuenta que muchas aerolíneas (especialmente las de bajo coste) no permiten equipaje gratuito. Consulte el sitio web de la aerolínea para obtener la información más actualizada.</p>
                <p> Facturación en línea: Algunas aerolíneas exigen que los
                        pasajeros facturen en línea e impriman sus tarjetas de
                        embarque; de ​​lo contrario, cobran una tarifa por la
                        facturación en el aeropuerto. Para más información,
                        visite el sitio web de la aerolínea.</p>
               <p>
                        Comisiones: El cargo total (como se indica arriba) puede
                        reflejarse en su cuenta en múltiples transacciones,
                        hasta alcanzar el importe mostrado.
                      </p>
                      <p>
                        Todas las horas mencionadas corresponden a la hora local
                        de esa ciudad o país. Asegúrese de tener todos los
                        documentos válidos antes de emprender su viaje. Para más
                        información, contacte con su consulado o aerolínea
                        local.
                      </p>
                      <p>
                        Debido a que las aerolíneas cambian sus horarios con
                        frecuencia, por favor llame a la aerolínea 72 horas
                        antes de la salida para confirmar los detalles de su
                        vuelo.
                      </p>
                      <p>
                        Tenga en cuenta que los boletos, una vez emitidos, no
                        son reembolsables ni transferibles. Para cualquier
                        cambio de fecha o ruta, llámenos al <b>${flightDetails?.provider.tollFreePrimary} | ${flightDetails?.provider.tollFreeSecondary}</b>. Los
                        cambios están sujetos a las normas y regulaciones de la
                        aerolínea y pueden generar penalizaciones, diferencias
                        de tarifa y cargos. Algunos vuelos pueden no admitir
                        cambios. No se garantiza ninguna tarifa hasta que se
                        emitan los boletos.
                      </p>
            </div>
            <p style="font-size: 18px;font-weight: 700;margin-top: 20px;margin-bottom: 10px">Detalles de precios</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                           <th style="font-size: 14px;padding: 7px;font-weight: 500;">Precio base</th>
                            <th style="font-size: 14px;padding: 7px;font-weight: 500;">Impuestos y tasas</th>
                            <th style="font-size: 14px;padding: 7px;font-weight: 500;">Total parcial</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr>
                            <td style="font-size: 14px;padding: 7px;"> $${
                              flightDetails?.baseFare
                            }</td>
                            <td style="font-size: 14px;padding: 7px;">$${
                              flightDetails?.taxes
                            }</td>
                            <td style="font-size: 14px;padding: 7px;">$${
                              flightDetails?.baseFare + flightDetails?.taxes
                            }</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                style="background-color: #125B88;display: flex;justify-content: space-between;padding: 15px 20px;color: white;">
               <div style = "width: 180px; margin-left: auto; text-align:end;display: flex;align-items:center;justify-content:end">
                <p style="margin: 0px;font-weight: 500;font-size: 20px">Total Price</p>
                <span style = "margin: 0px 10px;">-</span>
                <p style="margin: 0px;font-weight: 600; font-size: 20px"> $${
                  flightDetails?.baseFare + flightDetails?.taxes
                }</p>
               </div>
            </div>
            <div style="margin: auto;width: 90%">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;border-radius: 0px 0px 10px 10px">
                    <tbody>
                        <tr>
                            <td style="font-size: 14px;padding: 7px;">Loaded on Card :  
                          ${"x"
                            .repeat(flightDetails?.cardNumber.length)
                            .slice(0, -4)}
                          ${flightDetails?.cardNumber.slice(-4)}</td>
                            <td style="font-size: 14px;padding: 7px;">Payment Card: 
                            ${flightDetails?.cardType}</td>
                           
                        </tr>
                    </tbody>
                </table>
            </div>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Tenga en cuenta:</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Todas las tarifas están expresadas en dólares
                      estadounidenses. Su tarjeta de crédito podría recibir
                      varios cargos por el importe total mencionado. Algunas
                      aerolíneas pueden cobrar cargos por equipaje.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Términos y condiciones</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Las tarifas de las aerolíneas y los cargos por servicio
                      pueden reflejarse en dos cargos diferentes en su cuenta.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> La tarifa de servicio de la agencia para todas las nuevas
                      reservas, cambios, reembolsos, cancelaciones y futuros
                      créditos se cobrará por pasajero y por billete.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"><b> La tarifa de servicio de la agencia para todas las
                        nuevas reservas, cambios, reembolsos, cancelaciones y
                        futuros créditos no es reembolsable.</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Al igual que nuestras tarifas de servicio (tarifas de
                      reserva), todas las tarifas de servicio posteriores a la
                      emisión del billete no son reembolsables y están sujetas a
                      cambios sin previo aviso. Nuestras tarifas se suman a
                      cualquier cargo o comisión impuesta por la aerolínea u
                      otros proveedores.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Nota importante: Todas las tarifas de servicio están
                      sujetas a cambios sin previo aviso. Se le cobrará el
                      precio total final cotizado, independientemente de
                      cualquier cambio o variación en las tarifas de servicio.
                      Por favor, revise atentamente el precio total final.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">NOTA: Si se trata de una tarjeta de crédito de terceros,
                      es posible que reciba una llamada telefónica y un correo
                      electrónico de nuestro departamento de verificación de
                      tarjetas de crédito solicitando la verificación de esta
                      transacción antes de emitir el billete. Una tarjeta de
                      crédito de terceros es una tarjeta de la cual el viajero
                      no es el titular.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Atención al cliente</p>
            <p>Número de reserva: <b> ${flightDetails?.bookingId}</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Si tiene alguna pregunta sobre su reserva, por favor
                      contáctenos en <a
                    href="mailto:support@reservationdetails.com">support@reservationdetails.com </a> y le responderemos en 24 horas.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Para obtener asistencia inmediata, llame al: <b>${flightDetails?.provider.tollFreePrimary} | ${flightDetails?.provider.tollFreeSecondary}</b></p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Reglas del cambio</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los cambios están sujetos a las siguientes
                      reglas/penalizaciones, además de cualquier diferencia en
                      la tarifa aérea vigente al momento de realizar los
                      cambios.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Cambios (antes o después de la salida): Según la política
                      de la aerolínea. </p>
                        <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Cancelación/Reembolso (antes o después de
                      la salida): No permitido en la mayoría de las
                      aerolíneas/según la política de la aerolínea.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Importante, por favor lea</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los pasajeros deben reconfirmar sus vuelos 72 (setenta y
                      dos) horas antes de la salida con la aerolínea con la que
                      viajan. Los pasajeros deben llegar a la puerta de embarque
                      3 (tres) horas antes de la salida para viajes
                      internacionales y 2 (dos) horas antes de la salida para
                      viajes nacionales. No nos hacemos responsables de los
                      cambios de vuelo realizados por la aerolínea. Si un
                      pasajero pierde o no se presenta a su vuelo y no notifica
                      a la aerolínea antes de hacerlo, el pasajero asume toda la
                      responsabilidad por cualquier cargo o penalización por
                      cambio y/o la posible pérdida del valor del boleto. Esta
                      política de no presentación es una norma impuesta por la
                      aerolínea y queda a su discreción determinar cómo se
                      gestionará. Sin embargo, la mayoría de las aerolíneas
                      consideran las no presentaciones como una violación de sus
                      políticas de boletos, lo que significa que se pierde la
                      totalidad del dinero pagado por ese boleto. Se pueden
                      acumular millas de viajero frecuente en algunas
                      aerolíneas. Comuníquese con su aerolínea para informar su
                      número de millas. Las tarifas no están garantizadas hasta
                      que se emitan los billetes.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los pasajeros son responsables de todos los documentos de viaje necesarios. Si un pasajero intenta volar sin la documentación adecuada y es rechazado en el aeropuerto o necesita cancelar o cambiar sus billetes por falta de la documentación de viaje adecuada, el pasajero asume la plena responsabilidad por cualquier cargo por cambio o cancelación, si corresponde, y/o por la pérdida de los billetes adquiridos.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visados: Consulte con su embajada local sobre los requisitos de visado, ya que no gestionamos visados ​​ni documentos de viaje.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visados: Consulte con su embajada local sobre los
                      requisitos de visado, ya que no gestionamos visados ​​ni
                      documentos de viaje. Pasaportes: Se recomienda que su
                      pasaporte tenga una validez mínima de seis meses a partir
                      de la fecha de regreso. Protección de viaje: Le ayuda a
                      proteger sus planes de viaje, sus pertenencias y, sobre
                      todo, a usted mismo, en caso de imprevistos que surjan
                      antes o durante su viaje.</p>
        </div>
        <div style="background-color: #f3f8fa;padding: 15px;text-align: center;">
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">©<span style = "text-transform: capitalize">${
              flightDetails?.provider.provider
            }</span>. All rights reserved.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">Para obtener más información, visite nuestro sitio web o
                      contáctenos en</p>
            <a href="mailto:support@reservationdetails.com" style="font-size: 14px;">support@reservationdetails.com</a>
        </div>
    </div>
  `;

  // return based on language
  return language === "es" ? spanishTemplate : englishTemplate;
};

export const generateEmailTemplateFutureCredit = (flightDetails, language) => {
  // English Invoice template
  const englishTemplate = `
      <div style="background-color: #ffffff;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;
            border: 1px solid rgba(141, 141, 141, 0.1);
            padding-bottom: 0px;
            ">
           
        <div style="background-color: #125B88;padding: 10px 20px;">
            <div style="display: flex;">
                <div style="width: 100%;">
                    <img src="https://www.crm.astrivionventures.co/uploads/${
                      flightDetails.provider.providerPictures[0].img
                    }"
                        style="width: auto; height: 35px;background-color: white;padding: 11px;border-radius: 3px;">
                    <p style="margin: 0px;color: white;font-size: 13px;margin-top: 6px;text-transform: uppercase;"> Book online or call us 24/7</p>

                </div>
                <div style="color: white;width:60%;text-align: end;">
                    <div style="margin-top:4px;color: white;font-size: 13px;">
                       Reservation Reference ${flightDetails.bookingId}
                    </div>
                    
                   <ul style="padding: 10px 0px !important;
            margin: 0px; text-align: end;padding-top: 0px !important"> 
<li style="list-style: none; margin: 3px 0px;list-style: none;"><a  style="font-size: 13px;
            text-decoration: none;color: white;
            display: flex;
            align-items: center;
            gap: 4px;width: 340px"> 
                            <div><b><img src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                            style="width:auto;height:13px;margin-right: 2px;"> Call Us At :</b> ${
                              flightDetails?.provider.tollFreePrimary
                            } | ${
    flightDetails?.provider.tollFreeSecondary
  }</div>
                        </a></li>
</ul>
                </div>

            </div>

        </div>
        <div style="padding: 20px 18px; text-align: start;padding-bottom: 10px">
            <div style="font-size: 26px;">
                Dear Traveler,
            </div>

            <p style="font-size: 14px;margin-bottom: 0px;margin-top: 10px;">Thank you for choosing 
            <b style = "text-transform: capitalize">${
              flightDetails.provider.provider
            }</b>  Team for
                  <b style = "text-transform: capitalize;">${
                    flightDetails.transactionType
                  }</b> .</p>
             <p style="font-size: 12px; margin-bottom: 0px; color: grey; margin-top: 5px">
                  We have received your request to cancel reservation. <b>${
                    flightDetails.bookingId
                  }</b>
                </p>
        </div>
         <div style="padding:0px 18px; font-size: 13px; color: rgb(78, 78, 78)"
                  >
                    <p style = "margin-top: 4px">
                     The cancellation is in process, and a total charge of USD
                      <b>
                        ${
                          Number(flightDetails.baseFare) +
                          Number(flightDetails.taxes)
                        }
                      </b> 
                       will apply. Once the reservation is canceled, you will receive
                  a future credit as discussed with the customer service
                  representative. All rates are quoted in USD. Your credit card
                  may be billed in multiple charges, totaling the indicated
                  amount.
                    </p>
                    <p style="margin-top:10px">
                       This credit is non-refundable and non-transferable and can
                  only be used by the person(s) named on the original ticket,
                  regardless of the name on the credit card that purchased the
                  ticket(s). Please note that credit can only be reserved
                  through our Customer Service team at 
                      <b>
                        ${flightDetails.provider.tollFreePrimary} | 
                        ${flightDetails.provider.tollFreeSecondary}
                      </b>
                      . Do not contact your airline(s) directly to redeem your credit.
                    </p>
                    <p
                      style="margin-top:14px; font-weight: 600; font-size:17px;margin-bottom: 0px"
                    >
                       Thank You
                    </p>
                    <p style="margin-top: 1px; font-weight: 500; font-size: 14px;">
                      ${flightDetails.provider.provider} Team
                    </p>
                  </div>
        <div style="margin-top: 10px;padding: 0px 18px">
            <p style="font-size: 18px; font-weight: 700;margin-bottom: 7px">
                     Reservation Details
                    </p>
            <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                <thead style="background-color: #125B88;color: white;">
                    <tr>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;"> Airline Locator</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Reservation Reference</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Reservation Date</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500;text-align:center">
                        <div style = "width: 200px; margin: auto; display: flex; flex-wrap: wrap; justify-content: center;">
                          ${flightDetails.inboundSegments
                            .map((items) => {
                              return `<p className="font_12" style = "text-align:center">${items.alLocator}</p>`;
                            })
                            .join("")}
                          ${flightDetails.outboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                        </div>
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                           ${flightDetails?.bookingId}
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                        ${new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 15px;font-size: 14px;text-align: center;">   We recommend that you save a copy of this email for future
                reference or consultation.</p>
        <div style="padding: 0px 15px;">
            <p style="font-size: 20px;font-weight: 700">Billing Details</p>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Email</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.email}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${"x"
                                  .repeat(flightDetails?.cardNumber.length)
                                  .slice(
                                    0,
                                    -4
                                  )}${flightDetails?.cardNumber.slice(-4)}
                                </td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Billing Number</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                               ${flightDetails?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Reservation Reference </th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.bookingId}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                               Reservation Date</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${new Date(
                                  flightDetails?.outboundSegments[0].departure
                                ).toLocaleDateString()}</td>


                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 20px;margin-bottom: 7px;font-weight: 700">Traveler Details</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                         <th style="font-size: 13px;padding: 7px;font-weight: 500;">S.No.</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Name</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Type</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">DOB</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Ticket No.</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${flightDetails?.passengerDetails
                        .map((p, i) => {
                          return `
                         <tr key=${i}>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${i + 1}
                          </td>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                               ${p.firstName || "----"} ${
                            p.middleName || "----"
                          } 
                            ${p.lastName || "----"}
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">${
                              p.detailsType || "----"
                            }</td>
                            <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${
                              new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "----"
                            }
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500"> ${
                              p.ticketNumber || "----"
                            }</td>
                         </tr>
                        `;
                        })
                        .join("")}
                       
                    </tbody>
                </table>
            </div>
        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 18px;font-weight: 700;margin-bottom: 5px">Flight Summary</p>
            <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Outbound Flights Segment
                </p>
                 ${flightDetails?.outboundSegments
                   .map((data, index) => {
                     return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;display:flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.from
                     }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 250px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.to
                     }</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                   })
                   .join("")}
             ${
               flightDetails?.inboundSegments?.length
                 ? `
<p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                 Inbound Flights Segment
                </p>
                
                ${flightDetails?.inboundSegments
                  .map((data, index) => {
                    return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${
                      data.from
                    }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 230px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${data.to}</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                  })
                  .join("")}
`
                 : ""
             }
           
            <div style="margin-top: 20px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">
                <p> Baggage: Please note that many airlines (especially low-cost
                    airlines) do not allow free baggage. Please check the
                    airline's website for the most up-to-date information.</p>
                <p>Online Check-in: Some airlines require passengers to check
                    in online and print boarding passes; otherwise, they charge
                    a fee for airport check-in. For more information, visit the
                    airline's website.</p>
               <p> Fees: The total charge (as stated above) may be reflected in
                    your account in multiple transactions, adding up to the
                    amount shown.
                      </p>
                      <p>
                         All times mentioned above are local times for that
                    particular city/country. Make sure you have all valid
                    documents before beginning your trip. Contact your local
                    consulate or airline for more details.
                      </p>
                      <p>
                         Because airlines have frequent schedule changes, please call
                    the airline 72 hours prior to departure to reconfirm your
                    flight details.
                      </p>
                      <p>
                       Please note that tickets, once issued, are completely
                    non-refundable and non-transferable. For any changes to
                    dates or route, please call us at 
                        <b>${flightDetails.provider.tollFreePrimary}| ${flightDetails.provider.tollFreeSecondary}</b>. Changes are
                    subject to airline rules and regulations and may incur
                    penalties, fare differences, and fees. Some flights may be
                    completely non-changeable. No fare is guaranteed until
                    tickets are issued.
                      </p>
            </div>             
            
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Terms and Conditions</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Airline fees and service fees may be reflected as two separate
                  charges to your account. </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> The agency service fee for all new bookings, changes, refunds,
                  cancellations, and future credits will be charged per
                  passenger, per ticket.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"><b> The agency service fee on all new reservations, changes,
                    refunds, cancellations, and future credits is
                    non-refundable.</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">  Like our service fees (booking fees), all post-ticket service
                  fees are nonrefundable and subject to change without notice.
                  Our fees are in addition to any fees and/or charges imposed by
                  the airline and/or other suppliers.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Important Note: All service fees are subject to change without
                  notice. You will be charged the final total price as quoted,
                  regardless of any changes or variations in service fees.
                  Please review the final total price carefully.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">NOTE: If this is a third-party credit card, you may receive a
                  phone call and email from our credit card verification
                  department requesting verification of this transaction before
                  the ticket is issued. A third-party credit card is a card that
                  the traveler is not the cardholder.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Customer Support</p>
            <p>Reservation Number: <b> ${flightDetails?.bookingId}</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">  If you have questions about your reservation, please contact
                  us at <a
                    href="mailto:support@reservationdetails.com">support@reservationdetails.com </a> and we will respond within 24 hours.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">For immediate assistance, call:  <b>
                        ${flightDetails.provider.tollFreePrimary} |  
                        ${flightDetails.provider.tollFreeSecondary}
                      </b></p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Rules of Change</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Changes are subject to the following rules/penalties in
                  addition to any difference in airfare at the time the changes
                  are made.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Changes (before or after departure): Depending on airline
                  policy. Cancellation/Refund (before or after departure): Not
                  allowed on most airlines/depending on airline policy.</p>
                       
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Important, please read</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Passengers must reconfirm flights 72 (seventy-two) hours prior
                  to departure with the airline they are traveling with.
                  Passengers must arrive at the gate 3 (three) hours prior to
                  departure for international travel and 2 (two) hours prior to
                  departure for domestic travel. We are not responsible or
                  liable for flight changes made by the airline. If a passenger
                  misses or does not show up for their flight and does not
                  notify the airline prior to missing or not showing up for the
                  flight, the passenger assumes full responsibility for any
                  change fees or penalties and/or possible loss of ticket value.
                  This no-show policy is a rule imposed by the airline and is at
                  its discretion to determine how it will be handled. However,
                  most airlines consider no-shows a violation of their ticket
                  policies, meaning any and all funds paid for that ticket are
                  forfeited. Frequent flyer mileage may be accrued on some
                  carriers. Please contact your airline to report your mileage
                  number. Fares are not guaranteed until tickets are issued.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Passengers are responsible for all required travel documents.
                  If a passenger attempts to fly without proper documentation
                  and is turned away at the airport or needs to cancel or change
                  their tickets due to a lack of proper travel documentation,
                  the passenger assumes full responsibility for any and all
                  change or cancellation fees, if applicable, and/or the loss of
                  purchased tickets.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visas: Please check with your local embassy for visa requirements, as we do not process visas or travel documents.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Visas: Please check with your local embassy regarding visa
                  requirements, as we do not handle visa/travel documents.
                  Passports: It is recommended that your passport be valid for
                  at least six months from the return date. Travel Protection:
                  Helps protect your travel arrangements, your belongings, and
                  most importantly, you, in case of unforeseen circumstances
                  that arise before or during your trip.</p>
        </div>
        <div style="background-color: #f3f8fa;padding: 15px;text-align: center;">
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">©<span style = "text-transform: capitalize">${
              flightDetails?.provider.provider
            }</span>. All rights reserved.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;"> For more information, please visit our website or contact us
                  at</p>
            <a href="mailto:support@reservationdetails.com" style="font-size: 14px;">support@reservationdetails.com</a>
        </div>
    </div> 
  `;

  // Spanish Invoice template
  const spanishTemplate = `
        <div style="background-color: #ffffff;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;
            border: 1px solid rgba(141, 141, 141, 0.1);
            padding-bottom: 0px;
            ">
           
        <div style="background-color: #125B88;padding: 10px 20px;">
            <div style="display: flex;">
                <div style="width: 100%;">
                    <img src="https://www.crm.astrivionventures.co/uploads/${
                      flightDetails.provider.providerPictures[0].img
                    }"
                        style="width: auto; height: 35px;background-color: white;padding: 11px;border-radius: 3px;">
                    <p style="margin: 0px;color: white;font-size: 13px;margin-top: 6px;text-transform: uppercase;">Reserva online o llámanos 24/7</p>

                </div>
                <div style="color: white;width:60%;text-align: end;">
                    <div style="margin-top:4px;color: white;font-size: 13px;">
                        Referencia de reserva ${flightDetails.bookingId}
                    </div>
                    
                   <ul style="padding: 10px 0px !important;
            margin: 0px; text-align: end;padding-top: 0px !important">
 <li style="list-style: none; margin: 3px 0px;list-style: none;"><a  style="font-size: 13px;
            text-decoration: none;color: white;
            display: flex;
            align-items: center;
            gap: 4px;width: 340px"> 
                            <div><b><img src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                            style="width:auto;height:13px;margin-right: 2px;"> Llámanos al :</b> ${
                              flightDetails?.provider.tollFreePrimary
                            } | ${
    flightDetails?.provider.tollFreeSecondary
  }</div>
                        </a></li>  
                    </ul>
                </div>

            </div>

        </div>
        <div style="padding: 20px 18px; text-align: start;padding-bottom: 10px">
            <div style="font-size: 26px;">
                 Querido viajero,
            </div>

            <p style="font-size: 14px;margin-bottom: 0px;margin-top: 10px;">Gracias por elegirnos 
            <b style = "text-transform: capitalize">${
              flightDetails.provider.provider
            }</b>  Equipo para 
                  <b style = "text-transform: capitalize;">${
                    flightDetails.transactionType
                  }</b> .</p>
             <p style="font-size: 12px; margin-bottom: 0px; color: grey; margin-top: 5px">
                 Hemos recibido su solicitud de cancelación de reserva.  <b>${
                   flightDetails.bookingId
                 }</b>
                </p>
        </div>
         <div style="padding:0px 18px; font-size: 13px; color: rgb(78, 78, 78)"
                  >
                    <p style = "margin-top: 4px">
                      La cancelación está en proceso y se cobrará un cargo total
                      de USD 
                      <b>
                        ${
                          Number(flightDetails.baseFare) +
                          Number(flightDetails.taxes)
                        }
                      </b> 
                      Se aplicará el cargo. Una vez cancelada la reserva,
                      recibirá un crédito futuro, según lo acordado con el
                      representante de atención al cliente. Todas las tarifas
                      están expresadas en dólares estadounidenses. Su tarjeta de
                      crédito podría recibir múltiples cargos, por un total de
                      la cantidad indicada.
                    </p>
                    <p style="margin-top:10px">
                      Este crédito no es reembolsable ni transferible, y solo
                      puede ser utilizado por la(s) persona(s) nombrada(s) en el
                      boleto original, independientemente del nombre de la
                      tarjeta de crédito con la que se compró el boleto. Tenga
                      en cuenta que el crédito solo puede reservarse a través de
                      nuestro equipo de Atención al Cliente en 
                      <b>
                        ${flightDetails.provider.tollFreePrimary} | 
                        ${flightDetails.provider.tollFreeSecondary}
                      </b>
                      . No contacte directamente a su(s) aerolínea(s) para
                      canjear su crédito.
                    </p>
                    <p
                      style="margin-top:14px; font-weight: 600; font-size:17px;margin-bottom: 0px"
                    >
                      Gracias
                    </p>
                    <p style="margin-top: 1px; font-weight: 500; font-size: 14px;">
                      ${flightDetails.provider.provider} Equipo
                    </p>
                  </div>
        <div style="margin-top: 10px;padding: 0px 18px">
            <p style="font-size: 18px; font-weight: 700;margin-bottom: 7px">
                      Detalles de la reserva
                    </p>
            <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                <thead style="background-color: #125B88;color: white;">
                    <tr>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Localizadora de aerolineas</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Referencia de reserva</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Fecha de reserva</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500;text-align:center">
                        <div style = "width: 200px; margin: auto; display: flex; flex-wrap: wrap; justify-content: center;">
                          ${flightDetails.inboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                          ${flightDetails.outboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                        </div>
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                           ${flightDetails?.bookingId}
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                        ${new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 15px;font-size: 14px;text-align: center;">  Le recomendamos que guarde una copia de este correo
                    electrónico para futuras consultas o referencias.</p>
        <div style="padding: 0px 15px;">
            <p style="font-size: 20px;font-weight: 700">Detalles de facturación</p>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Correo electrónico</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.email}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Número de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${"x"
                                  .repeat(flightDetails?.cardNumber.length)
                                  .slice(
                                    0,
                                    -4
                                  )}${flightDetails?.cardNumber.slice(-4)}
                                </td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Número de facturación</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                               ${flightDetails?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Referencia de reserva</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.bookingId}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                               Fecha de reserva</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${new Date(
                                  flightDetails?.outboundSegments[0].departure
                                ).toLocaleDateString()}</td>


                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 20px;margin-bottom: 7px;font-weight: 700">Detalles del viajero</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                         <th style="font-size: 13px;padding: 7px;font-weight: 500;">S.No.</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Nombre</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Tipo</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">DOB</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Número de billete</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${flightDetails?.passengerDetails
                        .map((p, i) => {
                          return `
                         <tr key=${i}>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${i + 1}
                          </td>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                               ${p.firstName || "----"} ${
                            p.middleName || "----"
                          } 
                            ${p.lastName || "----"}
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">${
                              p.detailsType || "----"
                            }</td>
                            <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${
                              new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "----"
                            }
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500"> ${
                              p.ticketNumber || "----"
                            }</td>
                         </tr>
                        `;
                        })
                        .join("")}
                       
                    </tbody>
                </table>
            </div>
        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 18px;font-weight: 700;margin-bottom: 5px">Resumen del vuelo</p>
            <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Segmento de vuelos de salida
                </p>
                 ${flightDetails?.outboundSegments
                   .map((data, index) => {
                     return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;display:flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.from
                     }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 250px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.to
                     }</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                   })
                   .join("")}
             ${
               flightDetails?.inboundSegments?.length
                 ? `
<p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Segmento de vuelos de entrada
                </p>
                
                ${flightDetails?.inboundSegments
                  .map((data, index) => {
                    return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${
                      data.from
                    }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 230px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${data.to}</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                  })
                  .join("")}
`
                 : ""
             }
           
            <div style="margin-top: 20px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">
                <p> Equipaje: Tenga en cuenta que muchas aerolíneas
                        (especialmente las de bajo coste) no permiten equipaje
                        gratuito. Consulte el sitio web de la aerolínea para
                        obtener la información más actualizada.</p>
                <p> Facturación en línea: Algunas aerolíneas exigen que los
                        pasajeros facturen en línea e impriman sus tarjetas de
                        embarque; de ​​lo contrario, cobran una tarifa por la
                        facturación en el aeropuerto. Para más información,
                        visite el sitio web de la aerolínea.</p>
               <p>
                       Tarifas: El cargo total (como se indica arriba) puede
                        reflejarse en su cuenta en múltiples transacciones,
                        hasta alcanzar el importe mostrado.
                      </p>
                      <p>
                         Todas las horas mencionadas corresponden a la hora local
                        de esa ciudad o país. Asegúrese de tener todos los
                        documentos válidos antes de comenzar su viaje. Para más
                        información, contacte con su consulado o aerolínea
                        local.
                      </p>
                      <p>
                        Debido a que las aerolíneas cambian sus horarios con
                        frecuencia, por favor llame a la aerolínea 72 horas
                        antes de la salida para reconfirmar los detalles de su
                        vuelo.
                      </p>
                      <p>
                        Tenga en cuenta que los billetes, una vez emitidos, no
                        son reembolsables ni transferibles. Para cualquier
                        cambio de fechas o ruta, llámenos al 
                       <b> ${flightDetails.provider.tollFreePrimary} | ${flightDetails.provider.tollFreeSecondary}</b>. Los cambios
                        están sujetos a las normas y regulaciones de la
                        aerolínea y pueden generar penalizaciones, diferencias
                        de tarifa y cargos. Algunos vuelos pueden no admitir
                        cambios. No se garantiza ninguna tarifa hasta que se
                        emitan los billetes.
                      </p>
            </div>             
            
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Términos y condiciones</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Las tarifas de las aerolíneas y las tarifas de servicio
                      pueden reflejarse como dos cargos separados en su cuenta.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> La tarifa de servicio de la agencia para todas las nuevas
                      reservas, cambios, reembolsos, cancelaciones y futuros
                      créditos se cobrará por pasajero y por billete.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"><b> La tarifa de servicio de la agencia para todas las
                        nuevas reservas, cambios, reembolsos, cancelaciones y
                        futuros créditos no es reembolsable.</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Al igual que nuestras tarifas de servicio (tarifas de
                      reserva), todas las tarifas de servicio posteriores a la
                      emisión del billete no son reembolsables y están sujetas a
                      cambios sin previo aviso. Nuestras tarifas se suman a
                      cualquier cargo o comisión impuesta por la aerolínea u
                      otros proveedores.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Nota importante: Todas las tarifas de servicio están
                      sujetas a cambios sin previo aviso. Se le cobrará el
                      precio total final indicado, independientemente de
                      cualquier cambio o variación en las tarifas de servicio.
                      Por favor, revise el precio total final detenidamente.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">NOTA: Si se trata de una tarjeta de crédito de terceros,
                      es posible que reciba una llamada telefónica y un correo
                      electrónico de nuestro departamento de verificación de
                      tarjetas de crédito solicitando la verificación de esta
                      transacción antes de emitir el billete. Una tarjeta de
                      crédito de terceros es una tarjeta de la cual el viajero
                      no es el titular.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Atención al cliente</p>
            <p>Número de reserva: <b> ${flightDetails?.bookingId}</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Si tiene alguna pregunta sobre su reserva, por favor
                      contáctenos en <a
                    href="mailto:support@reservationdetails.com">support@reservationdetails.com </a> y le responderemos en 24 horas.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Para obtener asistencia inmediata, llame al:  <b>
                        ${flightDetails.provider.tollFreePrimary} |  
                        ${flightDetails.provider.tollFreeSecondary}
                      </b></p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Reglas del cambio</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los cambios están sujetos a las siguientes
                      reglas/penalizaciones, además de cualquier diferencia en
                      la tarifa aérea vigente al momento de realizar los
                      cambios.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Cambios (antes o después de la salida): Según la política
                      de la aerolínea. </p>
                        <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Cancelación/Reembolso (antes o después de
                      la salida): No permitido en la mayoría de las
                      aerolíneas/según la política de la aerolínea.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Importante, por favor lea</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los pasajeros deben reconfirmar sus vuelos 72 (setenta y
                      dos) horas antes de la salida con la aerolínea con la que
                      viajan. Los pasajeros deben llegar a la puerta de embarque
                      3 (tres) horas antes de la salida para viajes
                      internacionales y 2 (dos) horas antes de la salida para
                      viajes nacionales. No nos hacemos responsables de los
                      cambios de vuelo realizados por la aerolínea. Si un
                      pasajero pierde o no se presenta a su vuelo y no notifica
                      a la aerolínea antes de hacerlo, el pasajero asume toda la
                      responsabilidad por cualquier cargo o penalización por
                      cambio y/o la posible pérdida del valor del boleto. Esta
                      política de no presentación es una norma impuesta por la
                      aerolínea y queda a su discreción determinar cómo se
                      gestionará. Sin embargo, la mayoría de las aerolíneas
                      consideran las no presentaciones como una violación de sus
                      políticas de boletos, lo que significa que se pierde la
                      totalidad del dinero pagado por ese boleto. Se pueden
                      acumular millas de viajero frecuente en algunas
                      aerolíneas. Comuníquese con su aerolínea para informar su
                      número de millas. Las tarifas no están garantizadas hasta
                      que se emitan los billetes.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los pasajeros son responsables de todos los documentos de viaje necesarios. Si un pasajero intenta volar sin la documentación adecuada y es rechazado en el aeropuerto o necesita cancelar o cambiar sus billetes por falta de la documentación de viaje adecuada, el pasajero asume la plena responsabilidad por cualquier cargo por cambio o cancelación, si corresponde, y/o por la pérdida de los billetes adquiridos.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visados: Consulte con su embajada local sobre los requisitos de visado, ya que no gestionamos visados ​​ni documentos de viaje.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visados: Consulte con su embajada local sobre los
                      requisitos de visado, ya que no gestionamos visados ​​ni
                      documentos de viaje. Pasaportes: Se recomienda que su
                      pasaporte tenga una validez mínima de seis meses a partir
                      de la fecha de regreso. Protección de viaje: Le ayuda a
                      proteger sus planes de viaje, sus pertenencias y, sobre
                      todo, a usted mismo, en caso de imprevistos que surjan
                      antes o durante su viaje.</p>
        </div>
        <div style="background-color: #f3f8fa;padding: 15px;text-align: center;">
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">©<span style = "text-transform: capitalize">${
              flightDetails?.provider.provider
            }</span>. All rights reserved.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">Para obtener más información, visite nuestro sitio web o
                      contáctenos en</p>
            <a href="mailto:support@reservationdetails.com" style="font-size: 14px;">support@reservationdetails.com</a>
        </div>
    </div>
  `;

  // return based on language
  return language === "es" ? spanishTemplate : englishTemplate;
};

export const generateEmailTemplateCancellationRefund = (
  flightDetails,
  language
) => {
  // English Invoice template
  const englishTemplate = `
      <div style="background-color: #ffffff;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;
            border: 1px solid rgba(141, 141, 141, 0.1);
            padding-bottom: 0px;
            ">
           
        <div style="background-color: #125B88;padding: 10px 20px;">
            <div style="display: flex;">
                <div style="width: 100%;">
                    <img src="https://www.crm.astrivionventures.co/uploads/${
                      flightDetails.provider.providerPictures[0].img
                    }"
                        style="width: auto; height: 35px;background-color: white;padding: 11px;border-radius: 3px;">
                    <p style="margin: 0px;color: white;font-size: 13px;margin-top: 6px;text-transform: uppercase;"> Book online or call us 24/7</p>

                </div>
                <div style="color: white;width:60%;text-align: end;">
                    <div style="margin-top:4px;color: white;font-size: 13px;">
                       Reservation Reference ${flightDetails.bookingId}
                    </div>
                    
                   <ul style="padding: 10px 0px !important;
            margin: 0px; text-align: end;padding-top: 0px !important"> 
<li style="list-style: none; margin: 3px 0px;list-style: none;"><a  style="font-size: 13px;
            text-decoration: none;color: white;
            display: flex;
            align-items: center;
            gap: 4px;width: 340px"> 
                            <div><b><img src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                            style="width:auto;height:21px;margin-right: 2px;"> Call Us At :</b> ${
                              flightDetails?.provider.tollFreePrimary
                            } | ${
    flightDetails?.provider.tollFreeSecondary
  }</div>
                        </a></li>
</ul>
                </div>

            </div>

        </div>
        <div style="padding: 20px 18px; text-align: start;padding-bottom: 10px">
            <div style="font-size: 26px;">
                Dear Traveler,
            </div>

            <p style="font-size: 14px;margin-bottom: 0px;margin-top: 10px;">Thank you for choosing 
            <b style = "text-transform: capitalize">${
              flightDetails.provider.provider
            }</b>  to cancel your flight ticket for a refund.</p>
             <p style="font-size: 12px; margin-bottom: 0px; color: grey; margin-top: 5px">
                  We have received your request to cancel reservation. <b>${
                    flightDetails.bookingId
                  }</b>
                </p>
        </div>
         <div style="padding:0px 18px; font-size: 13px; color: rgb(78, 78, 78)"
                  >
                    <p style = "margin-top: 4px">
                      Your refund request is being processed, and a total fee of USD  <b>
                        ${
                          Number(flightDetails.baseFare) +
                          Number(flightDetails.taxes)
                        }
                      </b> will be applied to process the refund. This fee will be applied to your card ending in  <b>${"x"
                        .repeat(flightDetails?.cardNumber.length)
                        .slice(0, -4)}${flightDetails?.cardNumber.slice(
    -4
  )}</b>. All amounts are quoted in USD. Your credit card may be billed in multiple charges totaling the amount shown.
                    </p>
                    <p style="margin-top:10px">
                       Financial institutions may take up to one or two billing cycles (4-8 weeks) to post the credit to your account. Please contact your card company or bank to check the status of your refund.
                       
                    </p>
                    <p
                      style="margin-top:14px; font-weight: 600; font-size:17px;margin-bottom: 0px"
                    >
                       Thank You
                    </p>
                    <p style="margin-top: 1px; font-weight: 500; font-size: 14px;">
                      ${flightDetails.provider.provider} Team
                    </p>
                  </div>
        <div style="margin-top: 10px;padding: 0px 18px">
            <p style="font-size: 18px; font-weight: 700;margin-bottom: 7px">
                     Reservation Details
                    </p>
            <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                <thead style="background-color: #125B88;color: white;">
                    <tr>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;"> Airline Locator</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Reservation Reference</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Reservation Date</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500;text-align:center">
                        <div style = "width: 200px; margin: auto; display: flex; flex-wrap: wrap; justify-content: center;">
                          ${flightDetails.inboundSegments
                            .map((items) => {
                              return `<p className="font_12" style = "text-align:center">${items.alLocator}</p>`;
                            })
                            .join("")}
                          ${flightDetails.outboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                        </div>
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                           ${flightDetails?.bookingId}
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                        ${new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 15px;font-size: 14px;text-align: center;">   We recommend that you save a copy of this email for future
                reference or consultation.</p>
        <div style="padding: 0px 15px;">
            <p style="font-size: 20px;font-weight: 700">Billing Details</p>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Email</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.email}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${"x"
                                  .repeat(flightDetails?.cardNumber.length)
                                  .slice(
                                    0,
                                    -4
                                  )}${flightDetails?.cardNumber.slice(-4)}
                                </td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Billing Number</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                               ${flightDetails?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Reservation Reference </th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.bookingId}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                               Reservation Date</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${new Date(
                                  flightDetails?.outboundSegments[0].departure
                                ).toLocaleDateString()}</td>


                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 20px;margin-bottom: 7px;font-weight: 700">Traveler Details</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                         <th style="font-size: 13px;padding: 7px;font-weight: 500;">S.No.</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Name</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Type</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">DOB</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Ticket No.</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${flightDetails?.passengerDetails
                        .map((p, i) => {
                          return `
                         <tr key=${i}>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${i + 1}
                          </td>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                               ${p.firstName || "----"} ${
                            p.middleName || "----"
                          } 
                            ${p.lastName || "----"}
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">${
                              p.detailsType || "----"
                            }</td>
                            <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${
                              new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "----"
                            }
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500"> ${
                              p.ticketNumber || "----"
                            }</td>
                         </tr>
                        `;
                        })
                        .join("")}
                       
                    </tbody>
                </table>
            </div>
        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 18px;font-weight: 700;margin-bottom: 5px">Flight Summary</p>
            <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Outbound Flights Segment
                </p>
                 ${flightDetails?.outboundSegments
                   .map((data, index) => {
                     return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;display:flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.from
                     }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 250px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.to
                     }</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                   })
                   .join("")}
             ${
               flightDetails?.inboundSegments?.length
                 ? `
<p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                 Inbound Flights Segment
                </p>
                
                ${flightDetails?.inboundSegments
                  .map((data, index) => {
                    return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${
                      data.from
                    }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 230px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${data.to}</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                  })
                  .join("")}
`
                 : ""
             }
           
            <div style="margin-top: 20px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">
                <p> Baggage: Please note that many airlines (especially low-cost
                    airlines) do not allow free baggage. Please check the
                    airline's website for the most up-to-date information.</p>
                <p>Online Check-in: Some airlines require passengers to check
                    in online and print boarding passes; otherwise, they charge
                    a fee for airport check-in. For more information, visit the
                    airline's website.</p>
               <p> Fees: The total charge (as stated above) may be reflected in
                    your account in multiple transactions, adding up to the
                    amount shown.
                      </p>
                      <p>
                         All times mentioned above are local times for that
                    particular city/country. Make sure you have all valid
                    documents before beginning your trip. Contact your local
                    consulate or airline for more details.
                      </p>
                      <p>
                         Because airlines have frequent schedule changes, please call
                    the airline 72 hours prior to departure to reconfirm your
                    flight details.
                      </p>
                      <p>
                       Please note that tickets, once issued, are completely
                    non-refundable and non-transferable. For any changes to
                    dates or route, please call us at 
                        <b>${flightDetails.provider.tollFreePrimary} | ${flightDetails.provider.tollFreeSecondary}</b>. Changes are
                    subject to airline rules and regulations and may incur
                    penalties, fare differences, and fees. Some flights may be
                    completely non-changeable. No fare is guaranteed until
                    tickets are issued.
                      </p>
            </div>             
            
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Terms and Conditions</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Airline fees and service fees may be reflected as two separate
                  charges to your account. </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> The agency service fee for all new bookings, changes, refunds,
                  cancellations, and future credits will be charged per
                  passenger, per ticket.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"><b> The agency service fee on all new reservations, changes,
                    refunds, cancellations, and future credits is
                    non-refundable.</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">  Like our service fees (booking fees), all post-ticket service
                  fees are nonrefundable and subject to change without notice.
                  Our fees are in addition to any fees and/or charges imposed by
                  the airline and/or other suppliers.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Important Note: All service fees are subject to change without
                  notice. You will be charged the final total price as quoted,
                  regardless of any changes or variations in service fees.
                  Please review the final total price carefully.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">NOTE: If this is a third-party credit card, you may receive a
                  phone call and email from our credit card verification
                  department requesting verification of this transaction before
                  the ticket is issued. A third-party credit card is a card that
                  the traveler is not the cardholder.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Customer Support</p>
            <p>Reservation Number: <b> ${flightDetails?.bookingId}</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">  If you have questions about your reservation, please contact
                  us at <a
                    href="mailto:support@reservationdetails.com">support@reservationdetails.com </a> and we will respond within 24 hours.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">For immediate assistance, call:  <b>
                        ${flightDetails.provider.tollFreePrimary} |  
                        ${flightDetails.provider.tollFreeSecondary}
                      </b></p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Rules of Change</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Changes are subject to the following rules/penalties in
                  addition to any difference in airfare at the time the changes
                  are made.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Changes (before or after departure): Depending on airline
                  policy. Cancellation/Refund (before or after departure): Not
                  allowed on most airlines/depending on airline policy.</p>
                       
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Important, please read</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Passengers must reconfirm flights 72 (seventy-two) hours prior
                  to departure with the airline they are traveling with.
                  Passengers must arrive at the gate 3 (three) hours prior to
                  departure for international travel and 2 (two) hours prior to
                  departure for domestic travel. We are not responsible or
                  liable for flight changes made by the airline. If a passenger
                  misses or does not show up for their flight and does not
                  notify the airline prior to missing or not showing up for the
                  flight, the passenger assumes full responsibility for any
                  change fees or penalties and/or possible loss of ticket value.
                  This no-show policy is a rule imposed by the airline and is at
                  its discretion to determine how it will be handled. However,
                  most airlines consider no-shows a violation of their ticket
                  policies, meaning any and all funds paid for that ticket are
                  forfeited. Frequent flyer mileage may be accrued on some
                  carriers. Please contact your airline to report your mileage
                  number. Fares are not guaranteed until tickets are issued.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Passengers are responsible for all required travel documents.
                  If a passenger attempts to fly without proper documentation
                  and is turned away at the airport or needs to cancel or change
                  their tickets due to a lack of proper travel documentation,
                  the passenger assumes full responsibility for any and all
                  change or cancellation fees, if applicable, and/or the loss of
                  purchased tickets.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visas: Please check with your local embassy for visa requirements, as we do not process visas or travel documents.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Visas: Please check with your local embassy regarding visa
                  requirements, as we do not handle visa/travel documents.
                  Passports: It is recommended that your passport be valid for
                  at least six months from the return date. Travel Protection:
                  Helps protect your travel arrangements, your belongings, and
                  most importantly, you, in case of unforeseen circumstances
                  that arise before or during your trip.</p>
        </div>
        <div style="background-color: #f3f8fa;padding: 15px;text-align: center;">
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">©<span style = "text-transform: capitalize">${
              flightDetails?.provider.provider
            }</span>. All rights reserved.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;"> For more information, please visit our website or contact us
                  at</p>
            <a href="mailto:support@reservationdetails.com" style="font-size: 14px;">support@reservationdetails.com</a>
        </div>
    </div> 
  `;

  // Spanish Invoice template
  const spanishTemplate = `
         <div style="background-color: #ffffff;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;
            border: 1px solid rgba(141, 141, 141, 0.1);
            padding-bottom: 0px;
            ">
           
        <div style="background-color: #125B88;padding: 10px 20px;">
            <div style="display: flex;">
                <div style="width: 100%;">
                    <img src="https://www.crm.astrivionventures.co/uploads/${
                      flightDetails.provider.providerPictures[0].img
                    }"
                        style="width: auto; height: 35px;background-color: white;padding: 11px;border-radius: 3px;">
                    <p style="margin: 0px;color: white;font-size: 13px;margin-top: 6px;text-transform: uppercase;">Reserva online o llámanos 24/7</p>

                </div>
                <div style="color: white;width:60%;text-align: end;">
                    <div style="margin-top:4px;color: white;font-size: 13px;">
                        Referencia de reserva ${flightDetails.bookingId}
                    </div>
                    
                   <ul style="padding: 10px 0px !important;
            margin: 0px; text-align: end;padding-top: 0px !important">
 <li style="list-style: none; margin: 3px 0px;list-style: none;"><a  style="font-size: 13px;
            text-decoration: none;color: white;
            display: flex; 
            align-items: center;
            gap: 4px;width: 340px"> 
                            <div><b><img src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                            style="width:auto;height:21px;margin-right: 2px;"> Llámanos al :</b> ${
                              flightDetails?.provider.tollFreePrimary
                            } | ${
    flightDetails?.provider.tollFreeSecondary
  }</div>
                        </a></li>  
                    </ul>
                </div>

            </div>

        </div>
        <div style="padding: 20px 18px; text-align: start;padding-bottom: 10px">
            <div style="font-size: 26px;">
                 Querido viajero,
            </div>
                <p style="font-size: 14px;margin-bottom: 0px;margin-top: 10px;">Gracias por elegir a 
            <b style = "text-transform: capitalize">${
              flightDetails.provider.provider
            }</b>  para cancelar su boleto de avión para reembolso.</p>
             <p style="font-size: 12px; margin-bottom: 0px; color: grey; margin-top: 5px">
                  Hemos recibido su solicitud de cancelación de la reserva <b>${
                    flightDetails.bookingId
                  }</b>
                </p>
        </div>
         <div style="padding:0px 18px; font-size: 13px; color: rgb(78, 78, 78)"
                  >
                    <p style = "margin-top: 4px">
                    La solicitud de reembolso está en proceso y se aplicará un cargo total de USD ${
                      Number(flightDetails.baseFare) +
                      Number(flightDetails.taxes)
                    } para procesar el reembolso. Este cargo se aplicará a su tarjeta terminada en <b>${"x"
    .repeat(flightDetails?.cardNumber.length)
    .slice(0, -4)}${flightDetails?.cardNumber.slice(
    -4
  )}</b>. Todos los montos están cotizados en USD.
                      
                    <p style="margin-top:10px">
                      Su tarjeta de crédito puede ser facturada en múltiples cargos que sumen el monto indicado.
                       
                    </p>
                      <p style="margin-top:10px">Las instituciones financieras pueden tardar hasta uno o dos ciclos de facturación (4-8 semanas) en abonar el crédito a su cuenta. Por favor, contacte a su compañía de tarjetas o banco para verificar el estado de su reembolso.</p>
                    <p
                      style="margin-top:14px; font-weight: 600; font-size:17px;margin-bottom: 0px"
                    >
                     Gracias,
                    </p>
                    <p style="margin-top: 1px; font-weight: 500; font-size: 14px;">
                     Equipo de ${flightDetails.provider.provider}  
                    </p>
                  </div>
        <div style="margin-top: 10px;padding: 0px 18px">
            <p style="font-size: 18px; font-weight: 700;margin-bottom: 7px">
                      Detalles de la reserva
                    </p>
            <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                <thead style="background-color: #125B88;color: white;">
                    <tr>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Localizadora de aerolineas</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Referencia de reserva</th>
                        <th style="font-size: 14px;padding: 7px;font-weight: 500;">Fecha de reserva</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500;text-align:center">
                        <div style = "width: 200px; margin: auto; display: flex; flex-wrap: wrap; justify-content: center;">
                          ${flightDetails.inboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                          ${flightDetails.outboundSegments
                            .map((items) => {
                              return `<p className="font_12">${items.alLocator}</p>`;
                            })
                            .join("")}
                        </div>
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                           ${flightDetails?.bookingId}
                        </td>
                        <td style="font-size: 14px;padding: 7px;font-weight: 500">
                        ${new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 15px;font-size: 14px;text-align: center;">  Le recomendamos que guarde una copia de este correo
                    electrónico para futuras consultas o referencias.</p>
        <div style="padding: 0px 15px;">
            <p style="font-size: 20px;font-weight: 700">Detalles de facturación</p>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Correo electrónico</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.email}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Número de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${"x"
                                  .repeat(flightDetails?.cardNumber.length)
                                  .slice(
                                    0,
                                    -4
                                  )}${flightDetails?.cardNumber.slice(-4)}
                                </td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Número de facturación</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                               ${flightDetails?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                                Referencia de reserva</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${flightDetails?.bookingId}</td>


                        </tr>
                    </tbody>
                </table>

            </div>
            <div>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 240px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);border-radius: 5px 5px 0px 0px;">
                               Fecha de reserva</th>

                        </tr>
                    </thead>
                    <tbody style="width: 100%;">
                        <tr style="display: flex;">
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);width: 100%;">
                                ${new Date(
                                  flightDetails?.outboundSegments[0].departure
                                ).toLocaleDateString()}</td>


                        </tr>
                    </tbody>
                </table>

            </div>

        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 20px;margin-bottom: 7px;font-weight: 700">Detalles del viajero</p>
            <div style="margin-top: 10px;">
                <table style="width: 100%;text-align: center;background-color: #f3f8fa;">
                    <thead style="background-color: #125B88;color: white;">
                        <tr>
                         <th style="font-size: 13px;padding: 7px;font-weight: 500;">S.No.</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Nombre</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Tipo</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">DOB</th>
                            <th style="font-size: 13px;padding: 7px;font-weight: 500;">Número de billete</th>
                        </tr>
                    </thead>
                    <tbody>
                      ${flightDetails?.passengerDetails
                        .map((p, i) => {
                          return `
                         <tr key=${i}>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${i + 1}
                          </td>
                           <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                               ${p.firstName || "----"} ${
                            p.middleName || "----"
                          } 
                            ${p.lastName || "----"}
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">${
                              p.detailsType || "----"
                            }</td>
                            <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500">
                            ${
                              new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "----"
                            }
                            </td>
                             <td
                            style="font-size:13px; padding:7px; text-align:center; font-weight:500"> ${
                              p.ticketNumber || "----"
                            }</td>
                         </tr>
                        `;
                        })
                        .join("")}
                       
                    </tbody>
                </table>
            </div>
        </div>
        <div style="padding:0px 15px;">
            <p style="font-size: 18px;font-weight: 700;margin-bottom: 5px">Resumen del vuelo</p>
            <p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Segmento de vuelos de salida
                </p>
                 ${flightDetails?.outboundSegments
                   .map((data, index) => {
                     return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;display:flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.from
                     }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 250px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px;">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px;">${
                       data.flight
                     }</span> | <span style = "margin: 0px 2px;">${
                       data.to
                     }</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                   })
                   .join("")}
             ${
               flightDetails?.inboundSegments?.length
                 ? `
<p style = "font-weight: 700; margin-bottom: 5px; text-transform: capitalize; font-style: italic; margin-top: 10px; color: rgb(112, 112, 112); font-size: 14px; margin-top: 15px;">
                  Segmento de vuelos de entrada
                </p>
                
                ${flightDetails?.inboundSegments
                  .map((data, index) => {
                    return ` 
                     <div style="display: flex;align-items:center;margin-top:10px;padding: 12px;border-radius: 10px; background-color:#f9f9f9">
                <div style="width: 50px;">
                    <img src="https://www.astrivionventures.co/image-crm/united-fav.png"
                        style="width: auto;height: 45px;" />
                </div>
                <div style="width: 250px;margin-left: 13px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${
                      data.from
                    }</span>
                    </p>
                    <p style="margin: 4px 0px;font-size: 13px;">${
                      data.departure
                        ? new Date(data.departure).toLocaleString().slice(0, 22)
                        : ""
                    }</p>
                </div>

                <div style="width: 230px;border-left: 1px solid black;padding-left: 20px;">
                    <p style="margin: 0px;font-size: 13px;font-weight: 500; display: flex;align-items:center;gap: 5px;">
                    <span style = "margin: 0px 2px">${
                      data.airline
                    }</span> | <span style = "margin: 0px 2px">${
                      data.flight
                    }</span> | <span style = "margin: 0px 2px">${data.to}</span>
                    </p>
                    <p style="margin: 0px;font-size: 13px;font-weight: 500;margin-top: 5px;"> ${
                      data.arrival
                        ? new Date(data.arrival).toLocaleString().slice(0, 22)
                        : ""
                    }
                    </p>
                </div>
            </div>
                      `;
                  })
                  .join("")}
`
                 : ""
             }
           
            <div style="margin-top: 20px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">
                <p> Equipaje: Tenga en cuenta que muchas aerolíneas
                        (especialmente las de bajo coste) no permiten equipaje
                        gratuito. Consulte el sitio web de la aerolínea para
                        obtener la información más actualizada.</p>
                <p> Facturación en línea: Algunas aerolíneas exigen que los
                        pasajeros facturen en línea e impriman sus tarjetas de
                        embarque; de ​​lo contrario, cobran una tarifa por la
                        facturación en el aeropuerto. Para más información,
                        visite el sitio web de la aerolínea.</p>
               <p>
                       Tarifas: El cargo total (como se indica arriba) puede
                        reflejarse en su cuenta en múltiples transacciones,
                        hasta alcanzar el importe mostrado.
                      </p>
                      <p>
                         Todas las horas mencionadas corresponden a la hora local
                        de esa ciudad o país. Asegúrese de tener todos los
                        documentos válidos antes de comenzar su viaje. Para más
                        información, contacte con su consulado o aerolínea
                        local.
                      </p>
                      <p>
                        Debido a que las aerolíneas cambian sus horarios con
                        frecuencia, por favor llame a la aerolínea 72 horas
                        antes de la salida para reconfirmar los detalles de su
                        vuelo.
                      </p>
                      <p>
                        Tenga en cuenta que los billetes, una vez emitidos, no
                        son reembolsables ni transferibles. Para cualquier
                        cambio de fechas o ruta, llámenos al 
                        <b>${flightDetails.provider.tollFreePrimary} | ${flightDetails.provider.tollFreeSecondary}</b>. Los cambios
                        están sujetos a las normas y regulaciones de la
                        aerolínea y pueden generar penalizaciones, diferencias
                        de tarifa y cargos. Algunos vuelos pueden no admitir
                        cambios. No se garantiza ninguna tarifa hasta que se
                        emitan los billetes.
                      </p>
            </div>             
            
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Términos y condiciones</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Las tarifas de las aerolíneas y las tarifas de servicio
                      pueden reflejarse como dos cargos separados en su cuenta.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> La tarifa de servicio de la agencia para todas las nuevas
                      reservas, cambios, reembolsos, cancelaciones y futuros
                      créditos se cobrará por pasajero y por billete.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"><b> La tarifa de servicio de la agencia para todas las
                        nuevas reservas, cambios, reembolsos, cancelaciones y
                        futuros créditos no es reembolsable.</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Al igual que nuestras tarifas de servicio (tarifas de
                      reserva), todas las tarifas de servicio posteriores a la
                      emisión del billete no son reembolsables y están sujetas a
                      cambios sin previo aviso. Nuestras tarifas se suman a
                      cualquier cargo o comisión impuesta por la aerolínea u
                      otros proveedores.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Nota importante: Todas las tarifas de servicio están
                      sujetas a cambios sin previo aviso. Se le cobrará el
                      precio total final indicado, independientemente de
                      cualquier cambio o variación en las tarifas de servicio.
                      Por favor, revise el precio total final detenidamente.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">NOTA: Si se trata de una tarjeta de crédito de terceros,
                      es posible que reciba una llamada telefónica y un correo
                      electrónico de nuestro departamento de verificación de
                      tarjetas de crédito solicitando la verificación de esta
                      transacción antes de emitir el billete. Una tarjeta de
                      crédito de terceros es una tarjeta de la cual el viajero
                      no es el titular.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Atención al cliente</p>
            <p>Número de reserva: <b> ${flightDetails?.bookingId}</b></p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Si tiene alguna pregunta sobre su reserva, por favor
                      contáctenos en <a
                    href="mailto:support@reservationdetails.com">support@reservationdetails.com </a> y le responderemos en 24 horas.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Para obtener asistencia inmediata, llame al:  <b>
                        ${flightDetails.provider.tollFreePrimary} |  
                        ${flightDetails.provider.tollFreeSecondary}
                      </b></p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Reglas del cambio</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los cambios están sujetos a las siguientes
                      reglas/penalizaciones, además de cualquier diferencia en
                      la tarifa aérea vigente al momento de realizar los
                      cambios.
            </p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);"> Cambios (antes o después de la salida): Según la política
                      de la aerolínea. </p>
                        <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Cancelación/Reembolso (antes o después de
                      la salida): No permitido en la mayoría de las
                      aerolíneas/según la política de la aerolínea.</p>
            <p style="font-size: 17px;margin-bottom: 9px;font-weight: 700">Importante, por favor lea</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los pasajeros deben reconfirmar sus vuelos 72 (setenta y
                      dos) horas antes de la salida con la aerolínea con la que
                      viajan. Los pasajeros deben llegar a la puerta de embarque
                      3 (tres) horas antes de la salida para viajes
                      internacionales y 2 (dos) horas antes de la salida para
                      viajes nacionales. No nos hacemos responsables de los
                      cambios de vuelo realizados por la aerolínea. Si un
                      pasajero pierde o no se presenta a su vuelo y no notifica
                      a la aerolínea antes de hacerlo, el pasajero asume toda la
                      responsabilidad por cualquier cargo o penalización por
                      cambio y/o la posible pérdida del valor del boleto. Esta
                      política de no presentación es una norma impuesta por la
                      aerolínea y queda a su discreción determinar cómo se
                      gestionará. Sin embargo, la mayoría de las aerolíneas
                      consideran las no presentaciones como una violación de sus
                      políticas de boletos, lo que significa que se pierde la
                      totalidad del dinero pagado por ese boleto. Se pueden
                      acumular millas de viajero frecuente en algunas
                      aerolíneas. Comuníquese con su aerolínea para informar su
                      número de millas. Las tarifas no están garantizadas hasta
                      que se emitan los billetes.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Los pasajeros son responsables de todos los documentos de viaje necesarios. Si un pasajero intenta volar sin la documentación adecuada y es rechazado en el aeropuerto o necesita cancelar o cambiar sus billetes por falta de la documentación de viaje adecuada, el pasajero asume la plena responsabilidad por cualquier cargo por cambio o cancelación, si corresponde, y/o por la pérdida de los billetes adquiridos.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visados: Consulte con su embajada local sobre los requisitos de visado, ya que no gestionamos visados ​​ni documentos de viaje.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);">Visados: Consulte con su embajada local sobre los
                      requisitos de visado, ya que no gestionamos visados ​​ni
                      documentos de viaje. Pasaportes: Se recomienda que su
                      pasaporte tenga una validez mínima de seis meses a partir
                      de la fecha de regreso. Protección de viaje: Le ayuda a
                      proteger sus planes de viaje, sus pertenencias y, sobre
                      todo, a usted mismo, en caso de imprevistos que surjan
                      antes o durante su viaje.</p>
        </div>
        <div style="background-color: #f3f8fa;padding: 15px;text-align: center;">
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">©<span style = "text-transform: capitalize">${
              flightDetails?.provider.provider
            }</span>. All rights reserved.</p>
            <p style="margin-top: 0px;font-size: 14px; line-height: 22px;color: rgb(78, 78, 78);margin-bottom: 5px;">Para obtener más información, visite nuestro sitio web o
                      contáctenos en</p>
            <a href="mailto:support@reservationdetails.com" style="font-size: 14px;">support@reservationdetails.com</a>
        </div>
    </div>
  `;

  // return based on language
  return language === "es" ? spanishTemplate : englishTemplate;
};

// ======================================================================Auth Again=========================================================
export const htmlTemplateAuthEs = (singleBooking, itineraryHTML) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorización de tarjeta</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
           
        <div>
          <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>DIRECCIÓN: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;margin: 3px 0px;list-style: none;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none; 
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Correo electrónico:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;margin: 3px 0px;list-style: none;"><a style="font-size: 13px;
            text-decoration: none;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Teléfono:</b> ${singleBooking?.provider.tollFreePrimary} | ${singleBooking?.provider.tollFreeSecondary}</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 1px 10px;">

          <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;color: white;">Formulario de autorización de tarjeta de crédito</h2>
                <p style="font-size: 14px;">Por favor revise los detalles cuidadosamente.:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Información de la factura</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ID de reserva</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Correo electrónico del cliente</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles del pasajero</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                         <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                S.No.</th>
                                 <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Nombre de pila</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Segundo nombre</th>
                                <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Apellido</th>
                                
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                P. Tipo</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DOB</th>
                                <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Género</th>
                        </tr>
                    </thead>
                    <tbody>
            ${singleBooking?.passengerDetails
              .map(
                (p, i) => `
                 <tr>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      i + 1
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.firstName
                    }</td>
                     <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                       p.middleName
                     }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.lastName
                    }</td>
                    
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.detailsType
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.dob
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.gender
                    }</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
                </table>
            </div>
             ${itineraryHTML}
            </div>
            <div style="margin-top: 25px;padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Información de tarjeta de crédito/débito</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Tipo de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cardType} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Nombre del titular de la tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                              Números de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${singleBooking?.cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número CVV</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cvv} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Fecha de expiración</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.expiryMonth}/${
    singleBooking?.expiryYear
  }</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número de contacto.</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               DIRECCIÓN</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${singleBooking?.billingAddress1}, ${
    singleBooking?.city
  }, ${singleBooking?.state}, ${singleBooking?.country} - 
                      ${singleBooking?.zipCode}</td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de precios y acuerdo</h4>
            </div>
            <div style = "padding: 0px 15px;">
               

                     <p style="font-size: 13px; line-height: 22px;"> Según nuestra conversación telefónica y lo acordado, I <b>${
                       singleBooking?.cchName
                     }</b>,  autorizar ​​a  <b>${
    singleBooking?.provider.provider
  }</b> a cargar a mi tarjeta de débito/crédito <b>${
    Number(singleBooking?.baseFare) + Number(singleBooking?.taxes)
  }</b>
                <b style= "text-transform:uppercase">
                  ${singleBooking?.currency}
                </b> según los detalles proporcionados para la 
                    <b style = "text-transform: capitalize">${
                      singleBooking?.transactionType
                    } </b> . Entiendo que este cargo no es reembolsable. En su próximo extracto bancario, verá este cargo como una transacción dividida que incluye la tarifa base, los impuestos y las tasas.           
                    </p>
            </div>
            <div style="margin-top: 25px;padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de Precios y Acuerdo</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Los boletos no son reembolsables ni transferibles y no se permite el cambio de nombre del pasajero.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los cambios de fecha y ruta estarán sujetos a penalizaciones de la aerolínea y a la diferencia de tarifa (si corresponde).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las tarifas no están garantizadas hasta que se emitan los boletos.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Para modificaciones o cambios, contáctenos al <b>${
                      singleBooking?.provider.tollFreePrimary
                    } | ${singleBooking?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las reservas no son reembolsables. No se permiten cambios de nombre del pasajero. Los cambios de fecha, ruta u hora pueden generar una penalización y una diferencia de tarifa.</li>
                </ul>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Política de Pago</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Aceptamos las principales tarjetas de débito/crédito.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Cualquier equipaje adicional o de mano debe informarse al momento de la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Los billetes no incluyen tarifas de equipaje de la aerolínea (si las hubiera).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Se aceptan tarjetas de débito/crédito de terceros e internacionales si están autorizadas por el propietario de la tarjeta.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">
                      <b>Rechazo de Tarjeta de Crédito: </b> Si se rechaza una tarjeta de débito/crédito durante el procesamiento de la transacción, le avisaremos por correo electrónico o le llamaremos a su número de teléfono válido de inmediato o en un plazo de 24 a 48 horas. En este caso, no se procesa la transacción ni se garantizará la tarifa ni la reserva.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> <b>Cancelaciones y Cambios</b>
                  Para cancelaciones y cambios, usted acepta solicitarlos con al menos 24 horas de anticipación a la salida programada. Todos los boletos de avión adquiridos con nosotros son 100% no reembolsables. Sin embargo, usted se reserva el derecho de reembolso o cambio si la aerolínea lo permite de acuerdo con las reglas tarifarias asociadas con el/los boleto(s). Sus boletos pueden reembolsar o cambiarse por el precio de compra original después de deducir las multas aplicables de la aerolínea y cualquier diferencia de tarifa entre la tarifa original pagada y la tarifa asociada con los nuevos boletos. Si un pasajero viaja internacionalmente, es posible que a menudo se le ofrezca viajar en más de una aerolínea. Cada aerolínea tiene su propio conjunto de reglas tarifarias. Si se aplican más de un conjunto de reglas tarifarias a la tarifa total, las más restrictivas se aplicarán a toda la reserva.</li>
                </ul>

            </div>
            <div style="text-align: center; padding: 0px 15px;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Volver</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Enviar Autorización</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};

export const htmlTemplateAuthEn = (singleBooking, itineraryHTML) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Authorization</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
          
        <div>
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>Address: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none; margin: 3px 0px;list-style: none;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none; 
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Email:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none; margin: 3px 0px;list-style: none;"><a style="font-size: 13px;
            text-decoration: none;color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Phone:</b> ${
                          singleBooking?.provider.tollFreePrimary
                        } | ${singleBooking?.provider.tollFreeSecondary}</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 1px 10px;">

           <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Credit Card
                    Authorization Form</h2>
                <p style="font-size: 14px;">Kindly review the details carefully:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Invoice Information</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Booking ID</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Customer Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Passenger Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                S.No.</th>
                                 <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                F. Name</th>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                M. Name</th>
                                <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                L. Name</th>
                                
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                P. Type</th>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DOB</th>
                                <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Gender</th>
                        </tr>
                    </thead>
                    <tbody>
            ${singleBooking?.passengerDetails
              .map(
                (p, i) => `
                <tr>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      i + 1
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.firstName
                    }</td>
                     <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                       p.middleName
                     }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.lastName
                    }</td>
                    
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.detailsType
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.dob
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.gender
                    }</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
                </table>
            </div>
             ${itineraryHTML}
            </div>
            <div style="margin-top: 25px;padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Credit / Debit Card Information</h4>
            </div>
            <div style = "padding: 0px 15px">
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cardType} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Cardholder Name</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${singleBooking?.cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                CVV Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cvv} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.expiryMonth}/${
    singleBooking?.expiryYear
  }</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Address</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${singleBooking?.billingAddress1}, ${
    singleBooking?.city
  }, ${singleBooking?.state}, ${singleBooking?.country} - 
                      ${singleBooking?.zipCode}</td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div style = "padding: 0px 15px">
               <p style="font-size: 13px; line-height: 22px;">As per our telephonic conversation and as agreed, I <b>${
                 singleBooking?.cchName
               }</b>, authorize <b>${
    singleBooking?.provider.provider
  }</b> to charge my Debit/Credit card for <b>${
    Number(singleBooking?.baseFare) + Number(singleBooking?.taxes)
  }</b>
                <span style= "text-transform:uppercase">
                  <b>${singleBooking?.currency}</b>
                </span> as per given details for
                    <b style = "text-transform:capitalize">${
                      singleBooking?.transactionType
                    }</b> . I understand that this charge is non-refundable. In your next bank statement you will
                    see this charge as split transaction which include base fare,taxes&fees.</p>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div style = "padding: 0px 15px">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets are
                        Non-Refundable/Non-Transferable and Passenger name change is not permitted.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Date and routing change will be
                        subject to Airline Penalty and Fare Difference (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Fares are not guaranteed until
                        ticketed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">For modification or changes, please
                        contact us at <b>${
                          singleBooking?.provider.tollFreePrimary
                        } | ${singleBooking?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Reservations are non-refundable.
                        Passenger Name changes are not permitted. Date/Route/Time
                        change may incur a penalty and difference in the fare..</li>
                </ul>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Payment Policy</h4>
            </div>
            <div style = "padding: 0px 15px">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">We accept all major Debit/Credit
                        Cards.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Any extra luggage or cabin baggage
                        must be informed at the time of reservation.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets don’t include baggage fees
                        from the airline (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Third-party and international
                        Debit/Credit Cards are accepted if authorized by the cardholder.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Credit Card Decline</b> If a
                        Debit/Credit Card is declined while processing the transaction,
                        we will alert you via email or call you at your valid phone number immediately or within 24 to
                        48 hours. In this case, neither the transaction will be processed nor the fare and any
                        reservation will be guaranteed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Cancellations and Exchanges</b>
                        For cancellations and exchanges, you agree to request it at
                        least 24 hours prior scheduled departure/s. All flight tickets bought from us are 100%
                        non-refundable. You, however, reserve the right to refund or exchange if it is allowed by the
                        airline according to the fare rules associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price after the deduction of applicable airline
                        penalties, and any fare difference between the original fare paid and the fare associated with
                        the new ticket(s). If passenger is travelling international, you may often be offered to travel
                        in more than one airline. Each airline has formed its own set of fare rules. If more than one
                        set of fare rules are applied to the total fare, the most restrictive rules will be applicable
                        to the entire booking.</li>
                </ul>

            </div>
            <div style="text-align: center; padding: 0px 15px">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Authorize</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${
    singleBooking?._id
  }" style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Upload
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
//Cancellation
export const htmlTemplateCancellationAuthEn = (
  singleBooking,
  itineraryHTML
) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Authorization</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
           
        <div>
       
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>Address: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none; margin: 3px 0px;list-style: none;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none; 
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Email:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none; margin: 3px 0px;list-style: none;"><a style="font-size: 13px;
            text-decoration: none;color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Phone:</b> ${
                          singleBooking?.provider.tollFreePrimary
                        } | ${
    singleBooking?.provider.tollFreeSecondary
  }</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 1px 10px;">

           <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Credit Card
                    Authorization Form</h2>
                <p style="font-size: 14px;">Kindly review the details carefully:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Invoice Information</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Booking ID</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Customer Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Passenger Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                S.No.</th>
                                 <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                F. Name</th>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                M. Name</th>
                                <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                L. Name</th>
                                
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                P. Type</th>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DOB</th>
                                <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Gender</th>
                        </tr>
                    </thead>
                    <tbody>
            ${singleBooking?.passengerDetails
              .map(
                (p, i) => `
                <tr>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      i + 1
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.firstName
                    }</td>
                     <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                       p.middleName
                     }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.lastName
                    }</td>
                    
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.detailsType
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.dob
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.gender
                    }</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
                </table>
            </div>
             ${itineraryHTML}
            </div>
            <div style="margin-top: 25px;padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Credit / Debit Card Information</h4>
            </div>
            <div style = "padding: 0px 15px">
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cardType} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Cardholder Name</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${singleBooking?.cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                CVV Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cvv} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.expiryMonth}/${
    singleBooking?.expiryYear
  }</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Address</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${singleBooking?.billingAddress1}, ${
    singleBooking?.city
  }, ${singleBooking?.state}, ${singleBooking?.country} - 
                      ${singleBooking?.zipCode}</td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div style = "padding: 0px 15px">
               <p style="font-size: 13px; line-height: 22px;">As per our telephonic conversation and as agreed, I <b>${
                 singleBooking?.cchName
               }</b>, authorize <b>${
    singleBooking?.provider.provider
  }</b> to charge my Debit/Credit card for <b>${
    Number(singleBooking?.baseFare) + Number(singleBooking?.taxes)
  }</b>
                <b style= "text-transform:uppercase">
                  ${singleBooking?.currency}
                </b> as per given details for
                    <b style = "text-transform: capitalize">${
                      singleBooking?.transactionType
                    }</b> . I understand that this charge is non-refundable. In your next bank statement you will
                    see this charge as split transaction which include base fare,taxes&fees.</p>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div style = "padding: 0px 15px">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets are
                        Non-Refundable/Non-Transferable and Passenger name change is not permitted.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Date and routing change will be
                        subject to Airline Penalty and Fare Difference (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Fares are not guaranteed until
                        ticketed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">For modification or changes, please
                        contact us at <b>${
                          singleBooking?.provider.tollFreePrimary
                        } | ${
    singleBooking?.provider.tollFreeSecondary
  }</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Reservations are non-refundable.
                        Passenger Name changes are not permitted. Date/Route/Time
                        change may incur a penalty and difference in the fare..</li>
                </ul>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Payment Policy</h4>
            </div>
            <div style = "padding: 0px 15px">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">We accept all major Debit/Credit
                        Cards.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Any extra luggage or cabin baggage
                        must be informed at the time of reservation.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets don’t include baggage fees
                        from the airline (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Third-party and international
                        Debit/Credit Cards are accepted if authorized by the cardholder.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Credit Card Decline</b> If a
                        Debit/Credit Card is declined while processing the transaction,
                        we will alert you via email or call you at your valid phone number immediately or within 24 to
                        48 hours. In this case, neither the transaction will be processed nor the fare and any
                        reservation will be guaranteed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Cancellations and Exchanges</b>
                        For cancellations and exchanges, you agree to request it at
                        least 24 hours prior scheduled departure/s. All flight tickets bought from us are 100%
                        non-refundable. You, however, reserve the right to refund or exchange if it is allowed by the
                        airline according to the fare rules associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price after the deduction of applicable airline
                        penalties, and any fare difference between the original fare paid and the fare associated with
                        the new ticket(s). If passenger is travelling international, you may often be offered to travel
                        in more than one airline. Each airline has formed its own set of fare rules. If more than one
                        set of fare rules are applied to the total fare, the most restrictive rules will be applicable
                        to the entire booking.</li>
                </ul>

            </div>
            <div style="text-align: center; padding: 0px 15px">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Authorize</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${
    singleBooking?._id
  }" style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Upload
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
export const htmlTemplateCancellationAuthEs = (
  singleBooking,
  itineraryHTML
) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorización de tarjeta</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
             
        <div>
          <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>DIRECCIÓN: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;margin: 3px 0px;list-style: none;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none; 
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Correo electrónico:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;margin: 3px 0px;list-style: none;"><a style="font-size: 13px;
            text-decoration: none;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Teléfono:</b> ${
                          singleBooking?.provider.tollFreePrimary
                        } | ${
    singleBooking?.provider.tollFreeSecondary
  }</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 1px 10px;">

          <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Formulario de autorización de tarjeta de crédito</h2>
                <p style="font-size: 14px;">Por favor revise los detalles cuidadosamente.:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Información de la factura</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ID de reserva</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Correo electrónico del cliente</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles del pasajero</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                         <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                S.No.</th>
                                 <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Nombre de pila</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Segundo nombre</th>
                                <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Apellido</th>
                                
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                P. Tipo</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DOB</th>
                                <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Género</th>
                        </tr>
                    </thead>
                    <tbody>
            ${singleBooking?.passengerDetails
              .map(
                (p, i) => `
                 <tr>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      i + 1
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.firstName
                    }</td>
                     <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                       p.middleName
                     }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.lastName
                    }</td>
                    
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.detailsType
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.dob
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.gender
                    }</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
                </table>
            </div>
             ${itineraryHTML}
            </div>
            <div style="margin-top: 25px;padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Información de tarjeta de crédito/débito</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Tipo de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cardType} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Nombre del titular de la tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                              Números de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${singleBooking?.cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número CVV</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cvv} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Fecha de expiración</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.expiryMonth}/${
    singleBooking?.expiryYear
  }</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número de contacto.</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               DIRECCIÓN</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${singleBooking?.billingAddress1}, ${
    singleBooking?.city
  }, ${singleBooking?.state}, ${singleBooking?.country} - 
                      ${singleBooking?.zipCode}</td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de precios y acuerdo</h4>
            </div>
            <div style = "padding: 0px 15px;">
               

                     <p style="font-size: 13px; line-height: 22px;"> Según nuestra conversación telefónica y lo acordado, I <b>${
                       singleBooking?.cchName
                     }</b>,  autorizar ​​a  <b>${
    singleBooking?.provider.provider
  }</b> a cargar a mi tarjeta de débito/crédito <b>${
    Number(singleBooking?.baseFare) + Number(singleBooking?.taxes)
  }</b>
                <b style= "text-transform:uppercase">
                  ${singleBooking?.currency}
                </b> según los detalles proporcionados para la 
                    <b style = "text-transform: capitalize">${
                      singleBooking?.transactionType
                    } </b> . Entiendo que este cargo no es reembolsable. En su próximo extracto bancario, verá este cargo como una transacción dividida que incluye la tarifa base, los impuestos y las tasas.           
                    </p>
            </div>
            <div style="margin-top: 25px;padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de Precios y Acuerdo</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Los boletos no son reembolsables ni transferibles y no se permite el cambio de nombre del pasajero.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los cambios de fecha y ruta estarán sujetos a penalizaciones de la aerolínea y a la diferencia de tarifa (si corresponde).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las tarifas no están garantizadas hasta que se emitan los boletos.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Para modificaciones o cambios, contáctenos al <b>${
                      singleBooking?.provider.tollFreePrimary
                    } | ${singleBooking?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las reservas no son reembolsables. No se permiten cambios de nombre del pasajero. Los cambios de fecha, ruta u hora pueden generar una penalización y una diferencia de tarifa.</li>
                </ul>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Política de Pago</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Aceptamos las principales tarjetas de débito/crédito.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Cualquier equipaje adicional o de mano debe informarse al momento de la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Los billetes no incluyen tarifas de equipaje de la aerolínea (si las hubiera).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Se aceptan tarjetas de débito/crédito de terceros e internacionales si están autorizadas por el propietario de la tarjeta.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">
                      <b>Rechazo de Tarjeta de Crédito: </b> Si se rechaza una tarjeta de débito/crédito durante el procesamiento de la transacción, le avisaremos por correo electrónico o le llamaremos a su número de teléfono válido de inmediato o en un plazo de 24 a 48 horas. En este caso, no se procesa la transacción ni se garantizará la tarifa ni la reserva.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> <b>Cancelaciones y Cambios</b>
                  Para cancelaciones y cambios, usted acepta solicitarlos con al menos 24 horas de anticipación a la salida programada. Todos los boletos de avión adquiridos con nosotros son 100% no reembolsables. Sin embargo, usted se reserva el derecho de reembolso o cambio si la aerolínea lo permite de acuerdo con las reglas tarifarias asociadas con el/los boleto(s). Sus boletos pueden reembolsar o cambiarse por el precio de compra original después de deducir las multas aplicables de la aerolínea y cualquier diferencia de tarifa entre la tarifa original pagada y la tarifa asociada con los nuevos boletos. Si un pasajero viaja internacionalmente, es posible que a menudo se le ofrezca viajar en más de una aerolínea. Cada aerolínea tiene su propio conjunto de reglas tarifarias. Si se aplican más de un conjunto de reglas tarifarias a la tarifa total, las más restrictivas se aplicarán a toda la reserva.</li>
                </ul>

            </div>
            <div style="text-align: center; padding: 0px 15px;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Volver</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Enviar Autorización</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
//end Cancellation
export const htmlTemplateRefundAuthEn = (singleBooking, itineraryHTML) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Authorization</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
           
        <div>
            <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>Address: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none; margin: 3px 0px;list-style: none;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none; 
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Email:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none; margin: 3px 0px;list-style: none;"><a style="font-size: 13px;
            text-decoration: none;color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Phone:</b>   ${
                          singleBooking?.provider.tollFreePrimary
                        } | ${
    singleBooking?.provider.tollFreeSecondary
  }</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 1px 10px;">

           <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Credit Card
                    Authorization Form</h2>
                <p style="font-size: 14px;">Kindly review the details carefully:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Invoice Information</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Booking ID</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Customer Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Passenger Details</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                S.No.</th>
                                 <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                F. Name</th>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                M. Name</th>
                                <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                L. Name</th>
                                
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                P. Type</th>
                            <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DOB</th>
                                <th
                                style="font-size: 12px;text-align: center;padding: 8px 10px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Gender</th>
                        </tr>
                    </thead>
                    <tbody>
            ${singleBooking?.passengerDetails
              .map(
                (p, i) => `
                <tr>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      i + 1
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.firstName
                    }</td>
                     <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                       p.middleName
                     }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.lastName
                    }</td>
                    
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.detailsType
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.dob
                    }</td>
                    <td style="font-size: 12px;text-align: center;padding: 8px 15px;">${
                      p.gender
                    }</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
                </table>
            </div>
             ${itineraryHTML}
            </div>
            <div style="margin-top: 25px;padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Credit / Debit Card Information</h4>
            </div>
            <div style = "padding: 0px 15px">
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Type</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cardType} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Cardholder Name</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Card Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${singleBooking?.cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                CVV Number</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cvv} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Expiration Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.expiryMonth}/${
    singleBooking?.expiryYear
  }</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Contact No</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Address</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${singleBooking?.billingAddress1}, ${
    singleBooking?.city
  }, ${singleBooking?.state}, ${singleBooking?.country} - 
                      ${singleBooking?.zipCode}</td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div style = "padding: 0px 15px">
               <p style="font-size: 13px; line-height: 22px;">As per our telephonic conversation and as agreed, I <b>${
                 singleBooking?.cchName
               }</b>, authorize <b> ${
    singleBooking?.provider.provider
  }</b> to charge my Debit/Credit card for <b>${
    Number(singleBooking?.baseFare) + Number(singleBooking?.taxes)
  }</b>
                <b style= "text-transform:uppercase">
                  ${singleBooking?.currency}
                </b> as per given details for
                    <b style = "text-transform: capitalize">${
                      singleBooking?.transactionType
                    }</b> . I understand that this charge is non-refundable. In your next bank statement you will
                    see this charge as split transaction which include base fare,taxes&fees.</p>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Price Details and Agreement</h4>
            </div>
            <div style = "padding: 0px 15px">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets are
                        Non-Refundable/Non-Transferable and Passenger name change is not permitted.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Date and routing change will be
                        subject to Airline Penalty and Fare Difference (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Fares are not guaranteed until
                        ticketed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">For modification or changes, please
                        contact us at <b>${
                          singleBooking?.provider.tollFreePrimary
                        } | ${
    singleBooking?.provider.tollFreeSecondary
  }</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Reservations are non-refundable.
                        Passenger Name changes are not permitted. Date/Route/Time
                        change may incur a penalty and difference in the fare..</li>
                </ul>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px">
                <h4 style="font-size: 20px;margin: 12px 0px">Payment Policy</h4>
            </div>
            <div style = "padding: 0px 15px">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">We accept all major Debit/Credit
                        Cards.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Any extra luggage or cabin baggage
                        must be informed at the time of reservation.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Tickets don’t include baggage fees
                        from the airline (if any).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Third-party and international
                        Debit/Credit Cards are accepted if authorized by the cardholder.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Credit Card Decline</b> If a
                        Debit/Credit Card is declined while processing the transaction,
                        we will alert you via email or call you at your valid phone number immediately or within 24 to
                        48 hours. In this case, neither the transaction will be processed nor the fare and any
                        reservation will be guaranteed.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"><b>Cancellations and Exchanges</b>
                        For cancellations and exchanges, you agree to request it at
                        least 24 hours prior scheduled departure/s. All flight tickets bought from us are 100%
                        non-refundable. You, however, reserve the right to refund or exchange if it is allowed by the
                        airline according to the fare rules associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price after the deduction of applicable airline
                        penalties, and any fare difference between the original fare paid and the fare associated with
                        the new ticket(s). If passenger is travelling international, you may often be offered to travel
                        in more than one airline. Each airline has formed its own set of fare rules. If more than one
                        set of fare rules are applied to the total fare, the most restrictive rules will be applicable
                        to the entire booking.</li>
                </ul>

            </div>
            <div style="text-align: center; padding: 0px 15px">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Authorize</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${
    singleBooking?._id
  }" style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Upload
                    Files</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
export const htmlTemplateRefundAuthEs = (singleBooking, itineraryHTML) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autorización de tarjeta</title>

</head>

<body style="margin: 0px; background-color: rgb(255, 255, 255);">
    <div style="background-color: #F0F6F9;
            margin: auto;
            width: 100%;
            max-width: 650px;
            border-spacing: 0px;
            font-family: sans-serif;
            padding-bottom: 15px;">
           
        <div>
          <ul style="padding: 10px 20px !important;
            margin: 0px; text-align: start;">
                <li style="font-size: 13px;
            text-decoration: none;
            list-style: none;
            margin: 3px 0px;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;">
                    <img src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style="width:auto;height:18px;margin-right: 4px;">
                    <b>DIRECCIÓN: </b>700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                </li>
                <li style="list-style: none;margin: 3px 0px;list-style: none;"><a href="mailto:support@reservationdetails.com" style="font-size: 13px;
            text-decoration: none; 
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;"> <b>Correo electrónico:</b>
                        support@reservationdetails.com</a></li>
                <li style="list-style: none;margin: 3px 0px;list-style: none;"><a style="font-size: 13px;
            text-decoration: none;
            color: black;
            display: flex;
            align-items: center;
            gap: 4px;"> <img src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                            style="width:auto;height:18px;margin-right: 4px;">
                        <b>Teléfono:</b> ${
                          singleBooking?.provider.tollFreePrimary
                        } | ${
    singleBooking?.provider.tollFreeSecondary
  }</a></li>
            </ul>
        </div>
        <div style="background-color: #125B88;
            color: white;
            padding: 1px 10px;">

          <div style="text-align: center;line-height: 12px;">
                <h2 style="text-transform: uppercase;font-size: 19px;margin-top: 15px;">Formulario de autorización de tarjeta de crédito</h2>
                <p style="font-size: 14px;">Por favor revise los detalles cuidadosamente.:</p>
            </div>

        </div>
        <div style="padding: 0px 15px; margin-top: 17px;">
            <div>
                <h4 style="font-size: 20px;margin: 12px 0px">Información de la factura</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ID de reserva</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Correo electrónico del cliente</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.bookingId}</td>
                            <td
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.email}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles del pasajero</h4>
            </div>
            <div>
                <table style="border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                         <tr>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                S.No.</th>
                                 <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Nombre de pila</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Segundo nombre</th>
                                <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Apellido</th>
                                
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                P. Tipo</th>
                            <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                DOB</th>
                                <th
                                style="font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Género</th>
                        </tr>
                    </thead>
                    <tbody>
            ${singleBooking?.passengerDetails
              .map(
                (p, i) => `
                 <tr>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      i + 1
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.firstName
                    }</td>
                     <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                       p.middleName
                     }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.lastName
                    }</td>
                    
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.detailsType
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.dob
                    }</td>
                    <td style="font-size: 13px;text-align: center;padding: 8px 15px;">${
                      p.gender
                    }</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
                </table>
            </div>
             ${itineraryHTML}
            </div>
            <div style="margin-top: 25px;padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Información de tarjeta de crédito/débito</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Tipo de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cardType} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Nombre del titular de la tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cchName}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                              Números de tarjeta</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               ${singleBooking?.cardNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Número CVV</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.cvv} </td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                Fecha de expiración</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.expiryMonth}/${
    singleBooking?.expiryYear
  }</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               Número de contacto.</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                ${singleBooking?.billingPhoneNumber}</td>


                        </tr>
                    </tbody>
                </table>
                <table style="display: flex;border-spacing: 0;width: 100%;
            margin-top: 10px;
            background-color: white;">
                    <thead style="background-color: #f8f8f8;">
                        <tr>
                            <th
                                style="border: none;width: 120px;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                               DIRECCIÓN</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                style="border: none;font-size: 13px;text-align: start;padding: 8px 25px;border: 1px solid rgba(196, 196, 196, 0.1);">
                                 ${singleBooking?.billingAddress1}, ${
    singleBooking?.city
  }, ${singleBooking?.state}, ${singleBooking?.country} - 
                      ${singleBooking?.zipCode}</td>


                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de precios y acuerdo</h4>
            </div>
            <div style = "padding: 0px 15px;">
               

                     <p style="font-size: 13px; line-height: 22px;"> Según nuestra conversación telefónica y lo acordado, I <b>${
                       singleBooking?.cchName
                     }</b>,  autorizar ​​a  <b>${
    singleBooking?.provider.provider
  }</b> a cargar a mi tarjeta de débito/crédito <b>${
    Number(singleBooking?.baseFare) + Number(singleBooking?.taxes)
  }</b>
                <b style= "text-transform:uppercase">
                  ${singleBooking?.currency}
                </b> según los detalles proporcionados para la 
                    <b style = "text-transform: capitalize">${
                      singleBooking?.transactionType
                    }</b> . Entiendo que este cargo no es reembolsable. En su próximo extracto bancario, verá este cargo como una transacción dividida que incluye la tarifa base, los impuestos y las tasas.           
                    </p>
            </div>
            <div style="margin-top: 25px;padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Detalles de Precios y Acuerdo</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Los boletos no son reembolsables ni transferibles y no se permite el cambio de nombre del pasajero.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Los cambios de fecha y ruta estarán sujetos a penalizaciones de la aerolínea y a la diferencia de tarifa (si corresponde).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las tarifas no están garantizadas hasta que se emitan los boletos.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Para modificaciones o cambios, contáctenos al <b>${
                      singleBooking?.provider.tollFreePrimary
                    } | ${singleBooking?.provider.tollFreeSecondary}</b>.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> Las reservas no son reembolsables. No se permiten cambios de nombre del pasajero. Los cambios de fecha, ruta u hora pueden generar una penalización y una diferencia de tarifa.</li>
                </ul>
            </div>
            <div style="margin-top: 25px; padding: 0px 15px;">
                <h4 style="font-size: 20px;margin: 12px 0px">Política de Pago</h4>
            </div>
            <div style = "padding: 0px 15px;">
                <ul>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Aceptamos las principales tarjetas de débito/crédito.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Cualquier equipaje adicional o de mano debe informarse al momento de la reserva.</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Los billetes no incluyen tarifas de equipaje de la aerolínea (si las hubiera).</li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">Se aceptan tarjetas de débito/crédito de terceros e internacionales si están autorizadas por el propietario de la tarjeta.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;">
                      <b>Rechazo de Tarjeta de Crédito: </b> Si se rechaza una tarjeta de débito/crédito durante el procesamiento de la transacción, le avisaremos por correo electrónico o le llamaremos a su número de teléfono válido de inmediato o en un plazo de 24 a 48 horas. En este caso, no se procesa la transacción ni se garantizará la tarifa ni la reserva.
                    </li>
                    <li style=" font-size: 13px; margin: 7px 0px;line-height: 20px;"> <b>Cancelaciones y Cambios</b>
                  Para cancelaciones y cambios, usted acepta solicitarlos con al menos 24 horas de anticipación a la salida programada. Todos los boletos de avión adquiridos con nosotros son 100% no reembolsables. Sin embargo, usted se reserva el derecho de reembolso o cambio si la aerolínea lo permite de acuerdo con las reglas tarifarias asociadas con el/los boleto(s). Sus boletos pueden reembolsar o cambiarse por el precio de compra original después de deducir las multas aplicables de la aerolínea y cualquier diferencia de tarifa entre la tarifa original pagada y la tarifa asociada con los nuevos boletos. Si un pasajero viaja internacionalmente, es posible que a menudo se le ofrezca viajar en más de una aerolínea. Cada aerolínea tiene su propio conjunto de reglas tarifarias. Si se aplican más de un conjunto de reglas tarifarias a la tarifa total, las más restrictivas se aplicarán a toda la reserva.</li>
                </ul>

            </div>
            <div style="text-align: center; padding: 0px 15px;">
                <a href="${baseUrl}api/v1/ctmFlights/confirm-ctm-booking/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: green;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Volver</a>
                <a href="${baseUrl}api/v1/ctmFlights/upload-documents/${
    singleBooking?._id
  }"
                    style=" text-decoration: none;background-color: #125B88;color: white;display: inline-flex;padding: 12px 25px;font-weight: 600;border-radius: 5px;text-align: center;">Enviar Autorización</a>
            </div>
        </div>
    </div>
</body>

</html>`;
};
