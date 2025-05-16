import React from 'react';
import '../styles/Footer.css';
import carIcon from '../assets/car-icon.png';
import youtubeIcon from '../assets/youtube.png';
import instagramIcon from '../assets/instagram.png';
import shoppingBagIcon from '../assets/shopping-bag.png';
import tiktokIcon from '../assets/tik-tok.png';

function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-content">
        <div className="footer-info">
          <h3>Budući Klasici</h3>
          <p className="footer-moto">Vaš auto, naša briga – mehanika i detailing na jednom mjestu!</p>
          <p>Auto servis &amp; detailing</p>
          <p>
            <strong>Adresa:</strong> Sarajevo, BiH<br />
            <strong>Telefon:</strong> +387 61 123 456<br />
            <strong>Email:</strong> info@buduciklasici.com
          </p>
          <p>
            <strong>Radno vrijeme:</strong><br />
            Pon - Pet: 08:00 - 17:00<br />
            Subota: 09:00 - 14:00<br />
            Nedjelja: Zatvoreno
          </p>
          <a href="tel:+38761123456" className="footer-cta-btn">Pozovi odmah</a>
          {/* <a href="/profil" className="footer-cta-btn">Profil</a> */}
        </div>
        <div className="footer-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4045.091068350559!2d17.911548151519266!3d44.20065402692949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475ee238fb53d32f%3A0xf3e11869aa28a8ad!2sSTRONG%20AUTO!5e0!3m2!1shr!2sba!4v1747247084594!5m2!1shr!2sba"
            width="100%"
            height="220"
            style={{ border: 0, borderRadius: 12, minWidth: 240, minHeight: 140, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokacija"
          ></iframe>
        </div>
        <div className="footer-social">
          <h4>Pratite nas:</h4>
          <div className="social-icons">
            <a href="https://www.youtube.com/@Buduci_Klasici" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon} alt="YouTube" />
            </a>
            <a href="https://www.tiktok.com/@buduci_klasici" target="_blank" rel="noopener noreferrer">
              <img src={tiktokIcon} alt="TikTok" />
            </a>
            <a href="https://www.instagram.com/buduci_klasici/" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a href="https://buduciklasici.com/" target="_blank" rel="noopener noreferrer">
              <img src={shoppingBagIcon} alt="Web shop" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2025 Budući Klasici. Sva prava zadržana.</span>
      </div>
      <img
        src={carIcon}
        alt="Car watermark"
        className="footer-watermark"
      />
    </footer>
  );
}

export default Footer;