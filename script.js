const messagesEl = document.querySelector('.messages');
const inputEl = document.querySelector('.composer .input');
const sendBtn = document.querySelector('.composer .send');

function timeNow() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function appendMessage({ role = 'user', text = '' }) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role}`;

  if (role === 'assistant') {
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = 'T';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = `<p>${escapeHtml(text)}</p><span class="time">${timeNow()}</span>`;

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
  } else {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = `<p>${escapeHtml(text)}</p><span class="time">${timeNow()}</span>`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar user-avatar';
    avatar.textContent = 'M';

    wrapper.appendChild(bubble);
    wrapper.appendChild(avatar);
  }

  messagesEl.appendChild(wrapper);
  scrollToBottom();
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function scrollToBottom() {
  messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
}

function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  appendMessage({ role: 'user', text });
  inputEl.value = '';
  // simple auto-reply stub
  setTimeout(() => {
    appendMessage({ role: 'assistant', text: `Thanks! I received: "${text}"` });
  }, 700);
}

sendBtn.addEventListener('click', sendMessage);

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// initial scroll to bottom on load
window.addEventListener('load', () => setTimeout(scrollToBottom, 50));
