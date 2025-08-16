// Wii Shop BGM Player, suggested by @legamer66 (https://discord.com/channels/1346485785284575335/1346485786039681056/1351527080546009259)

var wscmusic = null; var browsercanplayaudio = false; var browserchecksdone = 0; var initialvolume = 0.01; var currenttiime = localStorage.getItem("bgmcurrenttime") || 0;

document.addEventListener("DOMContentLoaded", function() {

 checkbrowsercompatability();
 if (browserchecksdone === 1) {
    setTimeout(loadwscmusic,200); // less load on browser :)
    firebgmbox();
 }

});

function checkbrowsercompatability() {
const userAgent = navigator.userAgent.toLowerCase();
 const isConsoleBrowser = userAgent.includes('wii') || userAgent.includes('nintendo ds') || userAgent.includes('nintendo 3ds') || userAgent.includes('nintendo');
 if (isConsoleBrowser) {
    browsercanplayaudio = false;
}  else 
{
 browsercanplayaudio = true;
}

browserchecksdone = 1;

}


/* reduce stress on browsers */
function loadwscmusic() {
    var wscmusicloaded = 0;
    wscmusic = new Audio("/meta/shop.wav");
    wscmusic.load(); wscmusicloaded = 1; wscmusic.loop = true; document.getElementById("bgmplayer").style.display="block";
     return wscmusic;
}



/* wscmusic = loadwscmusic(); */

function playBGMonload() {
   localStorage.setItem("wmtsiteBGMplaying","playing");
    if (currenttiime > 0) {
        wscmusic.currentTime=currenttiime;
        wscmusic.volume = initialvolume;
        fadeinbgm();
    }
}

function playBGM() {
       localStorage.setItem("wmtsiteBGMplaying","playing");
        wscmusic.play();
        document.getElementById("shopbgm").innerText = "Pause";
        document.getElementById("shopbgmselector").href = "javascript:pauseBGM();";
}

function pauseBGM() {localStorage.setItem("wmtsiteBGMplaying","paused");wscmusic.pause(); document.getElementById("shopbgm").innerText = "Play"; document.getElementById("shopbgmselector").href = "javascript:playBGM();";}

function fadeinbgm() {
wscmusic.play();
var volchangee = setTimeout(fadeinbgm,13); document.getElementById("shopbgm").setAttribute("disabled","true"); document.getElementById("shopbgm").innerText = "Pause";

  if (initialvolume < 0.8) {
    initialvolume += 0.01; wscmusic.volume = initialvolume;
  }
  if (initialvolume > 0.8) {
    clearTimeout(volchangee); initialvolume = 0.8; wscmusic.volume = 0.8;
    document.getElementById("shopbgmselector").href = "javascript:pauseBGM();";
    document.getElementById("shopbgm").removeAttribute("disabled");
    document.getElementById("shopbgm").style.opacity="90%";
  }

}


window.onbeforeunload = function () {
/* just found out this doesnt work for safari, womp womp */
if (wscmusic) { localStorage.setItem("bgmcurrenttime",wscmusic.currentTime);};
}


/* bgm player show */

function firebgmbox() {
var currenttiime = localStorage.getItem("bgmcurrenttime") || 0;

    if (currenttiime > 0) {
      localStorage.setItem("wmtsiteBGMplaying","paused");
        activatebgmplayerfocus();
        document.getElementById("shopbgmselector").href = "javascript:playBGMonload();";
    } 
}


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

function activatebgmplayer() {
  document.getElementById('bgmplayer').classList.add('bgmplayerdisplayed');
  document.getElementById("bgmplrtitle").innerText="BGM player"; document.getElementById("bgmplrtitle").style.marginTop="0px";
    document.getElementById("bgmplayer").style.backdropFilter="blur(1.8px)";
}
function deactivatebgmplayer() {
  document.getElementById('bgmplayer').classList.remove('bgmplayerdisplayed');
  document.getElementById("bgmplrtitle").innerText="bgm plr..";  document.getElementById("bgmplrtitle").style.marginTop="-5px";
  document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.backgroundColor="#0000"; document.getElementById("bgmplayer").style.border="1px solid #34BEED";
  document.getElementById("bgmplayer").style.backdropFilter="blur(0px)";
}

