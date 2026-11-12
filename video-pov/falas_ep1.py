# Encaixa as falas gravadas (um arquivo só) nos tempos do episódio 1.
# Saídas: saida/ep1/vozes.wav (faixa de 81,5 s) e falas_ep1.js (tempos + abertura de boca por quadro).
import numpy as np, wave, subprocess, json, sys
SR = 44100; DUR = 81.5; FPS = 30
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'audio/falas_ep1.mp3', '-vn', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, '<i2').astype(float) / 32768
# (tempo no vídeo, início e fim do trecho no arquivo, pico desejado)
FALAS = [
    (2.6, 0.00, 2.90, 0.50),    # Nina: Não levanta. Ela ainda tá acordada.   (sussurro)
    (6.9, 3.10, 5.42, 0.80),    # Você: Onde eu tô? Cadê a minha mãe?
    (11.5, 5.46, 8.25, 0.75),   # Nina: Todo mundo pergunta isso no primeiro dia.
    (15.0, 8.45, 11.32, 0.85),  # Nina: Volta! Faltam dois minutos!
    (31.0, 11.38, 15.32, 0.90), # Você: Abre... abre!
    (40.2, 15.60, 18.62, 0.75), # Vó: Hora de contar os meus netinhos...
    (57.4, 18.78, 19.58, 0.75), # Vó: Um...
    (58.6, 19.58, 20.42, 0.75), # Vó: dois...
    (59.8, 20.42, 21.45, 0.75), # Vó: três...
    (61.0, 21.70, 22.50, 0.75), # Vó: quatro.
    (65.5, 22.72, 23.95, 0.80), # Vó: Cinco.
    (72.0, 24.22, 25.94, 0.70), # Nina: Não olha pra baixo.
]
def rms(sig, hop):
    m = len(sig) // hop
    return np.sqrt(np.mean(sig[:m * hop].reshape(m, hop) ** 2, axis=1) + 1e-12)
out = np.zeros(int(SR * DUR)); tempos = []
for alvo, a, b, pico in FALAS:
    c = x[int(a * SR):int(b * SR)].copy()
    f = int(0.03 * SR); c[:f] *= np.linspace(0, 1, f); c[-f:] *= np.linspace(1, 0, f)
    e = rms(c, 441); lim = max(e.max() * 0.12, 0.004)             # 10 ms
    on = np.argmax(e > lim) * 0.01; off = (len(e) - np.argmax(e[::-1] > lim)) * 0.01
    c *= pico / np.abs(c).max()
    i0 = int((alvo - on) * SR); out[i0:i0 + len(c)] += c           # começo da voz cai exatamente no tempo alvo
    tempos.append((round(alvo, 3), round(alvo + off - on, 3)))
w = wave.open('saida/ep1/vozes.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
# abertura de boca por quadro, normalizada dentro de cada fala (0 a 9)
env = rms(out, SR // FPS); niv = np.zeros(len(env))
for a, b in tempos:
    i, j = int(a * FPS), int(b * FPS) + 1; ref = np.percentile(env[i:j], 85) + 1e-9
    niv[i:j] = np.clip(env[i:j] / ref, 0, 1)
dig = ''.join(str(int(round(v * 9))) for v in niv)
open('falas_ep1.js', 'w').write('// gerado por falas_ep1.py\nconst FALAS = ' + json.dumps([{'a': a, 'b': b} for a, b in tempos]) + ';\nconst BOCA_NIVEL = "' + dig + '";\n')
for (alvo, a, b, _), (ta, tb) in zip(FALAS, tempos): print(f'{ta:6.2f} -> {tb:6.2f}  ({tb - ta:.2f} s)')
