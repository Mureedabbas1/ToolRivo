(function(){
'use strict';
var root=document.querySelector('[data-qr-type]');
if(!root)return;
var type=root.getAttribute('data-qr-type');
var configs={
'website-url':[['url','Website URL','url','https://example.com']],
'text':[['text','Text','textarea','Write your text here']],
'email':[['email','Email address','email','hello@example.com'],['subject','Subject','text',''],['body','Message','textarea','']],
'phone':[['phone','Phone number','tel','+1234567890']],
'whatsapp':[['phone','WhatsApp number (with country code)','tel','+923001234567'],['message','Message (optional)','textarea','']],
'sms':[['phone','Phone number','tel','+923001234567'],['message','Message','textarea','']],
'vcard':[['name','Full name','text',''],['phone','Phone','tel',''],['email','Email','email',''],['company','Company','text',''],['website','Website','url','']],
'business-card':[['name','Full name','text',''],['job','Job title','text',''],['company','Company','text',''],['phone','Phone','tel',''],['email','Email','email',''],['website','Website','url',''],['address','Address','text','']],
'maps':[['location','Place name or Google Maps URL','text','']],
'wifi':[['ssid','Wi-Fi network name (SSID)','text',''],['password','Wi-Fi password','text',''],['security','Security','select','WPA'],['hidden','Hidden network','checkbox','']],
'facebook':[['url','Facebook profile or page URL','url','https://facebook.com/']],
'instagram':[['url','Instagram profile URL','url','https://instagram.com/']],
'tiktok':[['url','TikTok profile URL','url','https://tiktok.com/@']],
'youtube':[['url','YouTube channel or video URL','url','https://youtube.com/']],
'linkedin':[['url','LinkedIn profile or company URL','url','https://linkedin.com/']],
'snapchat':[['url','Snapchat profile URL','url','https://snapchat.com/add/']],
'telegram':[['url','Telegram profile or channel URL','url','https://t.me/']],
'social-links':[['website','Website URL','url',''],['instagram','Instagram URL','url',''],['facebook','Facebook URL','url',''],['tiktok','TikTok URL','url',''],['youtube','YouTube URL','url',''],['linkedin','LinkedIn URL','url','']],
'pdf':[['url','Public PDF URL','url','https://example.com/document.pdf']],
'image':[['url','Public image URL','url','https://example.com/image.jpg']],
'video':[['url','Public video URL','url','https://example.com/video.mp4']],
'audio':[['url','Public audio URL','url','https://example.com/audio.mp3']],
'google-drive':[['url','Google Drive share URL','url','https://drive.google.com/']],
'payment':[['recipient','Recipient / business name','text',''],['amount','Amount (optional)','number',''],['currency','Currency','select','PKR'],['reference','Payment reference (optional)','text','']],
'bank-account':[['name','Account holder name','text',''],['bank','Bank name','text',''],['iban','IBAN','text',''],['account','Account number (optional)','text','']],
'event-ticket':[['event','Event name','text',''],['date','Date and time','text',''],['venue','Venue','text',''],['ticket','Ticket / booking URL (optional)','url','']],
'menu':[['restaurant','Restaurant name','text',''],['url','Menu URL','url','https://example.com/menu']],
'product':[['name','Product name','text',''],['sku','SKU / product ID','text',''],['price','Price (optional)','text',''],['url','Product page URL','url','https://example.com/product']],
'app-download':[['android','Android app URL','url',''],['ios','iOS app URL','url','']],
'coupon':[['code','Coupon code','text',''],['discount','Discount details','text',''],['expiry','Expiry date (optional)','text',''],['url','Redemption / offer URL','url','']]
};
var title=root.getAttribute('data-title')||'QR Code';
document.title=title+' QR Code Generator | ToolRivo';
var form=document.getElementById('qrForm'),out=document.getElementById('qrOutput'),status=document.getElementById('qrStatus');
var rows=configs[type]||configs['website-url'];
rows.forEach(function(f){
var wrap=document.createElement('label');wrap.className='field';wrap.appendChild(document.createTextNode(f[1]));
var el;
if(f[2]==='textarea'){el=document.createElement('textarea');el.rows=3;el.placeholder=f[3];}
else if(f[2]==='select'){el=document.createElement('select');(type==='wifi'?['WPA','WEP','nopass']:['PKR','USD','GBP','EUR']).forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o);});}
else if(f[2]==='checkbox'){el=document.createElement('input');el.type='checkbox';}
else{el=document.createElement('input');el.type=f[2];el.placeholder=f[3];}
el.name=f[0];el.id='f-'+f[0];if(f[2]!=='checkbox')el.required=['url','text','email','phone','ssid','name','location','recipient','event','restaurant','code'].indexOf(f[0])!==-1;
wrap.appendChild(el);form.appendChild(wrap);
});
function val(k){var e=form.elements[k];return e?(e.type==='checkbox'?e.checked:e.value.trim()):'';}
function esc(s){return String(s||'').replace(/([\\;,])/g,'\\$1');}
function payload(){
var p='',u=val('url');
switch(type){
case'website-url':case'facebook':case'instagram':case'tiktok':case'youtube':case'linkedin':case'snapchat':case'telegram':case'pdf':case'image':case'video':case'audio':case'google-drive':case'menu':p=u||val('url');break;
case'text':p=val('text');break;
case'email':p='mailto:'+val('email')+(val('subject')?'?subject='+encodeURIComponent(val('subject')):'')+(val('body')?(val('subject')?'&':'?')+'body='+encodeURIComponent(val('body')):'');break;
case'phone':p='tel:'+val('phone');break;
case'whatsapp':p='https://wa.me/'+val('phone').replace(/\\D/g,'')+(val('message')?'?text='+encodeURIComponent(val('message')):'');break;
case'sms':p='SMSTO:'+val('phone)+':'+val('message');break;
case'vcard':case'business-card':p='BEGIN:VCARD\nVERSION:3.0\nFN:'+val('name')+'\nORG:'+val('company')+'\nTITLE:'+val('job')+'\nTEL:'+val('phone')+'\nEMAIL:'+val('email')+'\nURL:'+val('website')+'\nADR:'+val('address')+'\nEND:VCARD';break;
case'maps':p=/^https?:\\/\\//i.test(val('location'))?val('location'):'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(val('location'));break;
case'wifi':p='WIFI:T:'+val('security')+';S:'+esc(val('ssid'))+';P:'+esc(val('password'))+';H:'+(val('hidden')?'true':'false')+';;';break;
case'social-links':p=[['Website',val('website')],['Instagram',val('instagram')],['Facebook',val('facebook')],['TikTok',val('tiktok')],['YouTube',val('youtube')],['LinkedIn',val('linkedin')]].filter(function(x){return x[1]}).map(function(x){return x[0]+': '+x[1]}).join('\n');break;
case'payment':p='Payment to: '+val('recipient')+'\nAmount: '+val('amount')+' '+val('currency')+'\nReference: '+val('reference');break;
case'bank-account':p='Account name: '+val('name')+'\nBank: '+val('bank')+'\nIBAN: '+val('iban')+'\nAccount: '+val('account');break;
case'event-ticket':p='Event: '+val('event')+'\nDate: '+val('date')+'\nVenue: '+val('venue')+(val('ticket')?'\nTicket: '+val('ticket'):'');break;
case'product':p='Product: '+val('name')+'\nSKU: '+val('sku')+'\nPrice: '+val('price')+'\n'+val('url');break;
case'app-download':p='Android: '+val('android')+'\niOS: '+val('ios');break;
case'coupon':p='Coupon: '+val('code')+'\nDiscount: '+val('discount')+'\nExpires: '+val('expiry')+'\n'+val('url');break;
}
return p.trim();
}
document.getElementById('generateQR').addEventListener('click',function(){
if(!form.reportValidity())return;
var data=payload();if(!data){status.textContent='Please enter the required information.';return;}
out.innerHTML='';
try{new QRCode(out,{text:data,width:256,height:256,colorDark:'#101828',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});status.textContent='Your QR code is ready. Scan it to check the content before sharing.';document.getElementById('downloadQR').hidden=false;}
catch(e){status.textContent='Could not generate this QR code. Check the entered information.';}
});
document.getElementById('downloadQR').addEventListener('click',function(){
var c=out.querySelector('canvas'),img=out.querySelector('img'),a=document.createElement('a');a.download='toolrivo-qr-code.png';
if(c)a.href=c.toDataURL('image/png');else if(img)a.href=img.src;else return;a.click();
});
document.getElementById('clearQR').addEventListener('click',function(){form.reset();out.innerHTML='';status.textContent='Enter details and generate your QR code.';document.getElementById('downloadQR').hidden=true;});
})();