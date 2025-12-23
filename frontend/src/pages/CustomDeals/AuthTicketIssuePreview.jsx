import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { fontSize } from "@mui/system";

const AuthTicketIssuePreview = () => {
   const [language, setLanguage] = useState("en"); // "en" or "sp"
    const { state } = useLocation();
    const navigate = useNavigate();
    const { flightDetails } = state || {};
    const [bookingId, setBookingId] = useState("");
  
    useEffect(() => {
      let mounted = true;
      const fetchLastBooking = async () => {
        try {
          const res = await axios.get("/api/v1/ctmFlights/last-booking-id");
          const last = res?.data?.bookingId;
          let newId;
          if (last) {
            const m = last.match(/BID-(\d+)/);
            if (m && m[1]) {
              newId = `BID-${parseInt(m[1], 10) + 1}`;
            } else {
              newId = `BID-6566`;
            }
          } else {
            newId = `BID-6566`;
          }
          if (mounted) setBookingId(newId);
        } catch (err) {
          console.error("Error fetching last bookingId", err);
          if (mounted) setBookingId("BID-6566");
        }
      };
      fetchLastBooking();
      return () => {
        mounted = false;
      };
    }, []);
  
    const tollProvider = flightDetails?.tollFreeNumber?.find(
      (f) => f.provider === flightDetails?.provider
    );
  
    const tollNumber =
      language === "en"
        ? tollProvider?.tollFreePrimary
        : tollProvider?.tollFreeSecondary;
  
    const handleSendMail = async () => {
      try {
        const payload = {
          ...flightDetails,
          bookingId,
          language,
          tollNumber,
          provider: tollProvider,
        };
        console.log("herere payload", payload);
        await axios.post("/api/v1/ctmFlights/create-ctm-flight", payload);
        try {
          sessionStorage.removeItem("ctm_flightDetails");
        } catch (e) {
          // console.warn("Could not clear ctm_flightDetails from sessionStorage", e);
        }
        alert("Authorization Send Successfully!");
        navigate("/");
      } catch (error) {
        console.error(error);
        alert("Error Sending Authorization Form.");
      }
    };
  
    if (!flightDetails) return <div>No invoice data found.</div>;
  
    const renderFlightSegment = (segments, type) => (
      <div style={{ marginBottom: "20px" }}>
        {segments.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: "14px",
                marginTop: "10px",
                fontWeight: "600",
                marginBottom: "0px",
              }}
            >
              {type} Flights Segment
            </h4>
            <div className="table-responsive">
              {segments.map((seg, idx) => (
                <>
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "12px",
                      fontWeight: "500",
                      fontStyle: "italic",
                      color: "grey",
                    }}
                  >
                    {type} Flight {idx + 1}
                  </p>
                  <table
                    key={idx}
                    style={{
                      borderSpacing: "0",
                      width: "100%",
                      marginTop: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#f8f8f8",
                      }}
                    >
                      <tr>
                        <th style={tableHeadStyle}>Airline</th>
                        <th style={tableHeadStyle}>Code</th>
                        <th style={tableHeadStyle}>From</th>
                        <th style={tableHeadStyle}>To</th>
  
                        <th style={tableHeadStyle}>Class</th>
                        <th style={tableHeadStyle}>Locator</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tableCellStyle}>{seg?.airline}</td>
                        <td style={tableCellStyle}>{seg?.flight}</td>
                        <td style={tableCellStyle}>{seg?.from}</td>
                        <td style={tableCellStyle}>{seg?.to}</td>
                        <td style={tableCellStyle}>{seg?.class}</td>
                        <td style={tableCellStyle}>{seg?.alLocator}</td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    key={idx}
                    style={{
                      borderSpacing: "0",
                      width: "100%",
                      marginTop: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#f8f8f8",
                      }}
                    >
                      <tr>
                        <th style={tableHeadStyle}>Departure Date & Time</th>
                        <th style={tableHeadStyle}>Arrival Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tableCellStyle}>
                          {seg.departure
                            ? new Date(seg.departure).toLocaleString()
                            : ""}
                        </td>
                        <td style={tableCellStyle}>
                          {seg.arrival
                            ? new Date(seg.arrival).toLocaleString()
                            : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    );
    const renderFlightSegmentEs = (segments, type) => (
      <div style={{ marginBottom: "20px" }}>
        {segments.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: "14px",
                marginTop: "10px",
                fontWeight: "600",
                marginBottom: "0px",
              }}
            >
              {type} Segmento de vuelo
            </h4>
            <div className="table-responsive">
              {segments.map((seg, idx) => (
                <>
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "12px",
                      fontWeight: "500",
                      fontStyle: "italic",
                      color: "grey",
                    }}
                  >
                    {type} Vuelo {idx + 1}
                  </p>
                  <table
                    key={idx}
                    style={{
                      borderSpacing: "0",
                      width: "100%",
                      marginTop: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#f8f8f8",
                      }}
                    >
                      <tr>
                        <th style={tableHeadStyle}>Aerolínea</th>
                        <th style={tableHeadStyle}>Código</th>
                        <th style={tableHeadStyle}>De</th>
                        <th style={tableHeadStyle}>A</th>
  
                        <th style={tableHeadStyle}>Clase</th>
                        <th style={tableHeadStyle}>Locadora</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tableCellStyle}>{seg?.airline}</td>
                        <td style={tableCellStyle}>{seg?.flight}</td>
                        <td style={tableCellStyle}>{seg?.from}</td>
                        <td style={tableCellStyle}>{seg?.to}</td>
  
                        <td style={tableCellStyle}>{seg?.class}</td>
                        <td style={tableCellStyle}>{seg?.alLocator}</td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    key={idx}
                    style={{
                      borderSpacing: "0",
                      width: "100%",
                      marginTop: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#f8f8f8",
                      }}
                    >
                      <tr>
                        <th style={tableHeadStyle}>Fecha y hora de salida</th>
                        <th style={tableHeadStyle}>Fecha y hora de llegada</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tableCellStyle}>
                          {seg.departure
                            ? new Date(seg.departure).toLocaleString()
                            : ""}
                        </td>
                        <td style={tableCellStyle}>
                          {seg.arrival
                            ? new Date(seg.arrival).toLocaleString()
                            : ""}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  
    const tableHeadStyle = {
      fontSize: "12px",
      textAlign: "center",
      padding: "8px 5px",
      border: "1px solid rgba(196, 196, 196, 0.1)",
    };
  
    const tableCellStyle = {
      fontSize: "12px",
      textAlign: "center",
      padding: "8px 5px",
      border: "1px solid rgba(196, 196, 196, 0.1)",
    };
  
    return (
      <>
        <main class="crm_all_body scroll_me">
          <div className="lang_btn flex_props gap-2">
            <button onClick={() => setLanguage("en")}>
              <img src="/imgs/en-icon.png" />
              English
            </button>
            <button onClick={() => setLanguage("es")}>
              <img src="/imgs/es-icon.png" />
              Español
            </button>
          </div>
  
          {language && language == "es" ? (
            <>
              {language && language == "es" && (
                <>
                  <div
                    style={{
                      backgroundColor: "#F0F6F9",
                      margin: "auto",
                      width: "100%",
                      maxWidth: "700px",
                      borderSpacing: "0px",
                      fontFamily: "sans-serif",
                      paddingBottom: "15px",
                    }}
                  >
                    <div>
                      <ul
                        style={{
                          padding: "10px 20px",
                          margin: "0px",
                          textAlign: "start",
                        }}
                      >
                        <li
                          style={{
                            fontSize: "13px",
                            textDecoration: "none",
                            listStyle: "none",
                            margin: "3px 0px",
                            color: "black",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <img
                            src="https://www.astrivionventures.co/image-crm/address-icon.png"
                            style={{
                              width: "auto",
                              height: "18px",
                              marginRight: "4px",
                            }}
                          />
                          <b>DIRECCIÓN: </b> 120 Nora Ln Hickory Creek TX 75065
                        </li>
                        <li
                          style={{
                            listStyle: "none",
                          }}
                        >
                          <a
                            href="mailto:support@reservationsdetail.com"
                            style={{
                              fontSize: "13px",
                              textDecoration: "none",
                              listStyle: "none",
                              margin: "3px 0px",
                              color: "black",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {" "}
                            <img
                              src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                              style={{
                                width: "auto",
                                height: "18px",
                                marginRight: "4px",
                              }}
                            />{" "}
                            <b>Correo electrónico:</b>
                            support@reservationsdetail.com
                          </a>
                        </li>
                        <li
                          style={{
                            listStyle: "none",
                          }}
                        >
                          <a
                            href="tel:+1 (833) 940-6335"
                            style={{
                              fontSize: "13px",
                              textDecoration: "none",
                              listStyle: "none",
                              margin: "3px 0px",
                              color: "black",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {" "}
                            <img
                              src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                              style={{
                                width: "auto",
                                height: "18px",
                                marginRight: "4px",
                              }}
                            />
                            <b>Teléfono:</b>{" "}
                            {flightDetails.tollFreeNumber
                              .filter(
                                (item) => item.provider === flightDetails.provider
                              )
                              .map((item, index) => (
                                <div
                                  key={index}
                                  style={{ display: "flex", gap: "5px" }}
                                >
                                  <p>{item.tollFreePrimary} | </p>
                                  <p>{item.tollFreeSecondary}</p>
                                </div>
                              ))}
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#125B88",
                        color: "white",
                        padding: "1px 10px",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <h2
                          style={{
                            textTransform: "uppercase",
                            fontSize: "19px",
                            marginTop: "15px",
                            fontWeight: "700",
                          }}
                        >
                          Formulario de autorización de tarjeta de crédito
                        </h2>
                        <p
                          style={{
                            fontSize: "14px",
                            marginTop: "6px",
                            marginBottom: "12px",
                          }}
                        >
                          Por favor revise los detalles cuidadosamente:
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "0px 15px",
                        marginTop: "17px",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            fontSize: "17px",
                            margin: "12px 0px",
                            fontWeight: "700",
                          }}
                        >
                          Información de la factura
                        </h4>
                      </div>
                      <div>
                        <table
                          style={{
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                Número de Reserva
                              </th>
                              <th
                                style={{
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                Correo electrónico del cliente
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                {bookingId || "N/A"}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                {flightDetails?.email}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                        style={{
                          marginTop: "25px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "17px",
                            margin: "12px 0px",
                            fontWeight: "700",
                          }}
                        >
                          Detalles del pasajero
                        </h4>
                      </div>
                      <div className="table-responsive">
                        <table
                          style={{
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "8px 12px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                S.No.
                              </th>
                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "8px 12px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                Nombre de pila
                              </th>
                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "8px 12px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                Segundo nombre
                              </th>
                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "8px 12px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                Apellido
                              </th>
                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "8px 12px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                Tipo de pasajero
                              </th>
                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "8px 12px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                Fecha de nacimiento
                              </th>
                              <th
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  padding: "8px 12px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                Género
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {flightDetails?.passengerDetails?.map((p, i) => (
                              <tr key={i}>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "8px 12px",
                                    border: "1px solid rgba(196, 196, 196, 0.1)",
                                  }}
                                >
                                  {i + 1}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "8px 12px",
                                    border: "1px solid rgba(196, 196, 196, 0.1)",
                                  }}
                                >
                                  {p.firstName || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "8px 12px",
                                    border: "1px solid rgba(196, 196, 196, 0.1)",
                                  }}
                                >
                                  {p.middleName || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "8px 12px",
                                    border: "1px solid rgba(196, 196, 196, 0.1)",
                                  }}
                                >
                                  {p.lastName || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "8px 12px",
                                    border: "1px solid rgba(196, 196, 196, 0.1)",
                                  }}
                                >
                                  {p.detailsType || "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "8px 12px",
                                    border: "1px solid rgba(196, 196, 196, 0.1)",
                                  }}
                                >
                                  {new Date(p.dob).toString() !== "Invalid Date"
                                    ? new Date(p.dob).toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )
                                    : "N/A"}
                                </td>
                                <td
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "center",
                                    padding: "8px 12px",
                                    border: "1px solid rgba(196, 196, 196, 0.1)",
                                  }}
                                >
                                  {p.gender || "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div
                        style={{
                          marginTop: "25px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "18px",
                            margin: "12px 0px",
                            fontWeight: "700",
                          }}
                        >
                          Detalles del itinerario
                        </h4>
                      </div>
                      <div>
                        {renderFlightSegmentEs(
                          flightDetails?.outboundSegments || [],
                          "Outbound"
                        )}
  
                        {flightDetails?.inboundSegments?.length > 0 &&
                          renderFlightSegmentEs(
                            flightDetails.inboundSegments,
                            "Inbound"
                          )}
                      </div>
                      <div
                        style={{
                          marginTop: "25px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "18px",
                            margin: "12px 0px",
                            fontWeight: "700",
                          }}
                        >
                          Información de tarjeta de crédito/débito
                        </h4>
                      </div>
                      <div>
                        <table
                          style={{
                            display: "flex",
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  border: "none",
                                  width: "200px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                Tipo de tarjeta
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "none",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                {flightDetails?.cardType}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          style={{
                            display: "flex",
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  border: "none",
                                  width: "200px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                Nombre del titular de la tarjeta
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "none",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                {flightDetails?.cchName}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          style={{
                            display: "flex",
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  border: "none",
                                  width: "200px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                Número de tarjeta
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "none",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                {flightDetails?.cardNumber}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          style={{
                            display: "flex",
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  border: "none",
                                  width: "200px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                Número CVV
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "none",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                {flightDetails?.cvv}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          style={{
                            display: "flex",
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  border: "none",
                                  width: "200px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                Fecha de expiración
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "none",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                {flightDetails?.expiryMonth}/
                                {flightDetails?.expiryYear}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          style={{
                            display: "flex",
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  border: "none",
                                  width: "200px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                Número de contacto
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "none",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                {flightDetails?.billingPhoneNumber}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table
                          style={{
                            display: "flex",
                            borderSpacing: "0",
                            width: "100%",
                            marginTop: "10px",
                            backgroundColor: "white",
                          }}
                        >
                          <thead
                            style={{
                              backgroundColor: "#f8f8f8",
                            }}
                          >
                            <tr>
                              <th
                                style={{
                                  border: "none",
                                  width: "200px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                DIRECCIÓN
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  border: "none",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                }}
                              >
                                {flightDetails?.billingAddress1},{" "}
                                {flightDetails?.billingAddress2},{" "}
                                {flightDetails?.city}, {flightDetails?.state},{" "}
                                {flightDetails?.country} -{" "}
                                {flightDetails?.zipCode}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                        style={{
                          marginTop: "25px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "18px",
                            margin: "12px 0px",
                            fontWeight: "700",
                          }}
                        >
                          Detalles de precios y acuerdo
                        </h4>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: "22px",
                          }}
                        >
                          Según nuestra conversación telefónica y lo acordado, I{" "}
                          <b style={{ textTransform: "capitalize" }}>
                            {flightDetails?.cchName}{" "}
                          </b>
                          , autorizar ​​a{" "}
                          <b style={{ textTransform: "capitalize" }}>
                            {" "}
                            {flightDetails?.provider}
                          </b>{" "}
                          a cargar a mi tarjeta de débito/crédito{" "}
                          <b style={{ textTransform: "capitalize" }}>
                            {" "}
                            {Number(flightDetails?.baseFare) +
                              Number(flightDetails?.taxes)}{" "}
                          </b>{" "}
                          <b style={{ textTransform: "uppercase" }}>
                            {flightDetails?.currency}
                          </b>{" "}
                          según los detalles proporcionados para la{" "}
                          <b style={{ textTransform: "capitalize" }}>
                            {" "}
                            {flightDetails?.transactionType}{" "}
                          </b>
                          . Entiendo que este cargo no es reembolsable. En su
                          próximo extracto bancario, verá este cargo como una
                          transacción dividida que incluye la tarifa base, los
                          impuestos y las tasas.
                        </p>
                      </div>
                      <div
                        style={{
                          marginTop: "25px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "18px",
                            margin: "12px 0px",
                            fontWeight: "700",
                          }}
                        >
                          Detalles de Precios y Acuerdo
                        </h4>
                      </div>
                      <div>
                        <ul
                          style={{
                            paddingLeft: "25px",
                          }}
                        >
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Los boletos no son reembolsables ni transferibles y no
                            se permite el cambio de nombre del pasajero.
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Los cambios de fecha y ruta estarán sujetos a
                            penalizaciones de la aerolínea y a la diferencia de
                            tarifa (si corresponde).
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Las tarifas no están garantizadas hasta que se emitan
                            los boletos.
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Para modificaciones o cambios, contáctenos al
                            <b>
                              {flightDetails.tollFreeNumber
                                .filter(
                                  (item) =>
                                    item.provider === flightDetails.provider
                                )
                                .map((item, index) => (
                                  <div
                                    key={index}
                                    style={{ display: "flex", gap: "5px" }}
                                  >
                                    <p>{item.tollFreePrimary} | </p>
                                    <p>{item.tollFreeSecondary}</p>
                                  </div>
                                ))}
                            </b>
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Las reservas no son reembolsables. No se permiten
                            cambios de nombre del pasajero. Los cambios de fecha,
                            ruta u hora pueden generar una penalización y una
                            diferencia de tarifa.
                          </li>
                        </ul>
                      </div>
                      <div
                        style={{
                          marginTop: "25px",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "18px",
                            margin: "12px 0px",
                            fontWeight: "700",
                          }}
                        >
                          Política de Pago
                        </h4>
                      </div>
                      <div>
                        <ul
                          style={{
                            paddingLeft: "25px",
                          }}
                        >
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Aceptamos las principales tarjetas de débito/crédito.
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Cualquier equipaje adicional o de mano debe informarse
                            al momento de la reserva.
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Los billetes no incluyen tarifas de equipaje de la
                            aerolínea (si las hubiera).
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            Se aceptan tarjetas de débito/crédito de terceros e
                            internacionales si están autorizadas por el
                            propietario de la tarjeta.
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            <b>Rechazo de Tarjeta de Crédito: </b> Si se rechaza
                            una tarjeta de débito/crédito durante el procesamiento
                            de la transacción, le avisaremos por correo
                            electrónico o le llamaremos a su número de teléfono
                            válido de inmediato o en un plazo de 24 a 48 horas. En
                            este caso, no se procesa la transacción ni se
                            garantizará la tarifa ni la reserva.
                          </li>
                          <li
                            style={{
                              fontSize: "13px",
                              margin: "7px 0px",
                              lineHeight: "20px",
                              listStyle: "disc",
                            }}
                          >
                            <b>Cancelaciones y Cambios</b>
                            Para cancelaciones y cambios, usted acepta
                            solicitarlos con al menos 24 horas de anticipación a
                            la salida programada. Todos los boletos de avión
                            adquiridos con nosotros son 100% no reembolsables. Sin
                            embargo, usted se reserva el derecho de reembolso o
                            cambio si la aerolínea lo permite de acuerdo con las
                            reglas tarifarias asociadas con el/los boleto(s). Sus
                            boletos pueden reembolsar o cambiarse por el precio de
                            compra original después de deducir las multas
                            aplicables de la aerolínea y cualquier diferencia de
                            tarifa entre la tarifa original pagada y la tarifa
                            asociada con los nuevos boletos. Si un pasajero viaja
                            internacionalmente, es posible que a menudo se le
                            ofrezca viajar en más de una aerolínea. Cada aerolínea
                            tiene su propio conjunto de reglas tarifarias. Si se
                            aplican más de un conjunto de reglas tarifarias a la
                            tarifa total, las más restrictivas se aplicarán a toda
                            la reserva.
                          </li>
                        </ul>
                      </div>
  
                      <div
                        style={{
                          textAlign: "center",
                          display: "flex",
                          justifyContent: "center",
                          gap: "14px",
                          marginTop: "15px",
                        }}
                      >
                        <button
                          className="cancel-btn"
                          style={{
                            textDecoration: "none",
                            backgroundColor: "#f3b500",
                            color: "black",
                            display: "inline-flex",
                            padding: "12px 20px",
                            fontWeight: "600",
                            borderRadius: "5px",
                            textAlign: "center",
                            fontSize: "14px",
                            border: "none",
                          }}
                          onClick={() =>
                            navigate("/astrivion/create-flight-booking", {
                              state: { flightDetails },
                            })
                          }
                        >
                          Volver
                        </button>
                        <button
                          style={{
                            textDecoration: "none",
                            backgroundColor: "green",
                            color: "white",
                            display: "inline-flex",
                            padding: "12px 20px",
                            fontWeight: "600",
                            fontSize: "14px",
                            borderRadius: "5px",
                            textAlign: "center",
                            border: "none",
                          }}
                          onClick={handleSendMail}
                        >
                          Enviar Autorización
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* -----------------------------------------English------------------------------------ */}{" "}
              <div
                style={{
                  backgroundColor: "#F0F6F9",
                  margin: "auto",
                  width: "100%",
                  maxWidth: "700px",
                  borderSpacing: "0px",
                  fontFamily: "sans-serif",
                  paddingBottom: "15px",
                }}
              >
                <div>
                  <ul
                    style={{
                      padding: "10px 20px",
                      margin: "0px",
                      textAlign: "start",
                    }}
                  >
                    <li
                      style={{
                        fontSize: "13px",
                        textDecoration: "none",
                        listStyle: "none",
                        margin: "3px 0px",
                        color: "black",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <img
                        src="https://www.astrivionventures.co/image-crm/address-icon.png"
                        style={{
                          width: "auto",
                          height: "18px",
                          marginRight: "4px",
                        }}
                      />
                      <b>Address: </b> 120 Nora Ln Hickory Creek TX 75065
                    </li>
                    <li
                      style={{
                        listStyle: "none",
                      }}
                    >
                      <a
                        href="mailto:support@reservationsdetail.com"
                        style={{
                          fontSize: "13px",
                          textDecoration: "none",
                          listStyle: "none",
                          margin: "3px 0px",
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {" "}
                        <img
                          src="https://www.astrivionventures.co/image-crm/mail-icon.png"
                          style={{
                            width: "auto",
                            height: "18px",
                            marginRight: "4px",
                          }}
                        />{" "}
                        <b>Email:</b>
                        support@reservationsdetail.com
                      </a>
                    </li>
                    <li
                      style={{
                        listStyle: "none",
                      }}
                    >
                      <a
                        href="tel:+1 (833) 940-6335"
                        style={{
                          fontSize: "13px",
                          textDecoration: "none",
                          listStyle: "none",
                          margin: "3px 0px",
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {" "}
                        <img
                          src="https://www.astrivionventures.co/image-crm/phone-icon.png"
                          style={{
                            width: "auto",
                            height: "18px",
                            marginRight: "4px",
                          }}
                        />
                        <b>Phone:</b>{" "}
                        {flightDetails.tollFreeNumber
                          .filter(
                            (item) => item.provider === flightDetails.provider
                          )
                          .map((item, index) => (
                            <div
                              key={index}
                              style={{ display: "flex", gap: "5px" }}
                            >
                              <p>{item.tollFreePrimary} | </p>
                              <p>{item.tollFreeSecondary}</p>
                            </div>
                          ))}
                      </a>
                    </li>
                  </ul>
                </div>
                <div
                  style={{
                    backgroundColor: "#125B88",
                    color: "white",
                    padding: "1px 10px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <h2
                      style={{
                        textTransform: "uppercase",
                        fontSize: "19px",
                        marginTop: "15px",
                        fontWeight: "700",
                      }}
                    >
                      Credit Card Authorization Form
                    </h2>
                    <p
                      style={{
                        fontSize: "14px",
                        marginTop: "6px",
                        marginBottom: "12px",
                      }}
                    >
                      Kindly review the details carefully:
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    padding: "0px 15px",
                    marginTop: "17px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "17px",
                        margin: "12px 0px",
                        fontWeight: "700",
                      }}
                    >
                      Invoice Information Ticket isssssssssssssue
                    </h4>
                  </div>
                  <div>
                    <table
                      style={{
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            Booking ID
                          </th>
                          <th
                            style={{
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            Customer Email
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            {bookingId || "N/A"}
                          </td>
                          <td
                            style={{
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            {flightDetails?.email}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "17px",
                        margin: "12px 0px",
                        fontWeight: "700",
                      }}
                    >
                      Passenger Details
                    </h4>
                  </div>
                  <div className="table-responsive">
                    <table
                      style={{
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "0px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              padding: "8px 12px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            S.No.
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              padding: "8px 12px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            First Name
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              padding: "8px 12px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            Middle Name
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              padding: "8px 12px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            Last Name
                          </th>
                          <th
                            style={{
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            Passenger Type
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              padding: "8px 12px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            Date of Birth
                          </th>
                          <th
                            style={{
                              fontSize: "12px",
                              textAlign: "center",
                              padding: "8px 12px",
                              border: "1px solid rgba(196, 196, 196, 0.1)",
                            }}
                          >
                            Gender
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {flightDetails?.passengerDetails?.map((p, i) => (
                          <tr key={i}>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "8px 12px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {i + 1}
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "8px 12px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {p.firstName || "N/A"}
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "8px 12px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {p.middleName || "N/A"}
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "8px 12px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {p.lastName || "N/A"}
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "8px 12px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {p.detailsType || "N/A"}
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "8px 12px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {new Date(p.dob).toString() !== "Invalid Date"
                                ? new Date(p.dob).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "8px 12px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {p.gender || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "18px",
                        margin: "12px 0px",
                        fontWeight: "700",
                      }}
                    >
                      Itinerary Details
                    </h4>
                  </div>
                  <div>
                    {renderFlightSegment(
                      flightDetails?.outboundSegments || [],
                      "Outbound"
                    )}
                    {flightDetails?.inboundSegments?.length > 0 &&
                      renderFlightSegment(
                        flightDetails.inboundSegments,
                        "Inbound"
                      )}
                  </div>
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "18px",
                        margin: "12px 0px",
                        fontWeight: "700",
                      }}
                    >
                      Credit / Debit Card Information
                    </h4>
                  </div>
                  <div>
                    <table
                      style={{
                        display: "flex",
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              border: "none",
                              width: "200px",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            Card Type
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "none",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            {flightDetails?.cardType}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        display: "flex",
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              border: "none",
                              width: "200px",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            Cardholder Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "none",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            {flightDetails?.cchName}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        display: "flex",
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              border: "none",
                              width: "200px",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            Card Number
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "none",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            {flightDetails?.cardNumber}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        display: "flex",
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              border: "none",
                              width: "200px",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            CVV Number
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "none",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            {flightDetails?.cvv}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        display: "flex",
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              border: "none",
                              width: "200px",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            Expiration Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "none",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            {flightDetails?.expiryMonth}/
                            {flightDetails?.expiryYear}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        display: "flex",
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              border: "none",
                              width: "200px",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            Contact No.
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "none",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            {flightDetails?.billingPhoneNumber}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      style={{
                        display: "flex",
                        borderSpacing: "0",
                        width: "100%",
                        marginTop: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <thead
                        style={{
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              border: "none",
                              width: "200px",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            Address
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              border: "none",
                              fontSize: "13px",
                              textAlign: "start",
                              padding: "8px 25px",
                            }}
                          >
                            {flightDetails?.billingAddress1},{" "}
                            {flightDetails?.billingAddress2},{" "}
                            {flightDetails?.city}, {flightDetails?.state},{" "}
                            {flightDetails?.country} - {flightDetails?.zipCode}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "18px",
                        margin: "12px 0px",
                        fontWeight: "700",
                      }}
                    >
                      Price Details and Agreement
                    </h4>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "22px",
                      }}
                    >
                      As per our telephonic conversation and as agreed, I{" "}
                      <b>{flightDetails?.cchName}</b>, authorize{" "}
                      <b>{flightDetails?.provider}</b> to charge my Debit/Credit
                      card for{" "}
                      <b style={{ textTransform: "capitalize" }}>
                        {Number(flightDetails?.baseFare) +
                          Number(flightDetails?.taxes)}
                      </b>{" "}
                      <b style={{ textTransform: "uppercase" }}>
                        {flightDetails?.currency}
                      </b>{" "}
                      as per given details for{" "}
                      <b style={{ textTransform: "capitalize" }}>
                        {flightDetails?.transactionType}{" "}
                      </b>
                      . I understand that this charge is non-refundable. In your
                      next bank statement you will see this charge as split
                      transaction which include base fare,taxes&fees.
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "18px",
                        margin: "12px 0px",
                        fontWeight: "700",
                      }}
                    >
                      Terms and Conditions
                    </h4>
                  </div>
                  <div>
                    <ul
                      style={{
                        paddingLeft: "25px",
                      }}
                    >
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        Tickets are Non-Refundable/Non-Transferable and Passenger
                        name change is not permitted.
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        Date and routing change will be subject to Airline Penalty
                        and Fare Difference (if any).
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        Fares are not guaranteed until ticketed.
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        For modification or changes, please contact us at{" "}
                        <b>
                          {flightDetails.tollFreeNumber
                            .filter(
                              (item) => item.provider === flightDetails.provider
                            )
                            .map((item, index) => (
                              <div
                                key={index}
                                style={{ display: "flex", gap: "5px" }}
                              >
                                <p>{item.tollFreePrimary} | </p>
                                <p>{item.tollFreeSecondary}</p>
                              </div>
                            ))}
                        </b>
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        Reservations are non-refundable. Passenger Name changes
                        are not permitted. Date/Route/Time change may incur a
                        penalty and difference in the fare..
                      </li>
                    </ul>
                  </div>
                  <div
                    style={{
                      marginTop: "25px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "18px",
                        margin: "12px 0px",
                        fontWeight: "700",
                      }}
                    >
                      Payment Policy
                    </h4>
                  </div>
                  <div>
                    <ul
                      style={{
                        paddingLeft: "25px",
                      }}
                    >
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        We accept all major Debit/Credit Cards.
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        Any extra luggage or cabin baggage must be informed at the
                        time of reservation.
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        Tickets don’t include baggage fees from the airline (if
                        any).
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        Third-party and international Debit/Credit Cards are
                        accepted if authorized by the cardholder.
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        <b>Credit Card Decline: </b> If a Debit/Credit Card is
                        declined while processing the transaction, we will alert
                        you via email or call you at your valid phone number
                        immediately or within 24 to 48 hours. In this case,
                        neither the transaction will be processed nor the fare and
                        any reservation will be guaranteed.
                      </li>
                      <li
                        style={{
                          fontSize: "13px",
                          margin: "7px 0px",
                          lineHeight: "20px",
                          listStyle: "disc",
                        }}
                      >
                        <b>Cancellations and Exchanges: </b>
                        For cancellations and exchanges, you agree to request it
                        at least 24 hours prior scheduled departure/s. All flight
                        tickets bought from us are 100% non-refundable. You,
                        however, reserve the right to refund or exchange if it is
                        allowed by the airline according to the fare rules
                        associated with the ticket(s). Your ticket(s) may get
                        refunded or exchanged for the original purchase price
                        after the deduction of applicable airline penalties, and
                        any fare difference between the original fare paid and the
                        fare associated with the new ticket(s). If passenger is
                        travelling international, you may often be offered to
                        travel in more than one airline. Each airline has formed
                        its own set of fare rules. If more than one set of fare
                        rules are applied to the total fare, the most restrictive
                        rules will be applicable to the entire booking.
                      </li>
                    </ul>
                  </div>
  
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      gap: "14px",
                      marginTop: "15px",
                    }}
                  >
                    <button
                      className="cancel-btn"
                      style={{
                        textDecoration: "none",
                        backgroundColor: "#f3b500",
                        color: "black",
                        display: "inline-flex",
                        padding: "12px 20px",
                        fontWeight: "600",
                        borderRadius: "5px",
                        textAlign: "center",
                        fontSize: "14px",
                        border: "none",
                      }}
                      onClick={() =>
                        navigate("/astrivion/create-flight-booking", {
                          state: { flightDetails },
                        })
                      }
                    >
                      Go Back
                    </button>
                    <button
                      style={{
                        textDecoration: "none",
                        backgroundColor: "green",
                        color: "white",
                        display: "inline-flex",
                        padding: "12px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        borderRadius: "5px",
                        textAlign: "center",
                        border: "none",
                      }}
                      onClick={handleSendMail}
                    >
                      Send Authorization
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </>
    );
  };
  

export default AuthTicketIssuePreview