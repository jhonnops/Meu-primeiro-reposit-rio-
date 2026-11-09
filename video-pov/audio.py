# Trilha provisória do teste: drone, passos, vento do giro e zumbido das luzes (sem vozes).
import numpy as np, wave, sys
SR=44100; D=10.0; n=int(SR*D); t=np.arange(n)/SR; rs=np.random.RandomState(7)
def lp(x,k):  # passa-baixa simples
    y=np.empty_like(x); a=0.0
    for i,v in enumerate(x): a+=k*(v-a); y[i]=a
    return y
out=np.zeros(n)
out+=0.10*(np.sin(2*np.pi*55*t)+0.6*np.sin(2*np.pi*82.4*t+1)+0.4*np.sin(2*np.pi*110.3*t))*(0.75+0.25*np.sin(2*np.pi*0.23*t))
out+=0.05*lp(rs.randn(n),0.02)*4
def hit(at,amp,f=75,dur=0.16):
    i=int(at*SR); m=int(dur*SR)
    if i+m>n: return
    tt=np.arange(m)/SR; env=np.exp(-tt*32)
    out[i:i+m]+=amp*env*(np.sin(2*np.pi*f*tt*(1-1.2*tt))+0.35*lp(rs.randn(m),0.25))
for k in range(11): hit(0.1+k*0.4, 0.5*(1 if k<9 else 0.6))            # passos do protagonista
for k in range(10): hit(2.25+k*0.31, 0.10+0.022*k, f=120, dur=0.1)      # passos de quem vem atrás
i0,i1=int(3.95*SR),int(4.65*SR); u=np.linspace(0,1,i1-i0)
out[i0:i1]+=0.5*np.sin(np.pi*u)**2*lp(rs.randn(i1-i0),0.12)*2           # giro
b0=int(9.15*SR); tb=t[b0:]-9.15
buzz=np.sign(np.sin(2*np.pi*100*tb))*((np.floor((tb*30))%5<2)&(tb<0.45))
out[b0:]+=0.12*lp(buzz.astype(float),0.3)
out[b0:]+=0.7*np.exp(-tb*3.2)*np.sin(2*np.pi*41*tb)                      # golpe grave no susto
out*=np.clip((D-t)/0.25,0,1)*np.clip(t/0.1,0,1)
out=np.tanh(out*1.3)*0.85
w=wave.open(sys.argv[1],'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
