async function submitFlag(challengeId, inputElement) {
    const flag = inputElement.value.trim();
    if (!flag) { showToast('Please enter a flag!', 'error'); return; }
    try {
        const r = await fetch('/api/validate-flag', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ challenge_id: challengeId, submitted_flag: flag }) });
        const d = await r.json();
        showToast(d.message, d.success ? 'success' : 'error');
        inputElement.style.borderColor = d.success ? '#10b981' : '#ef4444';
        setTimeout(() => inputElement.style.borderColor = '#e5e7eb', 2000);
    } catch (e) { showToast('Network error', 'error'); }
}

async function deleteAddress(addressId) {
    if (!confirm('Delete this address?')) return;
    try {
        const r = await fetch('/api/address/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address_id: parseInt(addressId) }) });
        const d = await r.json();
        showToast(d.message, d.success ? 'success' : 'error');
        if (d.success) setTimeout(() => location.reload(), 800);
    } catch (e) { showToast('Network error', 'error'); }
}

function showToast(msg, type = 'info') {
    const c = document.getElementById('toast-container') || (() => { const x = document.createElement('div'); x.id = 'toast-container'; x.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;'; document.body.appendChild(x); return x; })();
    const colors = { success: 'from-green-500 to-emerald-500', error: 'from-red-500 to-rose-500', info: 'from-indigo-500 to-purple-500' };
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `bg-gradient-to-r ${colors[type]} text-white px-5 py-3 rounded-xl font-bold shadow-xl flex items-center gap-3`;
    t.innerHTML = `<span>${icons[type]}</span>${msg}`;
    t.style.animation = 'slideUp 0.3s ease';
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100px)'; t.style.transition = 'all 0.3s ease'; setTimeout(() => t.remove(), 300); }, 3500);
}

document.addEventListener('keypress', e => {
    if (e.key === 'Enter' && e.target.classList.contains('flag-input')) submitFlag(parseInt(e.target.dataset.challengeId), e.target);
});