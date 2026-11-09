# Trilha sintetizada do episódio 1 (sem vozes): drone, passos, relógio, portas, coração.
# Os tempos acompanham cena_ep1.js.
import numpy as np, wave, sys
SR = 44100; D = 81.5; n = int(SR * D); t = np.arange(n) / SR; rs = np.random.RandomState(11)
out = np.zeros(n)

def lp(x, k):
    y = np.empty_like(x); a = 0.0
    for i, v in enumerate(x): a += k * (v - a); y[i] = a
    return y
def add(at, sig, amp=1.0):
    i = int(at * SR)
    if i >= n: return
    m = min(len(sig), n - i); out[i:i + m] += amp * sig[:m]
def env(dur, k): tt = np.arange(int(dur * SR)) / SR; return tt, np.exp(-tt * k)
def passo(at, amp=0.4, f=75):
    tt, e = env(0.16, 32); add(at, e * (np.sin(2 * np.pi * f * tt * (1 - 1.2 * tt)) + 0.35 * lp(rs.randn(len(tt)), 0.25)), amp)
def sino(at, amp=0.5):
    tt, e = env(2.6, 1.6); add(at, e * (np.sin(2 * np.pi * 196 * tt) + 0.5 * np.sin(2 * np.pi * 392.7 * tt) + 0.3 * np.sin(2 * np.pi * 588 * tt) + 0.2 * np.sin(2 * np.pi * 247 * tt)), amp)
def clique(at, amp=0.35):
    tt, e = env(0.05, 120); add(at, e * rs.randn(len(tt)), amp)
def rangido(at, dur, amp=0.16):
    tt = np.arange(int(dur * SR)) / SR; f = 420 + 160 * np.sin(2 * np.pi * 0.6 * tt) + 40 * np.sin(2 * np.pi * 7 * tt)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * tt)) * np.sin(np.pi * tt / dur)
    add(at, lp(s, 0.2), amp)
def coracao(at, amp=0.5):
    for d in (0, 0.17):
        tt, e = env(0.2, 22); add(at + d, e * np.sin(2 * np.pi * 52 * tt), amp * (1 if d == 0 else 0.7))
def golpe(at, amp=0.7, f=41):
    tt, e = env(2.2, 2.6); add(at, e * np.sin(2 * np.pi * f * tt) + 0.25 * e * e * lp(rs.randn(len(tt)), 0.05) * 3, amp)

# cama de som: drone grave que cresce depois das 9
tens = np.clip((t - 36) / 6, 0, 1)
out += (0.07 + 0.05 * tens) * (np.sin(2 * np.pi * 55 * t) + 0.6 * np.sin(2 * np.pi * 82.4 * t + 1) + 0.4 * np.sin(2 * np.pi * 110.3 * t)) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.23 * t))
out += 0.04 * tens * np.sin(2 * np.pi * 58.3 * t)                       # batimento dissonante
out += 0.035 * lp(rs.randn(n), 0.02) * 4

# tique-taque até as 9
for k in np.arange(0.5, 36.0, 1.0): clique(k, 0.05 if int(k) % 2 else 0.035)
# corridas do protagonista
for a, b, p in [(15.0, 17.2, 0.36), (18.4, 21.2, 0.36), (23.3, 30.0, 0.34), (44.7, 52.4, 0.3)]:
    for k in np.arange(a, b, p): passo(k, 0.42)
for k in (22.0, 22.6): passo(k, 0.2)
add(17.35, lp(rs.randn(int(0.25 * SR)), 0.3) * np.exp(-np.arange(int(0.25 * SR)) / SR * 14), 0.6)   # porta do quarto
# porta da frente: maçaneta e pancadas
for k in np.arange(31.0, 35.5, 0.14): clique(k + 0.03 * rs.rand(), 0.22)
for k in np.arange(31.2, 35.4, 0.55): passo(k, 0.5, f=110)
# 21:00
for k in (0, 1.25, 2.5): sino(T := 36.2 + k, 0.42)
# luzes apagando
for k in (39.2, 39.7, 40.2, 40.8, 41.5): clique(k, 0.5); clique(k + 0.12, 0.3)
# Vó: passos lentos, porta da cozinha
for k in (40.4, 41.3, 42.2): passo(k, 0.22, f=60)
rangido(42.4, 1.7); golpe(43.7, 0.6)
# quarto: pulo na cama, porta, contagem
passo(53.0, 0.6, f=55); rangido(54.2, 1.5)
for k in (55.8, 56.5, 57.2): passo(k, 0.25, f=60)
for k in np.arange(54.0, 70.5, 0.82): coracao(k, 0.32 + 0.25 * np.clip((k - 60) / 6, 0, 1))
for k in (62.9, 63.7, 64.5): passo(k, 0.22, f=60)
golpe(65.5, 0.75, f=36)
for k in (68.2, 68.9, 69.6): passo(k, 0.2, f=60)
rangido(69.5, 1.3); add(70.75, np.exp(-np.arange(int(0.2 * SR)) / SR * 25) * lp(rs.randn(int(0.2 * SR)), 0.3), 0.5)
# o quinto: arranhões e golpe final
for j in range(4):
    m = int(0.22 * SR); add(75.5 + j * 0.16, lp(rs.randn(m), 0.5) * np.hanning(m), 0.2)
golpe(76.1, 0.9, f=33)

out *= np.clip((D - t) / 0.6, 0, 1) * np.clip(t / 0.3, 0, 1)
out = np.tanh(out * 1.3) * 0.85
w = wave.open(sys.argv[1], 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype('<i2').tobytes()); w.close()
