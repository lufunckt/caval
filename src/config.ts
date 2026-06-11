/**
 * Central configuration file for Érico Cavalheiro's website integration links.
 * All CTA buttons and connections consume these constants.
 */

// Custom message for WhatsApp redirect
const whatsappMessage = encodeURIComponent(
  "Olá Érico, gostaria de agendar uma conversa sobre a educação do meu cão e entender melhor o método de Educação Relacional."
);

export const CONFIG = {
  // WhatsApp URL (CTA principal)
  WHATSAPP_URL: `https://wa.me/5555997240369?text=${whatsappMessage}`,

  // Instagram profile
  INSTAGRAM_URL: "https://www.instagram.com/erico.educacaorelacional/",

  // Raw contact Email
  EMAIL: "ericocavalheiro.psico@gmail.com",

  // Mailto link derived from EMAIL
  get EMAIL_URL() {
    return `mailto:${this.EMAIL}?subject=Contato%20-%20Educa%C3%A7%C3%A3o%20Relacional`;
  },

  // Ebook lead collection URL (Tally)
  TALLY_EBOOK_URL: "https://tally.so/r/wMDpPe",

  // Direct Ebook download from public folder
  EBOOK_FILE_URL: "/vinculo-sem-comando.pdf",
};
