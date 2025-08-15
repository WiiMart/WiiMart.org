// Wii Shop BGM Player, suggested by @legamer66 (https://discord.com/channels/1346485785284575335/1346485786039681056/1351527080546009259)
var bgmplayercompatable = false;
function hideConsoleControls() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isConsoleBrowser =
    userAgent.includes('wii') ||
    userAgent.includes('nintendo ds') ||
    userAgent.includes('nintendo 3ds') ||
    userAgent.includes('nintendo');
  // they can't play music so rip
  if (isConsoleBrowser) {bgmplayercompatable = false; const bgmPlayerDiv = document.getElementById('bgmplayer'); if (bgmPlayerDiv) {bgmPlayerDiv.style.display = 'none';} else {bgmplayercompatable = true;} }
}


var shoploop = new Audio("");
shoploop.loop = true;
var initialvolume = 0 || 0.0;
shoploop.volume = initialvolume;

/* what idk, only for index.html */
function loadafterwednesdaycheck() {
  hideConsoleControls();

  var savedTime = localStorage.getItem("bgmlooppoint");

  if (savedTime) {
    shoploop.currentTime = parseFloat(savedTime);
  }

  if (localStorage.getItem("wmtwebsiteBGM") === "playing") {
       activatebgmplayerfocus();
       document.getElementById("shopbgm").innerText = "Play";
    document.getElementById("shopbgmselector").href = "javascript:playBGMonload();";
  } else {
  pauseBGM();
    deactivatebgmplayer();
    shoploop.currentTime = 0;
    bgmlooppoint = 0;
  var wmtwebsiteBGMwasplaying = localStorage.getItem("wmtwebsiteBGM");
if (wmtwebsiteBGMwasplaying === 'paused') {
  var savedTime = localStorage.getItem("bgmlooppoint");
  if (savedTime) {shoploop.currentTime = parseFloat(savedTime);}

}
  }

 
 }

/* what idk, only for index.html */



/* bgm check for all pages */


window.onload = function() {


if (bgmplayercompatable === true) {

var wmtwebsiteBGMwasplaying = localStorage.getItem("wmtwebsiteBGM");

if (wmtwebsiteBGMwasplaying === 'playing') {
  shoploop = new Audio("/meta/shop.wav");
    activatebgmplayerfocus();
    document.getElementById("shopbgmselector").href = "javascript:playBGMonload();";
} else {
    shoploop.currentTime = 0;
    bgmlooppoint = 0;
}

if (wmtwebsiteBGMwasplaying === 'paused') {
  var savedTime = localStorage.getItem("bgmlooppoint");
  if (savedTime) {shoploop.currentTime = parseFloat(savedTime);}

}
}


};

/* bgm check for all pages */

function activatebgmplayerfocus() {
  shoploop = new Audio("/meta/shop.wav");
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

window.onbeforeunload = function() {
  shoploop = new Audio("/meta/shop.wav");
  localStorage.setItem("bgmlooppoint", shoploop.currentTime);
};

function playBGM() {
  initialvolume = 0.8;
  shoploop.volume = initialvolume;
  localStorage.setItem("wmtwebsiteBGM", "playing");
  shoploop.play();
  document.getElementById("shopbgm").innerText = "Pause";
  document.getElementById("shopbgmselector").href = "javascript:pauseBGM();";
}

function pauseBGM() {
  localStorage.setItem("wmtwebsiteBGM", "paused");
  shoploop.pause();
  document.getElementById("shopbgm").innerText = "Play";
  document.getElementById("shopbgmselector").href = "javascript:playBGM();";
}

function playBGMonload() {
  // this version has it fade in for smoother experince between pages  (i could of used set interval, but memory issues?)
  initialvolume = 0;
  fadeinbgm();
  localStorage.setItem("wmtwebsiteBGM", "playing");
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
  shoploop.volume = initialvolume;
}




function activatebgmplayer() {
  shoploop = new Audio("/meta/shop.wav");
  document.getElementById('bgmplayer').classList.add('bgmplayerdisplayed');
  document.getElementById("shopbgm").innerText = "Play";
  document.getElementById("bgmplrtitle").innerText="BGM player"; document.getElementById("bgmplrtitle").style.marginTop="0px";
    document.getElementById("bgmplayer").style.backdropFilter="blur(1.8px)";
}
function deactivatebgmplayer() {
  shoploop = new Audio("/meta/shop.wav");
  document.getElementById('bgmplayer').classList.remove('bgmplayerdisplayed');
  document.getElementById("bgmplrtitle").innerText="bgm plr..";  document.getElementById("bgmplrtitle").style.marginTop="-5px";
  document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.border="1px solid #34BEED";
  document.getElementById("bgmplayer").style.backdropFilter="blur(0px)";
}

