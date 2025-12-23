import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { textTransform } from "@mui/system";
import { formatEST } from "../utils/formatUTC";

const AuthorizePreview = () => { 
  const location = useLocation();
  const { flightDetails } = location.state || {};
  console.log("Flight Details:", flightDetails);
  console.log('hereeeee', flightDetails.language);
  if (!flightDetails) {
    return <div className="container mt-5">No flight details available</div>;
  }

  const templateRef = useRef();

  const handleDownloadPDF = () => {
    const element = templateRef.current;
    const opt = {
      margin: 0.5,
      filename: `${flightDetails?.bookingId}booking.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      {flightDetails.language && flightDetails.language == "es" ? (
        <>
          {flightDetails.language && flightDetails.language == "es" && (
            <>
              <main class="crm_all_body scroll_me">
                
                <div
                  ref={templateRef}
                  id="pdf-content"
                  style={{
                    backgroundColor: "#ffffff",
                    margin: "auto",
                    width: "100%",
                    maxWidth: "650px",
                    borderSpacing: "0px",
                    fontFamily: "sans-serif",
                    border: "1px solid rgba(141, 141, 141, 0.1)",
                    paddingBottom: "0px",
                  }}
                >
                   <div
                    style={{
                      backgroundColor: "#125B88",
                      padding: "10px 20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <img
                          src={`${
                            import.meta.env.VITE_REACT_APP_MAIN_URL
                          }uploads/${
                            flightDetails.provider.providerPictures[0].img
                          }`}
                          style={{
                            width: "auto",
                            height: "55px",
                            backgroundColor: "white",
                            padding: "11px",
                            borderRadius: "3px",
                          }}
                        />
                        <p
                          style={{
                            margin: "0px",
                            color: "white",
                            fontSize: "13px",
                            marginTop: "6px",
                            textTransform: "uppercase",
                          }}
                        >
                          Reserva online o llámanos 24/7
                        </p>
                      </div>
                      <div
                        style={{
                          color: "white",
                          width: "60%",
                          textAlign: "end",
                        }}
                      >
                        <div
                          style={{
                            marginTop: "4px",
                            color: "white",
                            fontSize: "13px",
                          }}
                        >
                          700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                        </div>
                         
                        <ul
                          style={{
                            padding: "10px 0px !important",
                            margin: "0px",
                            textAlign: "end",
                          }}
                        >
                          <li
                            style={{
                              listStyle: "none",
                              marginTop: "3px"
                            }}
                          >
                            <a 
                              style={{
                                fontSize: "14px",
                                textDecoration: "none",
                                listStyle: "none",
                                margin: "3px 0px",
                                color: "white",
                                textAlign: "end",
                                width: "194px",
                                marginLeft: "auto",
                              }}
                            >
                              <img
                                src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                                style={{
                                  width: "auto",
                                  height: "13px",
                                  marginRight: "5px",
                                }}
                              />
                             Llámanos al : {flightDetails.provider.tollFreePrimary} | {flightDetails.provider.tollFreeSecondary}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px 18px",
                      paddingBottom: "0px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "23px",
                        fontWeight: "700",
                      }}
                    >
                     Formulario de autorización de tarjeta de crédito
                    </div>

                    <p
                      style={{
                        fontSize: "13px",
                        marginBottom: "0px",
                        marginTop: "1px",
                      }}
                    >
                      Por favor revise los detalles cuidadosamente:
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        marginBottom: "10px",
                      }}
                    >
                      Información de la factura
                    </p>
                    <div
                      style={{
                        marginTop: "0px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          textAlign: "center",
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
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                             ID de reserva
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
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
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {flightDetails?.bookingId}
                            </td>
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {flightDetails?.email}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "15px",
                      paddingTop: "0px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      Detalles del pasajero
                    </p>
                    <div
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          textAlign: "center",
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
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              S.No.
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              Nombre
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              Tipo
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              DOB
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {flightDetails?.passengerDetails?.map((p, i) => (
                            <tr key={i}>
                              {/* {console.log('indexxx', i)} */}
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "8px 15px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "8px 15px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                {p.firstName || "N/A"} {p.middleName || "N/A"}{" "}
                                {p.lastName || "N/A"}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "8px 15px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                {p.detailsType || "N/A"}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "8px 15px",
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          marginBottom: "-2px",
                        }}
                      >
                        Detalles del itinerario
                      </p>

                      {flightDetails.outboundSegments.map((items, index) => {
                        return (
                          <div className="segment_container_authh">
                            <p className="title_common_semi1 mt-0">
                              Vuelo de ida {index + 1}
                            </p>
                            <div className="table-responsive">
                              <table
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "#f3f8fa",
                                }}
                              >
                                <thead
                                  style={{
                                    backgroundColor: "#125B88",
                                    color: "white",
                                  }}
                                >
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Aerolínea
                                  </th>
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Vuelo
                                  </th>
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    De
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    A
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Clase
                                  </th>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.airline}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.flight}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.from}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.to}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.class}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "#f3f8fa",
                                }}
                              >
                                <thead
                                  style={{
                                    backgroundColor: "#125B88",
                                    color: "white",
                                  }}
                                >
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                   Fecha y hora de salida
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Fecha y hora de llegada
                                  </th>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {new Date(
                                        items?.departure
                                      ).toLocaleString()}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {new Date(
                                        items?.arrival
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                      {flightDetails.inboundSegments.map((items, index) => {
                        return (
                          <div className="segment_container_authh">
                            <p className="title_common_semi1 mt-0">
                              Vuelo de llegada {index + 1}
                            </p>
                            <div className="table-responsive">
                              <table
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "#f3f8fa",
                                }}
                              >
                                <thead
                                  style={{
                                    backgroundColor: "#125B88",
                                    color: "white",
                                  }}
                                >
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Aerolínea
                                  </th>
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Vuelo
                                  </th>
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    De
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    A
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Clase
                                  </th>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.airline}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.flight}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.from}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.to}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.class}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "#f3f8fa",
                                }}
                              >
                                <thead
                                  style={{
                                    backgroundColor: "#125B88",
                                    color: "white",
                                  }}
                                >
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                   Fecha y hora de salida
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Fecha y hora de llegada
                                  </th>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {new Date(
                                        items?.departure
                                      ).toLocaleString()}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {new Date(
                                        items?.arrival
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                        }}
                      >
                        Información de tarjeta de crédito/débito
                      </p>
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
                                  width: "300px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                  borderRadius: "5px 5px 0px 0px",
                                }}
                              >
                              Tipo de tarjeta
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              width: "100%",
                            }}
                          >
                            <tr
                              style={{
                                display: "flex",
                              }}
                            >
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                  width: "100%",
                                }}
                              >
                                {flightDetails?.cardType}
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                                  width: "300px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                  borderRadius: "5px 5px 0px 0px",
                                }}
                              >
                                Nombre del titular de la tarjeta
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              width: "100%",
                            }}
                          >
                            <tr
                              style={{
                                display: "flex",
                              }}
                            >
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                  width: "100%",
                                }}
                              >
                                {flightDetails?.cchName}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <table
                        style={{
                          display: "flex",
                          borderSpacing: 0,
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px",
                              }}
                            >
                              Número de tarjeta
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {"x"
                                .repeat(flightDetails.cardNumber.length)
                                .slice(0, -4)}
                              {flightDetails.cardNumber.slice(-4)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px",
                              }}
                            >
                              Número CVV
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {flightDetails?.cvv}
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px",
                              }}
                            >
                              Expiration Date
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {flightDetails?.expiryMonth}/
                              {flightDetails?.expiryYear}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <table
                        style={{
                          display: "flex",
                          borderSpacing: 0,
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px,",
                              }}
                            >
                              DIRECCIÓN
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {flightDetails?.billingAddress1} |{" "}
                              {flightDetails?.billingAddress2}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "15px",
                    }}
                  >
                    <div
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      <p
                        style={{
                          marginTop: "14px",
                          fontSize: "17px",
                          fontWeight: "700",
                          marginBottom: "9px",
                        }}
                      >
                        Detalles de precios y acuerdo
                      </p>
                      <p>
                       Según nuestra conversación telefónica y lo acordado, I{" "}
                        <b>{flightDetails?.cchName}</b>, autorizar ​​a{" "}
                        <b>{flightDetails?.provider.provider}</b> a cargar a mi tarjeta de débito/crédito{" "}
                        <b>
                          {Number(flightDetails?.chargingBaseFare) +
                            Number(flightDetails?.chargingTaxes)}
                        </b>{" "}
                        USD as per given details for <b style={{textTransform:"capitalize"}}>{flightDetails?.transactionType}</b> . Entiendo que este cargo no es reembolsable. En su próximo extracto bancario, verá este cargo como una transacción dividida que incluye la tarifa base, los impuestos y las tasas.
                      </p>
                    </div>

                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "14px",
                        fontWeight: "700",
                      }}
                    >
                     Términos y condiciones
                    </p>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Los boletos no son reembolsables ni transferibles y no se permite el cambio de nombre del pasajero. Los cambios de fecha y ruta estarán sujetos a la penalización de la aerolínea y a la diferencia de tarifa (si corresponde). Las tarifas no están garantizadas hasta que se emita el boleto.
                    </p>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Para modificaciones o cambios, por favor contáctenos en{" "}
                      <b>
                        {flightDetails?.provider.tollFreePrimary} |{" "}
                        {flightDetails?.provider.tollFreeSecondary}
                      </b>
                      .
                    </p>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                     Las reservas no son reembolsables. No se permiten cambios de nombre de pasajero. Los cambios de fecha, ruta y hora pueden conllevar una penalización y una diferencia en la tarifa.
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "11px",
                        fontWeight: "700",
                      }}
                    >
                     Política de pago
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                     Aceptamos todas las principales tarjetas de débito/crédito. Los boletos no incluyen cargos por equipaje de la aerolínea (si corresponde). Se aceptan tarjetas de débito/crédito internacionales y de terceros si el titular las autoriza. Rechazo de tarjeta de crédito: Si una tarjeta de débito/crédito es rechazada durante el procesamiento de la transacción, le avisaremos por correo electrónico o le llamaremos a su número de teléfono válido inmediatamente o en un plazo de 24 a 48 horas. En este caso, ni la transacción se procesará ni la tarifa ni la reserva estarán garantizadas. Cancelaciones y cambios: Para cancelaciones y cambios, usted acepta solicitarlos con al menos 24 horas de anticipación a la salida programada. Todos los boletos de avión comprados con nosotros no son reembolsables. Sin embargo, se reserva el derecho a reembolso o cambio si la aerolínea lo permite, de acuerdo con las reglas tarifarias asociadas con el/los boleto(s). Su(s) billete(s) puede(n) ser reembolsado(s) o cambiado(s) por el precio original de compra, una vez deducidas las penalizaciones aplicables de la aerolínea y cualquier diferencia de tarifa entre la tarifa original pagada y la tarifa asociada al(los) nuevo(s) billete(s). Si viaja internacionalmente, es posible que se le ofrezca viajar con más de una aerolínea. Cada aerolínea ha establecido su propio conjunto de reglas tarifarias. Si se aplican más de un conjunto de reglas tarifarias a la tarifa total, se aplicarán las más restrictivas a toda la reserva.
                    </p>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#f3f8fa",
                      padding: "15px",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <table
                        style={{
                          display: "flex",
                          borderSpacing: 0,
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px,",
                              }}
                            >
                              {flightDetails?.cchName}
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {flightDetails?.billingAddress1} |{" "}
                              {flightDetails?.billingAddress2}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <table
                        style={{
                          display: "flex",
                          borderSpacing: 0,
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px,",
                              }}
                            >
                              Firma del cliente
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              Fecha
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 text-center">
                      <p style={{ fontSize: "14px" }}>
                        Este formulario fue llenado por: {flightDetails.authorizedIp}{" "}
                        desde el{" "}
                        {console.log("hereeee", flightDetails.authorizedAt)}
                        {formatEST(flightDetails?.authorizedAt)}
                      </p>
                      <p className="mt-2" style={{ fontSize: "12px" }}>
                        ©{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {flightDetails?.provider.provider}
                        </span>{" "}
                        2025 All rights reserved
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lang_btn flex_props gap-2">
                  <button onClick={handleDownloadPDF}>
                    <img src="/imgs/downloads-icon.png" /> Download Pdf
                  </button>
                </div>
              </main>
            </>
          )}
        </>
      ) : (
        <>
          {/* -----------------------------------------English------------------------------------ */}
          <main class="crm_all_body scroll_me">
                
                <div
                  ref={templateRef}
                  id="pdf-content"
                  style={{
                    backgroundColor: "#ffffff",
                    margin: "auto",
                    width: "100%",
                    maxWidth: "650px",
                    borderSpacing: "0px",
                    fontFamily: "sans-serif",
                    border: "1px solid rgba(141, 141, 141, 0.1)",
                    paddingBottom: "0px",
                  }}
                >
                   <div
                    style={{
                      backgroundColor: "#125B88",
                      padding: "10px 20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: "40%",
                        }}
                      >
                        <img
                          src={`${
                            import.meta.env.VITE_REACT_APP_MAIN_URL
                          }uploads/${
                            flightDetails.provider.providerPictures[0].img
                          }`}
                          style={{
                            width: "auto",
                            height: "55px",
                            backgroundColor: "white",
                            padding: "11px",
                            borderRadius: "3px",
                          }}
                        />
                        <p
                          style={{
                            margin: "0px",
                            color: "white",
                            fontSize: "13px",
                            marginTop: "6px",
                            textTransform: "uppercase",
                          }}
                        >
                          Book online or call us 24/7
                        </p>
                      </div>
                      <div
                        style={{
                          color: "white",
                          width: "60%",
                          textAlign: "end",
                        }}
                      >
                        <div
                          style={{
                            marginTop: "4px",
                            color: "white",
                            fontSize: "13px",
                          }}
                        >
                          700 Jack Russell Ct, Elgin, South Carolina, USA 29045
                        </div>
                         
                        <ul
                          style={{
                            padding: "10px 0px !important",
                            margin: "0px",
                            textAlign: "end",
                          }}
                        >
                          <li
                            style={{
                              listStyle: "none",
                              marginTop: "3px"
                            }}
                          >
                            <a
                              href="tel:+1-888-209-3035"
                              style={{
                                fontSize: "14px",
                                textDecoration: "none",
                                listStyle: "none",
                                margin: "3px 0px",
                                color: "white",
                                textAlign: "end",
                                width: "194px",
                                marginLeft: "auto",
                              }}
                            >
                              <img
                                src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                                style={{
                                  width: "auto",
                                  height: "13px",
                                  marginRight: "5px",
                                }}
                              />
                              Call Us At: {flightDetails.provider.tollFreePrimary} | {flightDetails.provider.tollFreeSecondary}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px 18px",
                      paddingBottom: "0px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "23px",
                        fontWeight: "700",
                      }}
                    >
                      Credit Card Authorization Form
                    </div>

                    <p
                      style={{
                        fontSize: "13px",
                        marginBottom: "0px",
                        marginTop: "1px",
                      }}
                    >
                      Kindly review the details carefully:
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        marginBottom: "10px",
                      }}
                    >
                      Invoice Information
                    </p>
                    <div
                      style={{
                        marginTop: "0px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          textAlign: "center",
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
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              Booking ID
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
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
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {flightDetails?.bookingId}
                            </td>
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              {flightDetails?.email}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "15px",
                      paddingTop: "0px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      Passenger Details
                    </p>
                    <div
                      style={{
                        marginTop: "10px",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          textAlign: "center",
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
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              S.No.
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              Name
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              Type
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                textAlign: "center",
                                padding: "8px 15px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                              }}
                            >
                              DOB
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {flightDetails?.passengerDetails?.map((p, i) => (
                            <tr key={i}>
                              {/* {console.log('indexxx', i)} */}
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "8px 15px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "8px 15px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                {p.firstName || "N/A"} {p.middleName || "N/A"}{" "}
                                {p.lastName || "N/A"}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "8px 15px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                }}
                              >
                                {p.detailsType || "N/A"}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "center",
                                  padding: "8px 15px",
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          marginBottom: "-2px",
                        }}
                      >
                        Itinerary Details
                      </p>

                      {flightDetails.outboundSegments.map((items, index) => {
                        return (
                          <div className="segment_container_authh">
                            <p className="title_common_semi1 mt-0">
                              Outbound Flight {index + 1}
                            </p>
                            <div className="table-responsive">
                              <table
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "#f3f8fa",
                                }}
                              >
                                <thead
                                  style={{
                                    backgroundColor: "#125B88",
                                    color: "white",
                                  }}
                                >
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Airline
                                  </th>
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Flight
                                  </th>
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    From
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    To
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Class
                                  </th>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.airline}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.flight}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.from}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.to}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.class}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "#f3f8fa",
                                }}
                              >
                                <thead
                                  style={{
                                    backgroundColor: "#125B88",
                                    color: "white",
                                  }}
                                >
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Departure Date & Time
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Arrival Date & Time
                                  </th>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {new Date(
                                        items?.departure
                                      ).toLocaleString()}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {new Date(
                                        items?.arrival
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                      {flightDetails.inboundSegments.map((items, index) => {
                        return (
                          <div className="segment_container_authh">
                            <p className="title_common_semi1 mt-0">
                              Inbound Flight {index + 1}
                            </p>
                            <div className="table-responsive">
                              <table
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "#f3f8fa",
                                }}
                              >
                                <thead
                                  style={{
                                    backgroundColor: "#125B88",
                                    color: "white",
                                  }}
                                >
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Airline
                                  </th>
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Flight
                                  </th>
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    From
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    To
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Class
                                  </th>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.airline}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.flight}
                                    </td>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.from}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.to}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {items?.class}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "#f3f8fa",
                                }}
                              >
                                <thead
                                  style={{
                                    backgroundColor: "#125B88",
                                    color: "white",
                                  }}
                                >
                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Departure Date & Time
                                  </th>

                                  <th
                                    style={{
                                      fontSize: "12px",
                                      padding: "7px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Arrival Date & Time
                                  </th>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {new Date(
                                        items?.departure
                                      ).toLocaleString()}
                                    </td>

                                    <td
                                      style={{
                                        fontSize: "12px",
                                        padding: "7px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {new Date(
                                        items?.arrival
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                        }}
                      >
                        Credit/Debit Card Information
                      </p>
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
                                  width: "300px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                  borderRadius: "5px 5px 0px 0px",
                                }}
                              >
                                Card Type
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              width: "100%",
                            }}
                          >
                            <tr
                              style={{
                                display: "flex",
                              }}
                            >
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                  width: "100%",
                                }}
                              >
                                {flightDetails?.cardType}
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
                                  width: "300px",
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                  borderRadius: "5px 5px 0px 0px",
                                }}
                              >
                                Cardholder Name
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              width: "100%",
                            }}
                          >
                            <tr
                              style={{
                                display: "flex",
                              }}
                            >
                              <td
                                style={{
                                  fontSize: "13px",
                                  textAlign: "start",
                                  padding: "8px 25px",
                                  border: "1px solid rgba(196, 196, 196, 0.1)",
                                  width: "100%",
                                }}
                              >
                                {flightDetails?.cchName}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <table
                        style={{
                          display: "flex",
                          borderSpacing: 0,
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px",
                              }}
                            >
                              Card Number
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {"x"
                                .repeat(flightDetails.cardNumber.length)
                                .slice(0, -4)}
                              {flightDetails.cardNumber.slice(-4)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px",
                              }}
                            >
                              CVV Number
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {flightDetails?.cvv}
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px",
                              }}
                            >
                              Expiration Date
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {flightDetails?.expiryMonth}/
                              {flightDetails?.expiryYear}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <table
                        style={{
                          display: "flex",
                          borderSpacing: 0,
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px,",
                              }}
                            >
                              Address
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {flightDetails?.billingAddress1} |{" "}
                              {flightDetails?.billingAddress2}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "15px",
                    }}
                  >
                    <div
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      <p
                        style={{
                          marginTop: "14px",
                          fontSize: "17px",
                          fontWeight: "700",
                          marginBottom: "9px",
                        }}
                      >
                        Price Details and Agreement
                      </p>
                      <p>
                        As per our telephonic conversation and as agreed, I{" "}
                        <b>{flightDetails?.cchName}</b>, authorize{" "}
                        <b>{flightDetails?.provider.provider}</b> to charge my
                        Debit/Credit card for{" "}
                        <b> {Number(flightDetails?.chargingBaseFare) +
                            Number(flightDetails?.chargingTaxes)}
                        </b>{" "}
                        USD as per given details for <b style={{textTransform:"capitalize"}}>{flightDetails?.transactionType}</b> . I
                        understand that this charge is nonrefundable. In your
                        next bank statement you will see this charge as split
                        transaction which include base fare,taxes&fees.
                      </p>
                    </div>

                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "14px",
                        fontWeight: "700",
                      }}
                    >
                      Terms and Conditions
                    </p>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Tickets are Non-Refundable/Non-Transferable and Passenger
                      name change is not permitted. Date and routing change will
                      be subject to Airline Penalty and Fare Difference (if
                      any). Fares are not guaranteed until ticketed.
                    </p>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      For modification or changes, please contact us at{" "}
                      <b>
                        {flightDetails?.provider.tollFreePrimary} |{" "}
                        {flightDetails?.provider.tollFreeSecondary}
                      </b>
                      .
                    </p>
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Reservations are non-refundable. Passenger Name changes
                      are not permitted. Date/Route/Time change may incur a
                      penalty and difference in the fare..
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "11px",
                        fontWeight: "700",
                      }}
                    >
                      Payment Policy
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      We accept all major Debit/Credit Cards. Tickets don’t
                      include baggage fees from the airline (if any).
                      Third-party and international Debit/Credit Cards are
                      accepted if authorized by the cardholder. Credit Card
                      Decline If a Debit/Credit Card is declined while
                      processing the transaction, we will alert you via email or
                      call you at your valid phone number immediately or within
                      24 to 48 hours. In this case, neither the transaction will
                      be processed nor the fare and any reservation will be
                      guaranteed. Cancellations and Exchanges For cancellations
                      and exchanges, you agree to request it at least 24 hours
                      prior scheduled departure/s. All flight tickets bought
                      from us are 100% non-refundable. You, however, reserve the
                      right to refund or exchange if it is allowed by the
                      airline according to the fare rules associated with the
                      ticket(s). Your ticket(s) may get refunded or exchanged
                      for the original purchase price after the deduction of
                      applicable airline penalties, and any fare difference
                      between the original fare paid and the fare associated
                      with the new ticket(s). If passenger is travelling
                      international, you may often be offered to travel in more
                      than one airline. Each airline has formed its own set of
                      fare rules. If more than one set of fare rules are applied
                      to the total fare, the most restrictive rules will be
                      applicable to the entire booking
                    </p>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#f3f8fa",
                      padding: "15px",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <table
                        style={{
                          display: "flex",
                          borderSpacing: 0,
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px,",
                              }}
                            >
                              {flightDetails?.cchName}
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              {flightDetails?.billingAddress1} |{" "}
                              {flightDetails?.billingAddress2}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <table
                        style={{
                          display: "flex",
                          borderSpacing: 0,
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
                                width: "300px",
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                borderRadius: "5px 5px 0px 0px,",
                              }}
                            >
                              Customer Signature
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          style={{
                            width: "100%",
                          }}
                        >
                          <tr
                            style={{
                              display: "flex",
                            }}
                          >
                            <td
                              style={{
                                fontSize: "13px",
                                textAlign: "start",
                                padding: "8px 25px",
                                border: "1px solid rgba(196, 196, 196, 0.1)",
                                width: "100%",
                              }}
                            >
                              Date
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 text-center">
                      <p style={{ fontSize: "14px" }}>
                        This form was filled by: {flightDetails.authorizedIp}{" "}
                        from on{" "}
                        {console.log("hereeee", flightDetails.authorizedAt)}
                        {formatEST(flightDetails?.authorizedAt)}
                      </p>
                      <p className="mt-2" style={{ fontSize: "12px" }}>
                        ©{" "}
                        <span style={{ textTransform: "capitalize" }}>
                          {flightDetails?.provider.provider}
                        </span>{" "}
                        2025 All rights reserved
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lang_btn flex_props gap-2">
                  <button onClick={handleDownloadPDF}>
                    <img src="/imgs/downloads-icon.png" /> Download Pdf
                  </button>
                </div>
              </main>
        </>
      )}
    </>
  );
};

export default AuthorizePreview;
