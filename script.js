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
    
    
    bubble.innerHTML = `
        <div class="markdown-content">${marked.parse(text)}</div>
        <span class="time">${timeNow()}</span>
    `;

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
 
  const safeString = String(unsafe); 
  return safeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function scrollToBottom() {
  messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
}



async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

//user message
  appendMessage({ role: 'user', text });
  inputEl.value = '';


  const typingId = "typing-" + Date.now();
  const typingWrapper = document.createElement('div');
  typingWrapper.id = typingId;
  typingWrapper.className = 'message assistant';
  typingWrapper.innerHTML = `<div class="avatar">T</div><div class="bubble"><p>...</p></div>`;
  messagesEl.appendChild(typingWrapper);
  scrollToBottom();

  try {
    const response = await fetch("https://santacl-bkg.hf.space/chat",
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "user_id": "chioma",
        "message": text,
        "profile": {
          "name": "chioma",
          "level": "400",
          "program": "CS",
          "hall": "Main"
        }
      })
    });

    const data = await response.json();

   
    const typingBox = document.getElementById(typingId);
    if (typingBox) typingBox.remove();

    const replyText = typeof data === 'object' ? (data.message || data.response || JSON.stringify(data)) : data;

    appendMessage({ role: 'assistant', text: replyText });

  } catch (error) { 
    console.error("Connection failed:", error);
    
  
    const typingBox = document.getElementById(typingId);
    if (typingBox) typingBox.remove();

    appendMessage({ role: 'assistant', text: "Error: " + error.message });
  }
}



sendBtn.addEventListener('click', sendMessage);

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

window.addEventListener('load', () => setTimeout(scrollToBottom, 50));
