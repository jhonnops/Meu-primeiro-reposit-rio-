# video-pov

Motor para vídeos verticais em primeira pessoa com cara de desenho sobre 3D
(lente olho-de-peixe, contorno de tinta, mãos e pés do protagonista em quadro).

- `engine.js` — render three.js, lente, contorno, legendas
- `personagens.js` — personagem caricato e corpo em primeira pessoa
- `cena_teste.js` — cenário e roteiro do teste de 10 s
- `audio.py` — trilha provisória (drone, passos, efeitos; sem vozes)
- `render.js` — grava os quadros com o Chromium do Playwright

```bash
npm install
python3 audio.py saida/trilha.wav
node render.js            # ou: node render.js 0 300 25  (prévia de 12 quadros)
ffmpeg -framerate 30 -i saida/frames/f%05d.jpg -i saida/trilha.wav -c:v libx264 -crf 23 \
  -pix_fmt yuv420p -c:a aac -shortest saida/teste_estilo_pov.mp4
```
