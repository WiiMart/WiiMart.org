// Wii Shop BGM Player, suggested by @legamer66 (https://discord.com/channels/1346485785284575335/1346485786039681056/1351527080546009259)
var bgmplayercompatable = false; var savedTime = localStorage.getItem("bgmlooppoint");
function hideConsoleControls() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isConsoleBrowser =
    userAgent.includes('wii') ||
    userAgent.includes('nintendo ds') ||
    userAgent.includes('nintendo 3ds') ||
    userAgent.includes('nintendo');
  // they can't play music so rip
  if (isConsoleBrowser) {bgmplayercompatable = false; const bgmPlayerDiv = document.getElementById('bgmplayer'); if (bgmPlayerDiv) {document.body.removeChild(bgmPlayerDiv);} else {bgmplayercompatable = true;} }
}

var shoploop = null; // yes, it will cry about "Invalid URL."
var initialvolume = 0 || 0.0;

function bgmaudioloader() { if (!shoploop) {shoploop = new Audio("/meta/shop.wav"); shoploop.loop = true; shoploop.volume = initialvolume;} return shoploop;}

/* what idk, only for index.html */

function loadafterwednesdaycheck() {
setTimeout(wednesdayyeeeee,100);
}
function wednesdayyeeeee() {
  hideConsoleControls();
 document.getElementById('bgmplayer').style.display="block";
  if (savedTime) {
    shoploop = bgmaudioloader();
    shoploop.currentTime = parseFloat(savedTime);
  }

  if (localStorage.getItem("wmtwebsiteBGM") === "playing") {
       activatebgmplayerfocus();
       document.getElementById("shopbgm").innerText = "Play";
    document.getElementById("shopbgmselector").href = "javascript:playBGMonload();";
  } else {
  pauseBGM();
    deactivatebgmplayer();
    shoploop = bgmaudioloader();
    shoploop.currentTime = 0;
    bgmlooppoint = 0;
  var wmtwebsiteBGMwasplaying = localStorage.getItem("wmtwebsiteBGM");
if (wmtwebsiteBGMwasplaying === 'paused') {
  if (savedTime) {shoploop = bgmaudioloader(); shoploop.currentTime = parseFloat(savedTime);}

}
  }

 
}

/* what idk, only for index.html */



/* bgm check for all pages */


window.onload = function() {
setTimeout(allpagesonload,100); // reduce browser load on initial load
};
window.onbeforeunload = function() {
shoploop = bgmaudioloader();  localStorage.setItem("bgmlooppoint", shoploop.currentTime);
};

function allpagesonload() {
  if (bgmplayercompatable === true) {
document.getElementById('bgmplayer').style.display="block"; 
var wmtwebsiteBGMwasplaying = localStorage.getItem("wmtwebsiteBGM");

if (wmtwebsiteBGMwasplaying === 'playing') {
    activatebgmplayerfocus();
    document.getElementById("shopbgmselector").href = "javascript:playBGMonload();";
} else {
    shoploop = bgmaudioloader(); shoploop.currentTime = 0;
    bgmlooppoint = 0;
}

if (wmtwebsiteBGMwasplaying === 'paused') {
  var savedTime = localStorage.getItem("bgmlooppoint");
  if (savedTime) {shoploop = bgmaudioloader(); shoploop.currentTime = parseFloat(savedTime);}

}
}
}

/* bgm check for all pages */
function activatebgmplayerfocus() {
  bgmplayerfocus();
  document.getElementById('bgmplayer').classList.add('bgmplayeropenanim');
  document.getElementById("bgmplrtitle").innerText="BGM player"; document.getElementById("bgmplrtitle").style.marginTop="0px";
    document.getElementById("bgmplayer").style.backdropFilter="blur(1.8px)";
}

function bgmplayerfocus() {
/* bring attention to the player that you can play where ya left off */
  document.getElementById("bgmplayer").style.opacity="100%";document.getElementById("bgmplayer").style.backgroundColor="#1164e9da";  document.getElementById("bgmplayer").style.border="4px solid #34ededff"; document.getElementById("backgroundd").style.display="block"; document.getElementById("backgroundd").style.backgroundImage=('url("/meta/fadebg-bgm.png")');  document.getElementById("shopbgm").innerText = "Play";
 setTimeout(function(){  document.getElementById('bgmplayer').classList.remove('bgmplayeropenanim'); document.getElementById('bgmplayer').classList.add('bgmplayerdisplayed'); document.getElementById("bgmplayer").style.backgroundImage='url("/meta/fadebg-bgm.png")'; document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.border="2px solid #34BEED"; document.getElementById("backgroundd").style.display="none";},500);
}


function playBGM() {
  initialvolume = 0.8;
  shoploop = bgmaudioloader(); shoploop.volume = initialvolume;
  localStorage.setItem("wmtwebsiteBGM", "playing");
  shoploop = bgmaudioloader(); shoploop.play();
  document.getElementById("shopbgm").innerText = "Pause";
  document.getElementById("shopbgmselector").href = "javascript:pauseBGM();";
}

function pauseBGM() {
  localStorage.setItem("wmtwebsiteBGM", "paused");
  shoploop = bgmaudioloader(); shoploop.pause();
  document.getElementById("shopbgm").innerText = "Play";
  document.getElementById("shopbgmselector").href = "javascript:playBGM();";
}

function playBGMonload() {
  // this version has it fade in for smoother experince between pages  (i could of used set interval, but memory issues?)
  initialvolume = 0;
  fadeinbgm();
  localStorage.setItem("wmtwebsiteBGM", "playing");
  shoploop = bgmaudioloader();
   shoploop.play();
/*
  document.getElementById("shopbgm").innerText = ".....";
 document.getElementById("shopbgmselector").href = 'javascript:alert("the bgm is still fading, hold on, you can click once its done!");';
  */
document.getElementById("shopbgm").setAttribute("disabled", "true");
document.getElementById("shopbgm").innerText = "Pause";
document.getElementById("shopbgmselector").href="#";
document.getElementById("shopbgm").style.opacity="50%";
  shoploop.currentTime =  localStorage.getItem("bgmlooppoint");
}





function fadeinbgm() {
var volchangee = setTimeout(fadeinbgm,13);
  if (initialvolume < 0.8) {
    initialvolume += 0.01;
  }
  if (initialvolume > 0.8) {
        clearTimeout(volchangee);
        initialvolume = 0.8;
        document.getElementById("shopbgmselector").href = "javascript:pauseBGM();";
        document.getElementById("shopbgm").innerText = "Pause";
        document.getElementById("shopbgm").removeAttribute("disabled");
        document.getElementById("shopbgm").style.opacity="90%";
  }
  shoploop = bgmaudioloader(); shoploop.volume = initialvolume;
}




function activatebgmplayer() {
  document.getElementById('bgmplayer').classList.add('bgmplayerdisplayed');
  document.getElementById("shopbgm").innerText = "Play";
  document.getElementById("bgmplrtitle").innerText="BGM player"; document.getElementById("bgmplrtitle").style.marginTop="0px";
    document.getElementById("bgmplayer").style.backdropFilter="blur(1.8px)";
}
function deactivatebgmplayer() {
  document.getElementById('bgmplayer').classList.remove('bgmplayerdisplayed');
  document.getElementById("bgmplrtitle").innerText="bgm plr..";  document.getElementById("bgmplrtitle").style.marginTop="-5px";
  document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.border="1px solid #34BEED";
  document.getElementById("bgmplayer").style.backdropFilter="blur(0px)";
}

