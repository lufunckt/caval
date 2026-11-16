import { ArrowUpRight } from "lucide-react";
import { CONFIG } from "../config";
import heroSunsetPhoto from "../assets/images/ChatGPT Image 14 de mai. de 2026, 04_47_06.png";
import ericoPortrait from "../assets/images/about-erico-D9eoGtnm.jpg";

export function Hero() {
  return (
    <section id="hero" className="editorial-hero" aria-labelledby="hero-headline">
      <p className="gallery-note">Antes do comando,<br />existe <strong>relação.</strong></p>
      <div className="editorial-collage">
        <div className="editorial-collage__tile editorial-collage__tile--peach">
          <img src={ericoPortrait} alt="Érico Cavalheiro" decoding="async" />
        </div>
        <div className="editorial-collage__tile editorial-collage__tile--yellow" aria-hidden="true">
          <img src={heroSunsetPhoto} alt="" decoding="async" />
        </div>
        <div className="editorial-collage__tile editorial-collage__tile--blue">
          <img src={heroSunsetPhoto} alt="Érico caminhando com um cão ao pôr do sol" fetchPriority="high" decoding="async" />
        </div>
        <div className="editorial-collage__tile gallery-detail" aria-hidden="true"><img src={ericoPortrait} alt="" decoding="async" /></div>
      </div>
      <div className="editorial-hero__copy">
        <p className="editorial-kicker">Érico Cavalheiro · Educação Relacional</p>
        <h1 id="hero-headline">Adestramento online para cães</h1>
        <p>Seu cão late ou avança ao ver outros cães? Converse com o adestrador Érico Cavalheiro por videochamada, de qualquer lugar do Brasil, e receba orientações para o passeio e a rotina em casa.</p>
        <a id="hero-cta-whatsapp" className="editorial-action" href={CONFIG.WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          Agendar pelo WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
        </a>
        <a className="editorial-secondary" href="#aula-online">Como funciona o atendimento</a>
      </div>
    </section>
  );
}
