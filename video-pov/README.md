# video-pov

Motor para vídeos verticais em primeira pessoa com cara de desenho sobre 3D
(lente olho-de-peixe, contorno de tinta, mãos e pés do protagonista em quadro).

- `engine.js` — render three.js, lente, contorno, legendas
- `personagens.js` — personagem caricato e corpo em primeira pessoa
- `cena_teste.js` / `audio.py` — teste de estilo de 10 s
- `cena_ep1.js` / `audio_ep1.py` — "A Casa da Vó Dalva", episódio 1 (~81 s)
- `render.js` — grava os quadros com o Chromium do Playwright

```bash
npm install
python3 audio_ep1.py saida/ep1/trilha.wav
CENA=ep1 node render.js   # ou: node render.js 0 2445 82  (prévia de 30 quadros)
ffmpeg -framerate 30 -i saida/ep1/frames/f%05d.jpg -i saida/ep1/trilha.wav -c:v libx264 -crf 23 \
  -pix_fmt yuv420p -c:a aac -shortest saida/ep1/episodio1.mp4
```
