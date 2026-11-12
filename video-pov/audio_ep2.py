# Trilha sintetizada de "Fica na Luz" ep. 1 (sem vozes). Tempos acompanham cena_ep2.js.
import numpy as np, wave, sys
SR = 44100; D = 85.0; n = int(SR * D); t = np.arange(n) / SR; rs = np.random.RandomState(23)
out = np.zeros(n)

def lp(x, k):
    y = np.empty_like(x); a = 0.0
    for i, v in enumerate(x): a += k * (v - a); y[i] = a
    return y
def add(at, sig, amp=1.0):
    i = int(at * SR)
    if i >= n or i < 0: return
    m = min(len(sig), n - i); out[i:i + m] += amp * sig[:m]
def env(dur, k): tt = np.arange(int(dur * SR)) / SR; return tt, np.exp(-tt * k)
def passo(at, amp=0.4, f=75):
    tt, e = env(0.16, 32); add(at, e * (np.sin(2 * np.pi * f * tt * (1 - 1.2 * tt)) + 0.35 * lp(rs.randn(len(tt)), 0.25)), amp)
def clique(at, amp=0.35, k=120):
    tt, e = env(0.05, k); add(at, e * rs.randn(len(tt)), amp)
def bip(at, f, amp=0.12, dur=0.09):
    tt, e = env(dur, 30); add(at, e * np.sin(2 * np.pi * f * tt), amp)
def golpe(at, amp=0.7, f=41, k=2.6):
    tt, e = env(2.2, k); add(at, e * np.sin(2 * np.pi * f * tt) + 0.25 * e * e * lp(rs.randn(len(tt)), 0.05) * 3, amp)
def coracao(at, amp=0.5):
    for d in (0, 0.17):
        tt, e = env(0.2, 22); add(at + d, e * np.sin(2 * np.pi * 52 * tt), amp * (1 if d == 0 else 0.7))
def ruido(at, dur, amp, k=0.1, forma=None):
    m = int(dur * SR); s = lp(rs.randn(m), k); add(at, s * (forma if forma is not None else np.hanning(m)), amp)

# zumbido do mercado (some quando sai) e drone da rua
loja = np.clip((16.5 - t) / 1.0, 0, 1)
out += 0.035 * loja * (np.sin(2 * np.pi * 120 * t) + 0.5 * np.sin(2 * np.pi * 240 * t))
rua = np.clip((t - 15.5) / 3, 0, 1); breu = np.clip((t - 60) / 6, 0, 1)
out += (0.06 * rua + 0.05 * breu) * (np.sin(2 * np.pi * 49 * t) + 0.6 * np.sin(2 * np.pi * 73.4 * t + 1) + 0.4 * np.sin(2 * np.pi * 98.3 * t)) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.21 * t))
out += 0.05 * breu * np.sin(2 * np.pi * 52.3 * t)
out += 0.03 * rua * lp(rs.randn(n), 0.02) * 4                                # vento
# alerta da TV
for k in np.arange(0.6, 6.0, 1.2): bip(k, 880, 0.07, 0.25); bip(k + 0.3, 660, 0.07, 0.25)
# luzes do fundo apagando
for k in (3.2, 5.0, 6.4): clique(k, 0.55); clique(k + 0.1, 0.3); golpe(k + 0.05, 0.25, 60, 6)
# carrinho rangendo
tt = np.arange(int(3.6 * SR)) / SR; vel = (1 - tt / 3.6) ** 1.5
add(7.0, lp(np.sign(np.sin(2 * np.pi * np.cumsum(500 + 250 * vel + 60 * np.sin(2 * np.pi * 6 * vel * tt)) / SR)), 0.15) * vel * (0.5 + 0.5 * np.sin(2 * np.pi * 7 * tt)), 0.11)
ruido(7.0, 3.6, 0.12, 0.3, vel)
golpe(11.3, 0.55, 45)
# corridas
for a, b, p in [(15.2, 22.2, 0.36), (33.3, 40.2, 0.34), (62.1, 66.0, 0.36)]:
    for k in np.arange(a, b, p): passo(k, 0.42); passo(k + 0.12, 0.16, 130)   # o irmão junto
for a, b, p in [(22.4, 23.6, 0.5), (27.2, 29.3, 0.6), (40.4, 43.0, 0.55), (50.0, 52.4, 0.55), (67.6, 70.4, 0.75)]:
    for k in np.arange(a, b, p): passo(k, 0.24)
# tênis que pisca
for a, b, p in [(57.9, 61.4, 0.55), (66.0, 80.0, 0.55)]:
    for j, k in enumerate(np.arange(a, b, p)): bip(k, 1568 if j % 2 else 1318, 0.05, 0.07)
# poste estourando
for k in np.arange(25.0, 26.3, 0.17): clique(k, 0.25, 60)
ruido(26.3, 0.5, 0.9, 0.5, np.exp(-np.arange(int(0.5 * SR)) / SR * 9)); golpe(26.32, 0.9, 38)
# fogo
fogo = np.exp(-((t - 46) / 7.5) ** 2)
out += 0.16 * fogo * lp(rs.randn(n), 0.08) * (0.6 + 0.4 * np.sin(2 * np.pi * 3.1 * t) * np.sin(2 * np.pi * 0.7 * t))
for k in rs.uniform(38, 54, 40): clique(k, 0.18 * np.exp(-((k - 46) / 7.5) ** 2), 200)
# celular
bip(27.5, 1200, 0.1); bip(47.7, 500, 0.12, 0.2); bip(47.95, 500, 0.12, 0.2)
bip(64.9, 400, 0.12, 0.2); bip(65.9, 300, 0.14, 0.35); clique(66.0, 0.4); golpe(66.05, 0.7, 36)
# buzina do ônibus
for k in (53.0, 54.4): tt, e = env(0.9, 1.5); add(k, np.minimum(1, tt * 30) * e * (np.sign(np.sin(2 * np.pi * 311 * tt)) + np.sign(np.sin(2 * np.pi * 392 * tt))), 0.035)
# escuro: coração, toque, final
for k in np.arange(62.0, 80.3, 0.74): coracao(k, 0.3 + 0.3 * np.clip((k - 66) / 8, 0, 1))
ruido(69.6, 0.5, 0.25, 0.4); golpe(70.55, 0.85, 34)
golpe(76.2, 0.5, 44); golpe(79.3, 1.0, 31, 1.6)
ruido(79.3, 2.0, 0.2, 0.01)

out *= np.clip((D - t) / 0.6, 0, 1) * np.clip(t / 0.3, 0, 1)
out = np.tanh(out * 1.3) * 0.85
w = wave.open(sys.argv[1], 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype('<i2').tobytes()); w.close()
