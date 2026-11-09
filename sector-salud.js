/* sector-salud.js — formulario y eventos de sector-salud.html. No modifica main.js. */
(function(){
  'use strict';
  function track(name,params){
    try{ if(window.gtag) gtag('event',name,params||{}); }catch(e){}
  }
  function fbTrack(ev){ try{ if(window.fbq) fbq('track',ev); }catch(e){} }

  /* Clics (sin datos personales) */
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-track]'); if(!a) return;
    var n=a.getAttribute('data-track');
    track(n,{page:'sector-salud',location:a.getAttribute('data-loc')||'pagina'});
    if(n==='wa_click') fbTrack('Contact');
  });

  var form=document.getElementById('lead-form'); if(!form) return;
  var status=document.getElementById('lead-status');
  var btn=document.getElementById('lead-submit');
  var started=false;

  form.addEventListener('focusin',function(){ if(!started){started=true;track('form_start',{page:'sector-salud'});} });
  form.institucion.addEventListener('change',function(){ if(this.value) track('institution_select',{institution:this.value}); });

  function setErr(id,msg){
    var el=form.elements[id]; var s=document.getElementById('e-'+id);
    if(s) s.textContent=msg||''; if(el){ if(msg) el.setAttribute('aria-invalid','true'); else el.removeAttribute('aria-invalid'); }
    return !msg;
  }
  function validate(){
    var ok=true, v=function(n){return (form.elements[n].value||'').trim();};
    ok=setErr('nombre',v('nombre').length<2?'Escribe tu nombre.':'')&&ok;
    ok=setErr('apellidos',v('apellidos').length<2?'Escribe tus apellidos.':'')&&ok;
    var tel=v('telefono').replace(/[\s\-()]/g,'').replace(/^(\+?52)/,'');
    ok=setErr('telefono',/^\d{10}$/.test(tel)?'':'Escribe un teléfono de 10 dígitos.')&&ok;
    ok=setErr('correo',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('correo'))?'':'Escribe un correo válido.')&&ok;
    ok=setErr('institucion',v('institucion')?'':'Selecciona tu institución.')&&ok;
    ok=setErr('area',v('area').length<2?'Indica tu área laboral.':'')&&ok;
    ok=setErr('situacion',v('situacion')?'':'Selecciona tu situación laboral.')&&ok;
    ok=setErr('tipo',v('tipo')?'':'Selecciona una opción.')&&ok;
    var m=v('monto'); ok=setErr('monto',(m===''||Number(m)>0)?'':'Escribe un monto válido o déjalo vacío.')&&ok;
    ok=setErr('privacidad',form.privacidad.checked?'':'Debes aceptar el aviso de privacidad.')&&ok;
    return ok;
  }
  function show(msg,cls){ status.textContent=msg; status.className='status '+cls; }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    show('','');
    if(form.sitio.value) return;               /* honeypot: bots */
    if(!validate()){
      var bad=form.querySelector('[aria-invalid=true]'); if(bad) bad.focus();
      show('Revisa los campos marcados.','bad'); return;
    }
    var endpoint=form.getAttribute('data-endpoint');
    if(!endpoint){
      /* Sin servicio de recepción: NO se simula envío ni se registra éxito. */
      show('Este formulario aún no está conectado a un servicio de recepción, por lo que no se envió ningún dato. Mientras tanto, escríbenos por WhatsApp.','info');
      return;
    }
    var data={}; ['nombre','apellidos','telefono','correo','institucion','area','situacion','tipo','monto'].forEach(function(n){data[n]=form.elements[n].value.trim();});
    data.pagina='sector-salud'; data.privacidad_aceptada=true;
    btn.disabled=true; show('Enviando…','info');
    fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){
        if(!r.ok) throw new Error('http '+r.status);
        show('Recibimos tu solicitud. Te contactaremos para darte orientación. Esto no garantiza la autorización de un crédito.','ok');
        track('form_submit_success',{page:'sector-salud',institution:data.institucion});
        fbTrack('Lead'); form.reset(); started=false;
      })
      .catch(function(){ show('No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.','bad'); })
      .then(function(){ btn.disabled=false; });
  });
})();
