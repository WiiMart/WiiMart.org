var loading = new Audio(""); var loadvolume; var browserageworkswithloader = false; var spinner = true; var shouldaloadedalr = null; var playsound = null;
function showspinner() {
if (spinner === true) {
  loading = new Audio("/media/load.wav");
  document.getElementById("wscspinnerbg").style.display="block";

  if (shouldaloadedalr) {clearTimeout(shouldaloadedalr);}

  shouldaloadedalr = setTimeout(stopspinner,3100);

  if (playsound) {clearTimeout(playsound);}

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
    if (loadvolume > 0) {
        loadvolume += 0.01;
    }
    if (loadvolume >= 0.4) {
        loadvolume = 0;
    }

    loading.volume = loadvolume;
    playsound = setTimeout(loadup, 100); 
}

document.addEventListener("DOMContentLoaded", () => {

  const userAgent = navigator.userAgent.toLowerCase();
  const isConsoleBrowser =
    userAgent.includes('wii') ||
    userAgent.includes('nintendo ds') ||
    userAgent.includes('nintendo 3ds') ||
    userAgent.includes('nintendo');
if (isConsoleBrowser) {browserageworkswithloader = false;} 
else 
{
 browserageworkswithloader = true;
 document.getElementById("wscspinnerbg").style.display="none";
 document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", showspinner);
 });
}


});


