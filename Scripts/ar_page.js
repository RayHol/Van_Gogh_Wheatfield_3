document.addEventListener('DOMContentLoaded', function () {
  AFRAME.registerComponent("ar-controller", {
    init: function () {
        const target = document.getElementById("target");
        const video = document.getElementById("video");
        const audio = document.getElementById("backgroundAudio");
        const plane = document.getElementById("videooverlay");
        const startText = document.getElementById("startText");
        const audioPrompt = document.getElementById("audioPrompt");
        const backgroundImage = document.getElementById("background");
        const backButton = document.getElementById("backButton");
        var played = false;
        var userInteracted = false;

        function isIOS() {
            return [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod'
            ].includes(navigator.platform)
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
        }

        audioPrompt.addEventListener("click", () => {
            audio.play();
            audioPrompt.style.display = "none";
            userInteracted = true;
        });

        target.addEventListener("targetFound", () => {
            console.log("target found");
            this.found = true;
            if (!played) {
                startText.style.display = "none";
                backgroundImage.style.display = "none";
                if (audio.paused && isIOS() && !userInteracted) {
                    audioPrompt.style.display = "block";
                } else {
                    audio.play();
                }
                plane.emit("fadein");
                video.play();
                video.addEventListener("ended", function videoend(e) {
                    played = true;
                }, false);
                plane.object3D.position.copy(plane.object3D.position);
            } else if (audio.paused) {
                audio.play();
            }
        });

        target.addEventListener("targetLost", () => {
            console.log("target lost");
            this.found = false;
            if (!played) {
                video.pause();
                audio.pause();
                startText.style.display = "block";
                backgroundImage.style.display = "block";
            }
        });

        this.el.addEventListener("arframe", () => {
            if (!this.found && played) {
                plane.object3D.position.copy(plane.object3D.position);
            }
        });
      
      backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        setTimeout(function() {
            startText.style.display = "block";
            backgroundImage.style.display = "block";
        }, 3000);  // Delay of 3000ms (3 seconds)
    },
  });
});
