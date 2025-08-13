var loading = new Audio("/media/load.wav");
var loadvolume;
var allowedtoload = true;
function showspinner() {
if (allowedtoload === true) {
  document.getElementById("wscspinnerbg").style.display="block";
  setTimeout(stopspinner,3100);

/* moved down for compatability */
  loading.loop = true;
  loading.play(); loading.currentTime=0; loadvolume = 0.01; loading.volume = loadvolume;
   loadup();
} else {
    
}

function stopspinner() {
document.getElementById("wscspinnerbg").style.display="none";
loading.pause();
}
}


function loadup() {
var timee = setTimeout(loadup,100);
/* i hate javascript sometime :))))))) */
    if (loadvolume > 0) {
        loadvolume += 0.01;
    }
    if (loadvolume >= 0.4) {
        loadvolume = 0;
        clearTimeout(timee);
    }

loading.volume = loadvolume;
}


var checkbgmplayerstatus = null;
document.addEventListener("DOMContentLoaded", () => {

  const userAgent = navigator.userAgent.toLowerCase();
  const isConsoleBrowser =
    userAgent.includes('wii') ||
    userAgent.includes('nintendo ds') ||
    userAgent.includes('nintendo 3ds') ||
    userAgent.includes('nintendo');
if (isConsoleBrowser) {checkbgmplayerstatus = false;} 
else 
{
 checkbgmplayerstatus = true;
 stopspinner();
 document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", showspinner);
 });
}

function stopspinner() {
document.getElementById("wscspinnerbg").style.display="none";
loading.pause();
}
});


