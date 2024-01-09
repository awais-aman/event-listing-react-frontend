import React from "react";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebook,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="d-flex flex-column h-100 position-relative footer">
      <footer
        className="w-100 pt-4 flex-shrink-0 pb-0"
        style={{ background: "#000F0D" }}
      >
        <div className="container pt-4 pb-0">
          <Container>
            <div className="row gy-4 gx-5">
              <div className="col-lg-4 col-md-6">
                <h5 className="h1 text-white">Events</h5>
                <p className="roboto-regular-14px-information text-white mt-5">
                  Maecenas consectetur in a a imperdiet nunc cras ipsum.
                  Consequat sed eu sed pharetra velit.
                </p>
              </div>
              <div className="col-lg-4 col-md-6 links-container">
                <ul className="ps-0">
                  <li className="col-heading">
                    <h3> Resources </h3>
                  </li>
                  <li className="list-unstyled">
                    <a
                      href="/"
                      className="roboto-regular-14px-information text-white"
                    >
                      For him
                    </a>
                  </li>
                  <li className="list-unstyled">
                    <a
                      href="/"
                      className="roboto-regular-14px-information text-white"
                    >
                      For her
                    </a>
                  </li>
                  <li className="list-unstyled">
                    <a
                      href="/"
                      className="roboto-regular-14px-information text-white"
                    >
                      Event types
                    </a>
                  </li>
                  <li className="list-unstyled">
                    <a
                      href="/"
                      className="roboto-regular-14px-information text-white"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-lg-4 col-md-6 links-container">
                <ul className="ps-0">
                  <li className="col-heading">
                    <h3> Contact </h3>
                  </li>
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ color: "#A0C49D", marginRight: "14px" }}
                    />
                    <li
                      className="p-0 m-0 text-decoration-none list-unstyled"
                    >
                      <a
                        href="/"
                        className="roboto-regular-14px-information text-white"
                      >
                        example@events.com
                      </a>
                    </li>
                  </div>
                  <div className="d-flex">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{
                          color: "#A0C49D",
                          marginRight: "14px",
                          marginLeft: "2px",
                        }}
                      />
                    </div>
                    <div className="d-flex align-items-center">
                      <li
                        className="p-0 m-0 mt-3 text-decoration-none list-unstyled"
                      >
                        <a
                          href="/"
                          className="roboto-regular-14px-information text-white text-right"
                        >
                          A cursus turpis eu a pellentesque. Nulla neque donec
                          mauris at.
                        </a>
                      </li>
                    </div>
                  </div>
                  <li>
                    <div
                      className="col item social d-flex align-items-center justify-content-between mt-5"
                      style={{ width: "204px" }}
                    >
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                          icon={faFacebook}
                          className="text-white"
                          size="2xl"
                        />
                      </a>
                      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                          icon={faInstagram}
                          className="text-white"
                          size="2xl"
                        />
                      </a>
                      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                          icon={faYoutube}
                          className="text-white"
                          size="2xl"
                        />
                      </a>
                      <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                          icon={faTiktok}
                          className="text-white"
                          size="2xl"
                        />
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="d-flex align-items-center justify-content-center p-4 mt-3"
              style={{ borderTop: "1px solid #ffffff1a" }}
            >
              <span
                className="copyright roboto-regular-14px-information text-white"
                style={{ opacity: "0.6" }}
              >
                Events © 2023 - All Right Are Reserved
              </span>
            </div>
          </Container>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
