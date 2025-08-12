// Wii Shop BGM Player, suggested by @legamer66 (https://discord.com/channels/1346485785284575335/1346485786039681056/1351527080546009259)

function hideConsoleControls() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isConsoleBrowser =
    userAgent.includes('wii') ||
    userAgent.includes('nintendo ds') ||
    userAgent.includes('nintendo 3ds') ||
    userAgent.includes('nintendo');
  // they can't play music so rip
  if (isConsoleBrowser) {const bgmPlayerDiv = document.getElementById('bgmplayer');
  if (bgmPlayerDiv) {bgmPlayerDiv.style.display = 'none';} }
}


var shoploop = new Audio("/meta/shop.wav");
shoploop.loop = true;
shoploop.volume = 0; // prevent clipping

function loadafterwednesdaycheck() {
  hideConsoleControls();

  var savedTime = localStorage.getItem("bgmlooppoint");

  if (savedTime) {
    shoploop.currentTime = parseFloat(savedTime);
  }

  if (localStorage.getItem("shopmusic") === "playing") {
    playBGMonload();
    activatebgmplayer();
  } else {
    pauseBGM();
    deactivatebgmplayer();
  }
 }

window.onbeforeunload = function() {
  localStorage.setItem("bgmlooppoint", shoploop.currentTime);
};

function playBGM() {
  shoploop.volume = 0.8;
  localStorage.setItem("shopmusic", "playing");
  shoploop.play();
  document.getElementById("shopbgm").innerText = "Pause";
  document.getElementById("shopbgmselector").href = "javascript:pauseBGM();";
}

function pauseBGM() {
  localStorage.setItem("shopmusic", "paused");
  shoploop.pause();
  document.getElementById("shopbgm").innerText = "Play";
  document.getElementById("shopbgmselector").href = "javascript:playBGM();";
}

function playBGMonload() {
  // this version has it fade in for smoother experince between pages  (i could of used set interval, but memory issues?)
  fadeinbgm();
  localStorage.setItem("shopmusic", "playing");
  shoploop.play();
  document.getElementById("shopbgm").innerText = "Pause";
  document.getElementById("shopbgmselector").href = "javascript:pauseBGM();";
}

function fadeinbgm() {
  shoploop.volume="0.0";
  setTimeout(fade2,10);
}
function fade2() {
  shoploop.volume="0.1";
  setTimeout(fade3,10);
}
function fade3() {
  shoploop.volume="0.2";
  setTimeout(fade4,10);
}
function fade4() {
  shoploop.volume="0.3";
  setTimeout(fade5,10);
}
function fade5() {
  shoploop.volume="0.4";
  setTimeout(fade6,10);
}
function fade6() {
  shoploop.volume="0.5";
  setTimeout(fade7,10);
}
function fade7() {
  shoploop.volume="0.6";
  setTimeout(fade8,10);
}
function fade8() {
  shoploop.volume="0.7";
  setTimeout(fade9,10);
}
function fade9() {
  shoploop.volume="0.8";
}
function activatebgmplayer() {
  document.getElementById('bgmplayer').classList.add('bgmplayerdisplayed');
  document.getElementById("bgmplrtitle").innerText="BGM player"; document.getElementById("bgmplrtitle").style.marginTop="0px";
}
function deactivatebgmplayer() {
  document.getElementById('bgmplayer').classList.remove('bgmplayerdisplayed');
  document.getElementById("bgmplrtitle").innerText="bgm plr..";  document.getElementById("bgmplrtitle").style.marginTop="-5px";
}