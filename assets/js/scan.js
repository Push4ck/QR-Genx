const scannerDiv = document.querySelector(".scanner");
const camera = scannerDiv.querySelector("h1 .fa-camera");
const stopCam = scannerDiv.querySelector("h1 .fa-circle-stop");
const form = scannerDiv.querySelector(".scanner-form");
const fileInput = form.querySelector("input");
const p = form.querySelector("p");
const img = form.querySelector("img");
const video = form.querySelector("video");
const content = scannerDiv.querySelector(".content");
const textarea = scannerDiv.querySelector(".scanner-details textarea");
const copyBtn = scannerDiv.querySelector(".scanner-details .copy");
const closeBtn = scannerDiv.querySelector(".scanner-details .close");

form.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", e => {
    let file = e.target.files[0];
    if(!file) return;
    fetchRequest(file);
})

function fetchRequest(file) {
    let formData = new FormData();
    formData.append("file", file);

    p.innerText = "Scanning QR Code...";

    fetch('http://api.qrserver.com/v1/read-qr-code/', {
        method: "POST", body: formData
    }).then(res => res.json()).then(result => {
        let text = result[0].symbol[0].data;

        if(!text)
        return p.innerText = "Couldn't Scan OR Code";

        scannerDiv.classList.add("active");
        form.classList.add("active-img");

        img.src = URL.createObjectURL(file);
        textarea.innerText = text;
    })
}

let scanner;

camera.addEventListener("click", () => {
    camera.style.display = "none";
    form.classList.add("pointerEvents")
    p.innerText = "Scanning QR Code...";

    scanner = new Instascan.Scanner({video: video});

    Instascan.Camera.getCameras()
    .then(cameras => {
        if (cameras.length > 1) {
            scanner.start(cameras[1]).then(() => {
                form.classList.add("active-video");
                stopCam.style.display = "inline-block";
            });
        } else if (cameras.length > 0) {
            scanner.start(cameras[0]).then(() => {
                form.classList.add("active-video");
                stopCam.style.display = "inline-block";
            });
        } else {
            console.log("No Cameras Found");
        }        
    })
    .catch(err => console.error(err))

    scanner.addListener("scan", c => {
        scannerDiv.classList.add("active");
        textarea.innerText = c;
    })
})

copyBtn.addEventListener("click", () => {
    let text = textarea.textContent;
    navigator.clipboard.writeText(text)
        .then(() => {
            showPopup('Copied to clipboard');
        })
        .catch(err => {
            console.error('Error copying to clipboard:', err);
        });
});

function showPopup(message) {
    const popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.top = '6%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#4CAF50';
    popup.style.color = '#fff';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000';
    popup.style.opacity = '0';
    popup.style.visibility = 'hidden';
    popup.style.transition = 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out';

    document.body.appendChild(popup);

    void popup.offsetWidth;

    popup.style.opacity = '1';
    popup.style.visibility = 'visible';

    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.visibility = 'hidden';
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300);
    }, 1500);
}

closeBtn.addEventListener("click", () => stopScan());
stopCam.addEventListener("click", () => stopScan());

function stopScan() {
    p.innerText = "Upload QR Code to Scan";

    camera.style.display = "inline-block";
    stopCam.style.display = "none";

    form.classList.remove("active-video", "active-img", "pointerEvents");
    scannerDiv.classList.remove("active");

    if(scanner) scanner.stop();
}