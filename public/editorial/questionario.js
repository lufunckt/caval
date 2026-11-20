const form = document.querySelector('#quiz');
const panels = [...form.querySelectorAll('fieldset')];
const next = form.querySelector('[type=submit]');
const back = form.querySelector('.back');
const error = document.querySelector('#error');
let step = 0;
let questionnaireStarted = false;
let questionnaireCompleted = false;

function showStep() {
  panels.forEach((panel, index) => {
    panel.hidden = index !== step;
    panel.disabled = index !== step;
  });
  back.hidden = step === 0;
  next.hidden = step === panels.length - 1;
  error.hidden = true;
  document.querySelector('#progress').textContent = 'Etapa ' + (step + 1) + ' de ' + panels.length;
  const title = panels[step].querySelector('legend');
  title.tabIndex = -1;
  title.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (step === 0 && !form.elements.dog.value.trim()) {
    error.hidden = false;
    form.elements.dog.focus();
    return;
  }
  if (!questionnaireStarted) { questionnaireStarted = true; window.ericoTrack?.('questionnaire_start', 'form'); }
  if (step === 2) {
    const value = (name) => form.elements.namedItem(name).value.trim();
    const lines = ['Olá, Érico! Preenchi o questionário de comportamento canino.', '',
      'Nome: ' + value('dog'), 'Idade: ' + (value('age') || 'Não informada'),
      'Raça: ' + (value('breed') || 'Não informada'), '',
      'Comportamento principal: ' + value('issue'), 'Intensidade: ' + value('intensity')];
    if (value('notes')) lines.push('Relato: ' + value('notes'));
    lines.push('', 'Gostaria de conversar sobre a rotina do meu cão e saber como funciona a consulta.');
    if (!questionnaireCompleted) { questionnaireCompleted = true; window.ericoTrack?.('questionnaire_complete', 'form'); }
    const message = lines.join(String.fromCharCode(10));
    document.querySelector('#review').textContent = message;
    document.querySelector('#send').href = 'https://wa.me/5555997240369?text=' + encodeURIComponent(message);
  }
  if (step < panels.length - 1) { step++; showStep(); }
});

back.addEventListener('click', () => { if (step > 0) { step--; showStep(); } });
