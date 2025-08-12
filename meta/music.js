// Wii Shop BGM Player, suggested by @legamer66 (https://discord.com/channels/1346485785284575335/1346485786039681056/1351527080546009259)
var checkbgmplayerstatus = true;
function hideConsoleControls() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isConsoleBrowser =
    userAgent.includes('wii') ||
    userAgent.includes('nintendo ds') ||
    userAgent.includes('nintendo 3ds') ||
    userAgent.includes('nintendo');
  // they can't play music so rip
  if (isConsoleBrowser) {const bgmPlayerDiv = document.getElementById('bgmplayer');
  if (bgmPlayerDiv) {bgmPlayerDiv.style.display = 'none'; checkbgmplayerstatus = false;} }
}


var shoploop = new Audio("/meta/shop.wav");
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
       activatebgmplayer();
       bgmplayerfocus();
    document.getElementById("shopbgmselector").href = "javascript:playBGMonload();";
  } else {
    pauseBGM();
    deactivatebgmplayer();
  }
 }

/* what idk, only for index.html */



/* bgm check for all pages */


window.onload = function() {


if (checkbgmplayerstatus === true) {

var wmtwebsiteBGMwasplaying = localStorage.getItem("wmtwebsiteBGM");

if (wmtwebsiteBGMwasplaying === 'playing') {
    activatebgmplayer();
    bgmplayerfocus();
    document.getElementById("shopbgmselector").href = "javascript:playBGMonload();";
}

}


};

/* bgm check for all pages */


window.onbeforeunload = function() {
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
  document.getElementById("shopbgm").innerText = ".....";
 document.getElementById("shopbgmselector").href = 'javascript:alert("the bgm is still fading, hold on, you can click once its done!");';
  shoploop.currentTime =  localStorage.getItem("bgmlooppoint");
}



function fadeinbgm() {
var volchangee = setTimeout(fadeinbgm,13);
document.getElementById("shopbgm").innerText = "Paus?";
  if (initialvolume < 0.8) {
    initialvolume += 0.01;
  }
  if (initialvolume > 0.8) {
        clearTimeout(volchangee);
        initialvolume = 0.8;
        document.getElementById("shopbgmselector").href = "javascript:pauseBGM();";
        document.getElementById("shopbgm").innerText = "Pause";
  }
  shoploop.volume = initialvolume;
}




function activatebgmplayer() {
  document.getElementById('bgmplayer').classList.add('bgmplayerdisplayed');
  document.getElementById("bgmplrtitle").innerText="BGM player"; document.getElementById("bgmplrtitle").style.marginTop="0px";
}
function deactivatebgmplayer() {
  document.getElementById('bgmplayer').classList.remove('bgmplayerdisplayed');
  document.getElementById("bgmplrtitle").innerText="bgm plr..";  document.getElementById("bgmplrtitle").style.marginTop="-5px";
  document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.border="1px solid #34BEED";
}

function bgmplayerfocus() {
/* bring attention to the player that you can play where ya left off */
  document.getElementById("bgmplayer").style.opacity="100%";document.getElementById("bgmplayer").style.backgroundColor="#1164E9"; document.getElementById("bgmplayer").style.border="4px solid #34ededff"; document.getElementById("backgroundd").style.display="block"; document.getElementById("backgroundd").style.backgroundImage=('url("/meta/fadebg-bgm.png")');
 setTimeout(function(){ document.getElementById("bgmplayer").style.backgroundImage='url("/meta/fadebg-bgm.png")'; document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.border="2px solid #34BEED"; document.getElementById("backgroundd").style.display="none";},500);
}