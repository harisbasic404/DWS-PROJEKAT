import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import '../styles/index.css';
import '../styles/Home.css';
import logo from '../assets/logo.png';
import mechanicBg from '../assets/mehanika.png'; // Dodaj svoju sliku
import detailingBg from '../assets/detailing.png'; // Dodaj svoju sliku

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate('/reservation');
    } else {
      alert("Morate biti prijavljeni da biste napravili rezervaciju.");
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <div className="wave-top"></div>
      {/* HERO SEKCIJA */}
      <section className="hero">
        <div className="hero-particles">
          <div className="particle" style={{ left: '12%', top: '80%', animationDelay: '0s' }} />
          <div className="particle" style={{ left: '70%', top: '90%', animationDelay: '1.2s' }} />
          <div className="particle" style={{ left: '40%', top: '60%', animationDelay: '2.1s' }} />
          <div className="particle" style={{ left: '85%', top: '30%', animationDelay: '3.3s' }} />
          <div className="particle" style={{ left: '25%', top: '20%', animationDelay: '4.5s' }} />
        </div>
        <img src={logo} alt="Budući Klasici Logo" className="hero-logo" />
        <h1>Dobrodošli u <span className="highlight">Buduće Klasike</span></h1>
        <p>Vaš pouzdani partner za <strong>auto mehaniku</strong> i <strong>detailing</strong></p>
        <button className="cta-button" onClick={handleClick}>Zakažite termin</button>
      </section>

      {/* USLUGE */}
      <section className="services">
        <h2>Naše usluge</h2>
        <div className="service-grid two-cols">
          <div
            className="service-box service-mehanika"
            onClick={() => navigate('/services')}
            style={{
              backgroundImage: `url(${mechanicBg})`
            }}
          >
            <div className="service-overlay"></div>
            <h3>Mehanika</h3>
          </div>
          <div
            className="service-box service-detailing"
            onClick={() => navigate('/services')}
            style={{
              backgroundImage: `url(${detailingBg})`
            }}
          >
            <div className="service-overlay"></div>
            <h3>Detailing</h3>
          </div>
        </div>
      </section>

      {/* ZAŠTO IZABRATI NAS */}
      <section className="why-us">
        <h2>Zašto izabrati nas?</h2>
        <div className="why-grid">
          <div className="why-box">
            <strong>Iskustvo i stručnost</strong>
            <p>Više od 10 godina iskustva u auto industriji.</p>
          </div>
          <div className="why-box">
            <strong>Garancija na rad</strong>
            <p>Sve usluge pokrivene garancijom i podrškom.</p>
          </div>
          <div className="why-box">
            <strong>Moderni alati</strong>
            <p>Koristimo najsavremeniju opremu i sredstva.</p>
          </div>
          <div className="why-box">
            <strong>Zadovoljni klijenti</strong>
            <p>Stotine pozitivnih recenzija i stalnih mušterija.</p>
          </div>
        </div>
      </section>

      {/* RECENZIJE */}
      <section className="reviews">
        <h2>Šta kažu naši klijenti?</h2>
        <div className="review-grid">
          <div className="review-box">
            <p>"Auto mi je nakon detailinga izgledao kao nov! Sve preporuke!"</p>
            <span>- Emir S.</span>
          </div>
          <div className="review-box">
            <p>"Brza dijagnostika i profesionalan pristup. Vraćam se sigurno."</p>
            <span>- Amra K.</span>
          </div>
          <div className="review-box">
            <p>"Odlična ekipa, sve su objasnili i popravili po dogovoru."</p>
            <span>- Marko P.</span>
          </div>
        </div>
      </section>

      {/* YOUTUBE SEKCIJA */}
      <section className="yt-section">
        <h2>Pogledajte nas u akciji</h2>
        <div className="yt-video-wrapper">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/fITgFcpvhnU"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <a
          className="yt-btn"
          href="https://www.youtube.com/@Buduci_Klasici"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pratite nas na YouTube-u
        </a>
      </section>
    </div>
  );
}

export default Home;
