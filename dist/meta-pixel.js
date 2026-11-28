/* Load the official Meta library early. Utmizey initializes the pixel and sends the single PageView. */
!function(f,b,e,v,n,t,s){
  if(f.fbq)return;
  n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=true;n.version='2.0';n.queue=[];
  t=b.createElement(e);t.async=true;t.fetchPriority='low';t.src=v;
  s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
/* PageView is sent exclusively by Utmizey to avoid duplicate visits. */
