import React, { useRef, useEffect, useState } from 'react';
import '../styles/About.css';

import borkoImg from '../assets/borko.png';
import pendaImg from '../assets/penda.png';
import aleksaImg from '../assets/aleksa.png';

const team = [
  {
    name: "Borko",
    role: "Vlasnik & ekspert za mehaniku",
    img: borkoImg,
    desc: "Osnivač servisa i glavni mehaničar. Više od 15 godina iskustva u popravci i restauraciji automobila. Strastven, precizan i uvijek spreman pomoći svakom klijentu.",
    direction: "left"
  },
  {
    name: "Penda",
    role: "Detailing & čišćenje",
    img: pendaImg,
    desc: "Zadužen za čišćenje i davanje sjaja automobilima. Svako vozilo nakon njegovih ruku izgleda kao iz salona. Perfekcionista u svakom detalju.",
    direction: "right"
  },
  {
    name: "Aleksa",
    role: "Mehaničar",
    img: aleksaImg,
    desc: "Specijalista za mehaniku i održavanje. Pouzdan, temeljit i uvijek spreman da pronađe rješenje za svaki tehnički izazov.",
    direction: "left"
  }
];

function About() {
  // Kreiraj refove i stanja za svaki član
  const refs = useRef(team.map(() => React.createRef()));
  const [inViews, setInViews] = useState(team.map(() => false));

  useEffect(() => {
    const observers = refs.current.map((ref, idx) => {
      return new window.IntersectionObserver(
        ([entry]) => {
          setInViews(prev => {
            const copy = [...prev];
            copy[idx] = entry.isIntersecting;
            return copy;
          });
        },
        { threshold: 0.4 }
      );
    });

    refs.current.forEach((ref, idx) => {
      if (ref.current) observers[idx].observe(ref.current);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-nobox">
      <h1 className="about-title">O nama</h1>
      <p>
        <strong>Budući Klasici</strong> je tim zaljubljenika u automobile, mehaniku i detailing. Naša misija je da svaki automobil, bez obzira na godine, zablista kao nov i da vlasnici budu sigurni u njegovu pouzdanost.
      </p>
      <p>
        Kroz godine iskustva, stekli smo povjerenje stotina zadovoljnih klijenata. Naš pristup je profesionalan, iskren i temelji se na stalnom učenju i praćenju najnovijih tehnologija u auto industriji.
      </p>
      <p>
        Pored servisa i detailinga, želimo podijeliti ljubav prema automobilima kroz edukativne i zabavne sadržaje na našim društvenim mrežama i YouTube kanalu. Pratite nas i budite dio zajednice koja cijeni kvalitet, znanje i strast prema automobilima!
      </p>
      <p>
        <strong>Vaš auto, naša briga – Budući Klasici.</strong>
      </p>

      <h2 className="team-title">Naš tim</h2>
      <div className="team-list">
        {team.map((member, idx) => (
          <div
            ref={refs.current[idx]}
            className={`team-member-anim ${member.direction} ${inViews[idx] ? "in-view" : "out-view"}`}
            key={member.name}
          >
            <img src={member.img} alt={member.name} className="team-img-large" />
            <div className="team-info">
              <h3>{member.name}</h3>
              <span>{member.role}</span>
              <p>{member.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;




