import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getFirestore, doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const firebaseConfig = {
  projectId: 'gen-lang-client-0831166793',
  appId: '1:797002648177:web:fca043f1c383ded66be9d0',
  apiKey: 'AIzaSyDCNdZR4QGFZQk_p2hsv3GBb_uVW84Qt1g',
  authDomain: 'gen-lang-client-0831166793.firebaseapp.com',
  storageBucket: 'gen-lang-client-0831166793.firebasestorage.app',
  messagingSenderId: '797002648177'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');
const button = document.querySelector('#submit-button');
const dialog = document.querySelector('#success-dialog');
const closeDialog = document.querySelector('#close-dialog');

const normalizePhone = value => value.replace(/\D/g, '');
const formatPhone = value => {
  const digits = normalizePhone(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
};

document.querySelector('#whatsapp').addEventListener('input', event => {
  event.target.value = formatPhone(event.target.value);
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  status.textContent = '';
  status.className = 'status';

  const name = document.querySelector('#name').value.trim();
  const whatsapp = normalizePhone(document.querySelector('#whatsapp').value);
  const consent = document.querySelector('#consent').checked;

  if (name.length < 2) return showError('Digite seu nome.');
  if (!/^\d{10,11}$/.test(whatsapp)) return showError('Digite um WhatsApp válido com DDD.');
  if (!consent) return showError('É necessário autorizar o envio do material.');

  button.disabled = true;
  button.textContent = 'ENVIANDO...';

  try {
    const id = crypto.randomUUID();
    const params = new URLSearchParams(location.search);
    await setDoc(doc(db, 'ebook_leads', id), {
      id,
      email: `${whatsapp}@lead.whatsapp`,
      name,
      whatsapp: `55${whatsapp}`,
      consent: true,
      source: 'landing-antes-do-comando',
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      createdAt: serverTimestamp()
    });
    form.reset();
    dialog.showModal();
  } catch (error) {
    console.error(error);
    showError('Não foi possível concluir agora. Tente novamente em instantes.');
  } finally {
    button.disabled = false;
    button.textContent = 'QUERO RECEBER O EBOOK';
  }
});

function showError(message) {
  status.textContent = message;
  status.className = 'status error';
}
closeDialog.addEventListener('click', () => dialog.close());
