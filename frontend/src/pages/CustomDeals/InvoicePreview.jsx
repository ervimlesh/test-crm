import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/auth.css";

const InvoicePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { flightDetails } = location.state || {};

  console.log("flightdetailsi s", flightDetails);

  const [authMails, setAuthMails] = useState([]);
  const [selectedAuthMail, setSelectedAuthMail] = useState(null);

  const [language, setLanguage] = useState(flightDetails?.language); // "en" or "sp"
  const userRole = localStorage.getItem("auth");
  const parsedUserRole = JSON.parse(userRole);

  const agent = parsedUserRole?.user?.userName;

  const agentId = parsedUserRole?.user?._id;

  const fetchCurrentAuthMails = async () => {
    try {
      const response = await axios.get("/api/v1/service/get-auth-mails");

      if (response.data.success) {
        const allMails = response?.data?.data || [];

        // *** Store ONLY active auth-mail ***
        const activeAuthMail = allMails.filter(
          (mail) => mail.status === "active" && mail.mailStatus === "invoice-mail"
        );

        setAuthMails(activeAuthMail);
        setSelectedAuthMail(activeAuthMail);
      } else {
        console.error("Failed to fetch auth mails");
      }
    } catch (error) {
      console.error("Error fetching auth mails:", error);
    }
  };

  useEffect(() => {
    fetchCurrentAuthMails();

    
    // if (flightDetails?.authMail) {
    //   setSelectedAuthMail(flightDetails.authMail);
    // }
  }, [flightDetails]);

  console.log("parsedUserid is in mail preview ", agentId);
  console.log("here lang", language);
  const handleSendMail = async () => {
    try {
      const authCredentials = {
        ...selectedAuthMail,
      };

      await axios.get(
        `/api/v1/ctmFlights/update-send-mail-invoice-details/${flightDetails._id}`,
        {
          params: {
            agentFigure: flightDetails?.agentFigure,
            language: language || flightDetails.language || "en",
            transactionType: flightDetails.transactionType,
            authCredentials: JSON.stringify(authCredentials),
          },
        }
      );
      alert("Mail invoice sent successfully!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Error sending mail invoice.");
    }
  };

  if (!flightDetails) return <div>No invoice data found.</div>;

  const renderSegments = (segments, type) =>
    segments.map((seg, index) => (
      <div key={index} className="segment-box">
        <h5>
          {type} Segment {index + 1}
        </h5>
        <table className="invoice-table">
          <tbody>
            {Object.entries(seg)
              .filter(([key]) => key !== "_id") // exclude _id
              .map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>
                    {new Date(value).toString() !== "Invalid Date"
                      ? new Date(value).toLocaleString()
                      : value}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    ));

  return (
    <>
      <main class="crm_all_body scroll_me">
        <div className="lang_btn flex_props gap-2">
          <button onClick={() => setLanguage("en")}>
            <img src="/imgs/en-icon.png" /> English
          </button>
          <button onClick={() => setLanguage("es")}>
            <img src="/imgs/es-icon.png" /> Español
          </button>
        </div>
        {language && language == "es" ? (
          <>
            {language && language == "es" && (
              <>
                <div
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
                          Referencia de reserva {flightDetails.bookingId}
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
                            }}
                          >
                            <a
                              style={{
                                fontSize: "13px",
                                textDecoration: "none",
                                listStyle: "none",
                                margin: "3px 0px",
                                color: "white",
                                textAlign: "end",
                                width: "320px",
                                marginLeft: "auto",
                                display: "flex",
                                lineHeight: "23px",
                              }}
                            >
                              <div>
                                <img
                                  src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                                  style={{
                                    width: "auto",
                                    height: "13px",
                                    marginRight: "5px",
                                  }}
                                />
                                Llámanos al :{" "}
                                {flightDetails.provider.tollFreePrimary} |{" "}
                                {flightDetails.provider.tollFreeSecondary}
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px 18px",
                      textAlign: "start",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "26px",
                      }}
                    >
                      Querido viajero,
                    </div>

                    <p
                      style={{
                        fontSize: "14px",
                        marginBottom: "0px",
                        marginTop: "2px",
                      }}
                    >
                      Gracias por elegirnos{" "}
                      <b>{flightDetails.provider.provider}</b> Equipo para{" "}
                      <b style={{ textTransform: "capitalize" }}>
                        {flightDetails?.transactionType}
                      </b>{" "}
                      .
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        marginBottom: "0px",
                        color: "grey",
                        marginTop: "5px",
                      }}
                    >
                      Tómese un momento para revisar el resumen de su reserva.
                    </p>
                  </div>
                  <div class="">
                    <p
                      style={{
                        fontSize: "19px",
                        textAlign: "center",
                        marginTop: "5px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "22px",
                          color: "#125B88",
                          fontWeight: "550",
                        }}
                      >
                        Felicidades!
                      </span>{" "}
                      Su solicitud de servicio de vuelo ha sido procesada
                      exitosamente para{" "}
                      <span className="trans_type">
                        {flightDetails.transactionType}
                      </span>
                      .
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                    }}
                  >
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
                        <tr>
                          <th
                            style={{
                              fontSize: "14px",
                              padding: "7px",
                              fontWeight: "500",
                            }}
                          >
                            Localizadora de aerolineas
                          </th>
                          <th
                            style={{
                              fontSize: "14px",
                              padding: "7px",
                              fontWeight: "500",
                            }}
                          >
                            Referencia de reserva
                          </th>
                          <th
                            style={{
                              fontSize: "14px",
                              padding: "7px",
                              fontWeight: "500",
                            }}
                          >
                            Fecha de reserva
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "14px",
                              padding: "7px",
                              fontWeight: "500",
                            }}
                          >
                            <div className="al_invoice_flex gap-2">
                              {flightDetails.inboundSegments.map((items) => {
                                return (
                                  <p className="font_12">{items.alLocator}</p>
                                );
                              })}
                              {flightDetails.outboundSegments.map((items) => {
                                return (
                                  <p className="font_12">{items.alLocator}</p>
                                );
                              })}
                            </div>
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              padding: "7px",
                              fontWeight: "500",
                            }}
                          >
                            {flightDetails?.bookingId}
                          </td>
                          <td
                            style={{
                              fontSize: "14px",
                              padding: "7px",
                              fontWeight: "500",
                            }}
                          >
                            {new Date(
                              flightDetails.outboundSegments[0].departure
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p
                    style={{
                      marginTop: "15px",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    Le recomendamos que guarde una copia de este correo
                    electrónico para futuras referencias o consultas.
                  </p>
                  <div
                    style={{
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      Detalles de facturación
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
                              Email
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
                              {flightDetails?.email}
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
                              Número de facturación
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
                              {flightDetails?.billingPhoneNumber}
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
                              Referencia de reserva
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
                              {flightDetails?.bookingId}
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
                              Fecha de reserva
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
                              {new Date(
                                flightDetails.outboundSegments[0].departure
                              ).toLocaleDateString()}
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
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      Detalles del viajero
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
                          backgroundColor: "#f3f8fa",
                        }}
                      >
                        <thead
                          style={{
                            backgroundColor: "#125B88",
                            color: "white",
                          }}
                        >
                          <tr>
                            <th
                              style={{
                                fontSize: "13px",
                                padding: "7px",
                                textAlign: "center",
                                fontWeight: "500",
                              }}
                            >
                              S.No.
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                padding: "7px",
                                textAlign: "center",
                                fontWeight: "500",
                              }}
                            >
                              Nombre
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                padding: "7px",
                                textAlign: "center",
                                fontWeight: "500",
                              }}
                            >
                              Tipo
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                padding: "7px",
                                textAlign: "center",
                                fontWeight: "500",
                              }}
                            >
                              DOB
                            </th>
                            <th
                              style={{
                                fontSize: "13px",
                                padding: "7px",
                                textAlign: "center",
                                fontWeight: "500",
                              }}
                            >
                              Número de billete.
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {flightDetails?.passengerDetails?.map((p, i) => (
                            <tr key={i}>
                              <td
                                style={{
                                  fontSize: "13px",
                                  padding: "7px",
                                  textAlign: "center",
                                  fontWeight: "500",
                                }}
                              >
                                {i + 1}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  padding: "7px",
                                  textAlign: "center",
                                  fontWeight: "500",
                                }}
                              >
                                {p.firstName || "-----"}{" "}
                                {p.middleName || "-----"}{" "}
                                {p.lastName || "-----"}
                              </td>

                              <td
                                style={{
                                  fontSize: "13px",
                                  padding: "7px",
                                  textAlign: "center",
                                  fontWeight: "500",
                                }}
                              >
                                {p.detailsType || "-----"}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  padding: "7px",
                                  textAlign: "center",
                                  fontWeight: "500",
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
                                  : "-----"}
                              </td>
                              <td
                                style={{
                                  fontSize: "13px",
                                  padding: "7px",
                                  textAlign: "center",
                                  fontWeight: "500",
                                }}
                              >
                                {p.ticketNumber || "-----"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                      }}
                    >
                      Resumen del vuelo
                    </p>
                    <p className="title_common_semi1 mb-2 mt-1">
                      Segmento de vuelos de salida
                    </p>
                    {flightDetails.outboundSegments.map((data, index) => {
                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "10px",
                              padding: "12px",
                              borderRadius: "10px",
                              backgroundColor: "#f9f9f9",
                            }}
                            key={index}
                          >
                            <div
                              style={{
                                width: "50px",
                              }}
                            >
                              <img
                                src="https://www.astrivionventures.co/image-crm/united-fav.png"
                                style={{
                                  width: "auto",
                                  height: "44px",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                width: "250px",
                                marginLeft: "13px",
                              }}
                            >
                              <p
                                style={{
                                  margin: "0px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <span>{data.airline}</span>|
                                <span>{data.flight}</span>|
                                <span>{data.from}</span>
                              </p>
                              <p
                                style={{
                                  margin: "4px 0px",
                                  fontSize: "13px",
                                }}
                              >
                                <span>
                                  {data.departure
                                    ? new Date(data.departure)
                                        .toLocaleString()
                                        .slice(0, 22)
                                    : ""}
                                </span>
                              </p>
                            </div>

                            <div
                              style={{
                                width: "50%",
                                borderLeft: "1px solid black",
                                paddingLeft: "20px",
                              }}
                            >
                              <p
                                style={{
                                  margin: "0px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <span>{data.airline}</span>|
                                <span>{data.flight}</span>|
                                <span>{data.to}</span>
                              </p>
                              <p
                                style={{
                                  margin: "0px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  marginTop: "5px",
                                }}
                              >
                                <span>
                                  {data.arrival
                                    ? new Date(data.arrival)
                                        .toLocaleString()
                                        .slice(0, 22)
                                    : ""}
                                </span>
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                    {flightDetails.inboundSegments.length > 0 && (
                      <>
                        <p className="title_common_semi1 mb-2">
                          Segmento de vuelos de entrada
                        </p>
                        {flightDetails.inboundSegments.map((data, index) => {
                          return (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginTop: "10px",
                                  padding: "12px",
                                  borderRadius: "10px",
                                  backgroundColor: "#f9f9f9",
                                }}
                                key={index}
                              >
                                <div
                                  style={{
                                    width: "50px",
                                  }}
                                >
                                  <img
                                    src="https://www.astrivionventures.co/image-crm/united-fav.png"
                                    style={{
                                      width: "auto",
                                      height: "44px",
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    width: "250px",
                                    marginLeft: "13px",
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: "0px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <span>{data.airline}</span>|
                                    <span>{data.flight}</span>|
                                    <span>{data.from}</span>
                                  </p>
                                  <p
                                    style={{
                                      margin: "4px 0px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    <span>
                                      {data.departure
                                        ? new Date(data.departure)
                                            .toLocaleString()
                                            .slice(0, 22)
                                        : ""}
                                    </span>
                                  </p>
                                </div>

                                <div
                                  style={{
                                    width: "50%",
                                    borderLeft: "1px solid black",
                                    paddingLeft: "20px",
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: "0px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                    }}
                                  >
                                    <span>{data.airline}</span>|
                                    <span>{data.flight}</span>|
                                    <span>{data.to}</span>
                                  </p>
                                  <p
                                    style={{
                                      margin: "0px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      marginTop: "5px",
                                    }}
                                  >
                                    <span>
                                      {data.arrival
                                        ? new Date(data.arrival)
                                            .toLocaleString()
                                            .slice(0, 22)
                                        : ""}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </>
                    )}

                    <div
                      style={{
                        marginTop: "20px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      <p>
                        Equipaje: Tenga en cuenta que muchas aerolíneas
                        (especialmente las de bajo coste) no permiten equipaje
                        gratuito. Consulte el sitio web de la aerolínea para
                        obtener la información más actualizada.
                      </p>
                      <p>
                        Facturación en línea: Algunas aerolíneas exigen que los
                        pasajeros facturen en línea e impriman sus tarjetas de
                        embarque; de ​​lo contrario, cobran una tarifa por la
                        facturación en el aeropuerto. Para más información,
                        visite el sitio web de la aerolínea.
                      </p>
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
                        cambio de fecha o ruta, llámenos al{" "}
                        <b>
                          {flightDetails?.provider.tollFreePrimary} |{" "}
                          {flightDetails?.provider.tollFreeSecondary}
                        </b>
                        . Los cambios están sujetos a las normas y regulaciones
                        de la aerolínea y pueden generar penalizaciones,
                        diferencias de tarifa y cargos. Algunos vuelos pueden no
                        admitir cambios. No se garantiza ninguna tarifa hasta
                        que se emitan los boletos.
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        marginTop: "20px",
                      }}
                    >
                      Detalles de precios
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
                          backgroundColor: "#f3f8fa",
                        }}
                      >
                        <thead
                          style={{
                            backgroundColor: "#125B88",
                            color: "white",
                          }}
                        >
                          <tr>
                            <th
                              style={{
                                fontSize: "14px",
                                padding: "7px",
                                fontWeight: 500,
                              }}
                            >
                              Base Price
                            </th>
                            <th
                              style={{
                                fontSize: "14px",
                                padding: "7px",
                                fontWeight: 500,
                              }}
                            >
                              Taxes & Fees
                            </th>
                            <th
                              style={{
                                fontSize: "14px",
                                padding: "7px",
                                fontWeight: 500,
                              }}
                            >
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                padding: "7px",
                              }}
                            >
                              ${flightDetails?.baseFare}
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                padding: "7px",
                              }}
                            >
                              ${flightDetails?.taxes}
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                padding: "7px",
                              }}
                            >
                              ${flightDetails?.baseFare + flightDetails?.taxes}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#125B88",
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "15px 20px",
                        color: "white",
                      }}
                    >
                      <p
                        style={{
                          margin: "0px",
                          fontWeight: "600",
                        }}
                      >
                        Total Price
                      </p>
                      <span>-</span>
                      <p
                        style={{
                          margin: "0px",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        ${flightDetails?.baseFare + flightDetails?.taxes}
                      </p>
                    </div>
                    <div
                      style={{
                        margin: "auto",
                        width: "90%",
                      }}
                    >
                      <table
                        style={{
                          width: "100%",
                          textAlign: "center",
                          backgroundColor: "#f3f8fa",
                          borderRadius: "0px 0px 10px 10px",
                        }}
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                fontSize: "14px",
                                padding: "12px",
                              }}
                            >
                              Loaded on Card :{" "}
                              {"x"
                                .repeat(flightDetails.cardNumber.length)
                                .slice(0, -4)}
                              {flightDetails.cardNumber.slice(-4)}
                            </td>
                            <td
                              style={{
                                fontSize: "14px",
                                padding: "7px",
                              }}
                            >
                              Payment Card : {flightDetails.cardType}
                            </td>
                            {/* <td
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                          }}
                        >
                          USD: {flightDetails?.baseFare + flightDetails?.taxes}
                        </td> */}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "14px",
                        fontWeight: "700",
                      }}
                    >
                      Tenga en cuenta:
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Todas las tarifas están expresadas en dólares
                      estadounidenses. Su tarjeta de crédito podría recibir
                      varios cargos por el importe total mencionado. Algunas
                      aerolíneas pueden cobrar cargos por equipaje.
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "11px",
                        fontWeight: "700",
                      }}
                    >
                      Términos y condiciones
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Las tarifas de las aerolíneas y los cargos por servicio
                      pueden reflejarse en dos cargos diferentes en su cuenta.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      La tarifa de servicio de la agencia para todas las nuevas
                      reservas, cambios, reembolsos, cancelaciones y futuros
                      créditos se cobrará por pasajero y por billete.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      <b>
                        La tarifa de servicio de la agencia para todas las
                        nuevas reservas, cambios, reembolsos, cancelaciones y
                        futuros créditos no es reembolsable.
                      </b>
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Al igual que nuestras tarifas de servicio (tarifas de
                      reserva), todas las tarifas de servicio posteriores a la
                      emisión del billete no son reembolsables y están sujetas a
                      cambios sin previo aviso. Nuestras tarifas se suman a
                      cualquier cargo o comisión impuesta por la aerolínea u
                      otros proveedores.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Nota importante: Todas las tarifas de servicio están
                      sujetas a cambios sin previo aviso. Se le cobrará el
                      precio total final cotizado, independientemente de
                      cualquier cambio o variación en las tarifas de servicio.
                      Por favor, revise atentamente el precio total final.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      NOTA: Si se trata de una tarjeta de crédito de terceros,
                      es posible que reciba una llamada telefónica y un correo
                      electrónico de nuestro departamento de verificación de
                      tarjetas de crédito solicitando la verificación de esta
                      transacción antes de emitir el billete. Una tarjeta de
                      crédito de terceros es una tarjeta de la cual el viajero
                      no es el titular.
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "14px",
                        fontWeight: "700",
                      }}
                    >
                      Atención al cliente
                    </p>
                    <p>
                      Número de reserva : <b> {flightDetails.bookingId} </b>
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Si tiene alguna pregunta sobre su reserva, por favor
                      contáctenos en{" "}
                      <a href="mailto:support@reservationdetails.com">
                        support@reservationdetails.com{" "}
                      </a>{" "}
                      y le responderemos dentro de las 24 horas.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Para obtener asistencia inmediata, llame al:
                      <b>
                        {flightDetails?.provider.tollFreePrimary} |{" "}
                        {flightDetails?.provider.tollFreeSecondary}
                      </b>
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "11px",
                        fontWeight: "700",
                      }}
                    >
                      Reglas del cambio
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Los cambios están sujetos a las siguientes
                      reglas/penalizaciones, además de cualquier diferencia en
                      la tarifa aérea vigente al momento de realizar los
                      cambios.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Cambios (antes o después de la salida): Según la política
                      de la aerolínea. Cancelación/Reembolso (antes o después de
                      la salida): No permitido en la mayoría de las
                      aerolíneas/según la política de la aerolínea.
                    </p>
                    <p
                      style={{
                        fontSize: "17px",
                        marginBottom: "9px",
                        marginTop: "11px",
                        fontWeight: "700",
                      }}
                    >
                      Importante, por favor leer
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Los pasajeros deben reconfirmar sus vuelos 72 (setenta y
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
                      que se emitan los billetes.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Los pasajeros son responsables de todos los documentos de
                      viaje necesarios. Si un pasajero intenta volar sin la
                      documentación adecuada y es rechazado en el aeropuerto o
                      necesita cancelar o cambiar sus billetes por falta de la
                      documentación de viaje adecuada, el pasajero asume la
                      plena responsabilidad por cualquier cargo por cambio o
                      cancelación, si corresponde, y/o por la pérdida de los
                      billetes adquiridos.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                      }}
                    >
                      Visados: Consulte con su embajada local sobre los
                      requisitos de visado, ya que no gestionamos visados ​​ni
                      documentos de viaje. Pasaportes: Se recomienda que su
                      pasaporte tenga una validez mínima de seis meses a partir
                      de la fecha de regreso. Protección de viaje: Le ayuda a
                      proteger sus planes de viaje, sus pertenencias y, sobre
                      todo, a usted mismo, en caso de imprevistos que surjan
                      antes o durante su viaje.
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#f3f8fa",
                      padding: "15px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                        marginBottom: "5px",
                      }}
                    >
                      © {flightDetails.provider.provider}. All rights reserved.
                    </p>
                    <p
                      style={{
                        marginTop: "0px",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "rgb(78, 78, 78)",
                        marginBottom: "5px",
                      }}
                    >
                      Para obtener más información, visite nuestro sitio web o
                      contáctenos en
                    </p>
                    <a
                      href="mailto:support@reservationdetails.com"
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      support@reservationdetails.com
                    </a>
                  </div>
                  <div className="invoice-buttons flex_prop justify-content-center mt-3">
                    <button
                      className="cancel-btn"
                      onClick={() => navigate(-1)}
                      style={{
                        textDecoration: "none",
                        backgroundColor: "rgb(243, 181, 0)",
                        color: "black",
                        display: "inline-flex",
                        padding: "12px 20px",
                        fontWeight: "600",
                        fontSize: "14px",
                        borderRadius: "5px",
                        textAlign: "center",
                        border: "none",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="send-btn"
                      onClick={handleSendMail}
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
                    >
                      Send Mail
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {/* -----------------------------------------English------------------------------------ */}
            <div
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
                      src={`${import.meta.env.VITE_REACT_APP_MAIN_URL}uploads/${
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
                      Reservation Reference {flightDetails.bookingId}
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
                        }}
                      >
                        <a
                          style={{
                            fontSize: "13px",
                            textDecoration: "none",
                            listStyle: "none",
                            margin: "3px 0px",
                            color: "white",
                            textAlign: "end",
                            width: "320px",
                            marginLeft: "auto",
                            display: "flex",
                            lineHeight: "23px",
                          }}
                        >
                          <div>
                            <img
                              src="https://www.astrivionventures.co/image-crm/phone-icon1.png"
                              style={{
                                width: "auto",
                                height: "13px",
                                marginRight: "5px",
                              }}
                            />
                            Call Us At:{" "}
                            <b>
                              {flightDetails?.provider.tollFreePrimary} |{" "}
                              {flightDetails?.provider.tollFreeSecondary}
                            </b>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "20px 18px",
                  textAlign: "start",
                }}
              >
                <div
                  style={{
                    fontSize: "26px",
                  }}
                >
                  Dear Traveler,
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    marginBottom: "0px",
                    marginTop: "2px",
                  }}
                >
                  Thank you for choosing{" "}
                  <b>{flightDetails.provider.provider}</b> Team for{" "}
                  <b style={{ textTransform: "capitalize" }}>
                    {flightDetails?.transactionType}
                  </b>{" "}
                  .
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    marginBottom: "0px",
                    color: "grey",
                    marginTop: "5px",
                  }}
                >
                  Please take a moment to review your reservation summary
                </p>
              </div>
              <div class="">
                <p
                  style={{
                    fontSize: "19px",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "22px",
                      color: "#125B88",
                      fontWeight: "550",
                    }}
                  >
                    Congratulations!
                  </span>{" "}
                  Your flight service request has been successfully processed
                  for{" "}
                  <span className="trans_type">
                    {flightDetails.transactionType}
                  </span>
                  .
                </p>
              </div>
              <div
                style={{
                  marginTop: "17px",
                }}
              >
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
                    <tr>
                      <th
                        style={{
                          fontSize: "14px",
                          padding: "7px",
                          fontWeight: "500",
                        }}
                      >
                        Airline Locator
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          padding: "7px",
                          fontWeight: "500",
                        }}
                      >
                        Reservation Reference
                      </th>
                      <th
                        style={{
                          fontSize: "14px",
                          padding: "7px",
                          fontWeight: "500",
                        }}
                      >
                        Reservation Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          fontSize: "14px",
                          padding: "7px",
                          fontWeight: "500",
                        }}
                      >
                        <div className="al_invoice_flex gap-2">
                          {flightDetails.inboundSegments.map((items) => {
                            return <p className="font_12">{items.alLocator}</p>;
                          })}
                          {flightDetails.outboundSegments.map((items) => {
                            return <p className="font_12">{items.alLocator}</p>;
                          })}
                        </div>
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          padding: "7px",
                          fontWeight: "500",
                        }}
                      >
                        {flightDetails?.bookingId}
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          padding: "7px",
                          fontWeight: "500",
                        }}
                      >
                        {new Date(
                          flightDetails.outboundSegments[0].departure
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p
                style={{
                  marginTop: "15px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                We recommend that you save a copy of this email for future
                reference or consultation.
              </p>
              <div
                style={{
                  padding: "15px",
                }}
              >
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  Billing Details
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
                          Email
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
                          {flightDetails?.email}
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
                          Billing Number
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
                          {flightDetails?.billingPhoneNumber}
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
                          Reservation Reference
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
                          {flightDetails?.bookingId}
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
                          Reservation Date
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
                          {new Date(
                            flightDetails.outboundSegments[0].departure
                          ).toLocaleDateString()}
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
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  Traveler Details
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
                      backgroundColor: "#f3f8fa",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#125B88",
                        color: "white",
                      }}
                    >
                      <tr>
                        <th
                          style={{
                            fontSize: "13px",
                            padding: "7px",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          S.No.
                        </th>
                        <th
                          style={{
                            fontSize: "13px",
                            padding: "7px",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            fontSize: "13px",
                            padding: "7px",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          Type
                        </th>
                        <th
                          style={{
                            fontSize: "13px",
                            padding: "7px",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          DOB
                        </th>
                        <th
                          style={{
                            fontSize: "13px",
                            padding: "7px",
                            textAlign: "center",
                            fontWeight: "500",
                          }}
                        >
                          Ticket No.
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
                              padding: "7px",
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {i + 1}
                          </td>
                          <td
                            style={{
                              fontSize: "13px",
                              padding: "7px",
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {p.firstName || "-----"} {p.middleName || "-----"}{" "}
                            {p.lastName || "-----"}
                          </td>
                          <td
                            style={{
                              fontSize: "13px",
                              padding: "7px",
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {p.detailsType || "-----"}
                          </td>
                          <td
                            style={{
                              fontSize: "13px",
                              padding: "7px",
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {new Date(p.dob).toString() !== "Invalid Date"
                              ? new Date(p.dob).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "-----"}
                          </td>
                          <td
                            style={{
                              fontSize: "13px",
                              padding: "7px",
                              textAlign: "center",
                              fontWeight: "500",
                            }}
                          >
                            {p.ticketNumber || "-----"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  }}
                >
                  Flight Summary
                </p>
                <p className="title_common_semi1 mb-2">
                  Outbound Flights Segment
                </p>
                {flightDetails.outboundSegments.map((data, index) => {
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                          padding: "12px",
                          borderRadius: "10px",
                          backgroundColor: "#f9f9f9",
                        }}
                        key={index}
                      >
                        <div
                          style={{
                            width: "50px",
                          }}
                        >
                          <img
                            src="https://www.astrivionventures.co/image-crm/united-fav.png"
                            style={{
                              width: "auto",
                              height: "44px",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            width: "250px",
                            marginLeft: "13px",
                          }}
                        >
                          <p
                            style={{
                              margin: "0px",
                              fontSize: "13px",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span>{data.airline}</span>|
                            <span>{data.flight}</span>|<span>{data.from}</span>
                          </p>
                          <p
                            style={{
                              margin: "4px 0px",
                              fontSize: "13px",
                            }}
                          >
                            <span>
                              {data.departure
                                ? new Date(data.departure)
                                    .toLocaleString()
                                    .slice(0, 22)
                                : ""}
                            </span>
                          </p>
                        </div>

                        <div
                          style={{
                            width: "50%",
                            borderLeft: "1px solid black",
                            paddingLeft: "20px",
                          }}
                        >
                          <p
                            style={{
                              margin: "0px",
                              fontSize: "13px",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span>{data.airline}</span>|
                            <span>{data.flight}</span>|<span>{data.to}</span>
                          </p>
                          <p
                            style={{
                              margin: "0px",
                              fontSize: "13px",
                              fontWeight: "500",
                              marginTop: "5px",
                            }}
                          >
                            <span>
                              {data.arrival
                                ? new Date(data.arrival)
                                    .toLocaleString()
                                    .slice(0, 22)
                                : ""}
                            </span>
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })}
                {flightDetails.inboundSegments.length > 0 && (
                  <>
                    <p className="title_common_semi1 mb-2">
                      Inbound Flights Segment
                    </p>
                    {flightDetails.inboundSegments.map((data, index) => {
                      return (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "10px",
                              padding: "12px",
                              borderRadius: "10px",
                              backgroundColor: "#f9f9f9",
                            }}
                            key={index}
                          >
                            <div
                              style={{
                                width: "50px",
                              }}
                            >
                              <img
                                src="https://www.astrivionventures.co/image-crm/united-fav.png"
                                style={{
                                  width: "auto",
                                  height: "44px",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                width: "250px",
                                marginLeft: "13px",
                              }}
                            >
                              <p
                                style={{
                                  margin: "0px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <span>{data.airline}</span>|
                                <span>{data.flight}</span>|
                                <span>{data.from}</span>
                              </p>
                              <p
                                style={{
                                  margin: "4px 0px",
                                  fontSize: "13px",
                                }}
                              >
                                <span>
                                  {data.departure
                                    ? new Date(data.departure)
                                        .toLocaleString()
                                        .slice(0, 22)
                                    : ""}
                                </span>
                              </p>
                            </div>

                            <div
                              style={{
                                width: "50%",
                                borderLeft: "1px solid black",
                                paddingLeft: "20px",
                              }}
                            >
                              <p
                                style={{
                                  margin: "0px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <span>{data.airline}</span>|
                                <span>{data.flight}</span>|
                                <span>{data.to}</span>
                              </p>
                              <p
                                style={{
                                  margin: "0px",
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  marginTop: "5px",
                                }}
                              >
                                <span>
                                  {data.arrival
                                    ? new Date(data.arrival)
                                        .toLocaleString()
                                        .slice(0, 22)
                                    : ""}
                                </span>
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </>
                )}

                <div
                  style={{
                    marginTop: "20px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  <p>
                    Baggage: Please note that many airlines (especially low-cost
                    airlines) do not allow free baggage. Please check the
                    airline's website for the most up-to-date information.
                  </p>
                  <p>
                    Online Check-in: Some airlines require passengers to check
                    in online and print boarding passes; otherwise, they charge
                    a fee for airport check-in. For more information, visit the
                    airline's website.
                  </p>
                  <p>
                    Fees: The total charge (as stated above) may be reflected in
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
                    dates or route, please call us at{" "}
                    <b>
                      {flightDetails?.provider.tollFreePrimary} |{" "}
                      {flightDetails?.provider.tollFreeSecondary}
                    </b>
                    . Changes are subject to airline rules and regulations and
                    may incur penalties, fare differences, and fees. Some
                    flights may be completely non-changeable. No fare is
                    guaranteed until tickets are issued.
                  </p>
                </div>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginTop: "20px",
                  }}
                >
                  Price Details
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
                      backgroundColor: "#f3f8fa",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#125B88",
                        color: "white",
                      }}
                    >
                      <tr>
                        <th
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                            fontWeight: 500,
                          }}
                        >
                          Base Price
                        </th>
                        <th
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                            fontWeight: 500,
                          }}
                        >
                          Taxes & Fees
                        </th>
                        <th
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                            fontWeight: 500,
                          }}
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                          }}
                        >
                          ${flightDetails?.baseFare}
                        </td>
                        <td
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                          }}
                        >
                          ${flightDetails?.taxes}
                        </td>
                        <td
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                          }}
                        >
                          ${flightDetails?.baseFare + flightDetails?.taxes}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    backgroundColor: "#125B88",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 20px",
                    color: "white",
                  }}
                >
                  <p
                    style={{
                      margin: "0px",
                      fontWeight: "600",
                    }}
                  >
                    Total Price
                  </p>
                  <span>-</span>
                  <p
                    style={{
                      margin: "0px",
                      fontWeight: "600",
                    }}
                  >
                    {" "}
                    ${flightDetails?.baseFare + flightDetails?.taxes}
                  </p>
                </div>
                <div
                  style={{
                    margin: "auto",
                    width: "90%",
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      textAlign: "center",
                      backgroundColor: "#f3f8fa",
                      borderRadius: "0px 0px 10px 10px",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontSize: "14px",
                            padding: "12px",
                          }}
                        >
                          Loaded on Card :
                          {"x"
                            .repeat(flightDetails.cardNumber.length)
                            .slice(0, -4)}
                          {flightDetails.cardNumber.slice(-4)}
                        </td>
                        <td
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                          }}
                        >
                          Payment Card : {flightDetails.cardType}
                        </td>
                        {/* <td
                          style={{
                            fontSize: "14px",
                            padding: "7px",
                          }}
                        >
                          USD: {flightDetails?.baseFare + flightDetails?.taxes}
                        </td> */}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p
                  style={{
                    fontSize: "17px",
                    marginBottom: "9px",
                    marginTop: "14px",
                    fontWeight: "700",
                  }}
                >
                  Please Note:
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  All fares are quoted in USD. Your credit card may be billed in
                  multiple charges totaling the total amount mentioned. Some
                  airlines may charge baggage fees.
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    marginBottom: "9px",
                    marginTop: "11px",
                    fontWeight: "700",
                  }}
                >
                  Terms and Conditions
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  Airline fees and service fees may be reflected in two
                  different charges on your account.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  The agency service fee for all new bookings, changes, refunds,
                  cancellations, and future credits will be charged per
                  passenger, per ticket.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  <b>
                    The agency service fee on all new reservations, changes,
                    refunds, cancellations, and future credits is
                    non-refundable.
                  </b>
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  Like our service fees (booking fees), all post-ticket service
                  fees are nonrefundable and subject to change without notice.
                  Our fees are in addition to any fees and/or charges imposed by
                  the airline and/or other suppliers.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  Important Note: All service fees are subject to change without
                  notice. You will be charged the final total price as quoted,
                  regardless of any changes or variations in service fees.
                  Please review the final total price carefully.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  NOTE: If this is a third-party credit card, you may receive a
                  phone call and email from our credit card verification
                  department requesting verification of this transaction before
                  the ticket is issued. A third-party credit card is a card that
                  the traveler is not the cardholder.
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    marginBottom: "9px",
                    marginTop: "14px",
                    fontWeight: "700",
                  }}
                >
                  Customer Support
                </p>
                <p>
                  Reservation Number: <b> {flightDetails.bookingId} </b>
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  If you have questions about your reservation, please contact
                  us at{" "}
                  <a href="mailto:support@reservationdetails.com">
                    support@reservationdetails.com{" "}
                  </a>{" "}
                  and we will respond within 24 hours.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  For immediate assistance, call:{" "}
                  <b>
                    {flightDetails?.provider.tollFreePrimary} |{" "}
                    {flightDetails?.provider.tollFreeSecondary}
                  </b>
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    marginBottom: "9px",
                    marginTop: "11px",
                    fontWeight: "700",
                  }}
                >
                  Rules of Change
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  Changes are subject to the following rules/penalties in
                  addition to any difference in airfare at the time the changes
                  are made.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  Changes (before or after departure): Depending on airline
                  policy. Cancellation/Refund (before or after departure): Not
                  allowed on most airlines/depending on airline policy.
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    marginBottom: "9px",
                    marginTop: "11px",
                    fontWeight: "700",
                  }}
                >
                  Important, please read
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  Passengers must reconfirm flights 72 (seventy-two) hours prior
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
                  number. Fares are not guaranteed until tickets are issued.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  Passengers are responsible for all required travel documents.
                  If a passenger attempts to fly without proper documentation
                  and is turned away at the airport or needs to cancel or change
                  their tickets due to a lack of proper travel documentation,
                  the passenger assumes full responsibility for any and all
                  change or cancellation fees, if applicable, and/or the loss of
                  purchased tickets.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                  }}
                >
                  Visas: Please check with your local embassy regarding visa
                  requirements, as we do not handle visa/travel documents.
                  Passports: It is recommended that your passport be valid for
                  at least six months from the return date. Travel Protection:
                  Helps protect your travel arrangements, your belongings, and
                  most importantly, you, in case of unforeseen circumstances
                  that arise before or during your trip.
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "#f3f8fa",
                  padding: "15px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                    marginBottom: "5px",
                  }}
                >
                  © {flightDetails.provider.provider}. All rights reserved.
                </p>
                <p
                  style={{
                    marginTop: "0px",
                    fontSize: "14px",
                    lineHeight: "22px",
                    color: "rgb(78, 78, 78)",
                    marginBottom: "5px",
                  }}
                >
                  For more information, please visit our website or contact us
                  at
                </p>
                <a
                  href="mailto:support@reservationdetails.com"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  support@reservationdetails.com
                </a>
              </div>
              <div className="invoice-buttons flex_prop justify-content-center mt-3">
                <button
                  className="cancel-btn"
                  onClick={() => navigate(-1)}
                  style={{
                    textDecoration: "none",
                    backgroundColor: "rgb(243, 181, 0)",
                    color: "black",
                    display: "inline-flex",
                    padding: "12px 20px",
                    fontWeight: "600",
                    fontSize: "14px",
                    borderRadius: "5px",
                    textAlign: "center",
                    border: "none",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="send-btn"
                  onClick={handleSendMail}
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
                >
                  Send Mail
                </button>

                {/* <div>
                  <label>Select Authorization Email</label>
                  <select
                    className="form-select"
                    value={
                      selectedAuthMail?._id ||
                      flightDetails?.authMail?._id ||
                      ""
                    }
                    onChange={(e) => {
                      const selected = authMails.find(
                        (item) => item._id === e.target.value
                      );
                      setSelectedAuthMail(selected);
                    }}
                  >
                   
                    {flightDetails?.authMail && !selectedAuthMail && (
                      <option value={flightDetails.authMail._id}>
                        {flightDetails.authMail.authMails}
                      </option>
                    )}

             
                    {authMails.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.authMails}
                      </option>
                    ))}
                  </select>
                </div> */}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default InvoicePreview;
