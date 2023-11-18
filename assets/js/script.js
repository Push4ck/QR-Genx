let imgBox = document.getElementById("imgBox");
let qrImage = document.getElementById("qrImage");
let qrText = document.getElementById("qrText");

function generateQR() {
    if (qrText.value.length > 0) {
        qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + qrText.value;
        imgBox.classList.add("show-img");
    } else {
        qrText.classList.add('error');
        setTimeout(() => {
            qrText.classList.remove('error');
        }, 1000);
    }
}

function clearText() {
    qrText.value = "";
    qrImage.src = "";
    imgBox.classList.remove("show-img");
}

function downloadQR() {
    var qrTextValue = qrText.value.trim();

    if (qrTextValue.length > 0) {
        fetch("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + qrTextValue)
            .then(response => response.blob())
            .then(blob => {
                var blobUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'qrcode.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            })
            .catch(error => console.error('Error fetching QR code:', error));
    } else {
        alert("Generate a QR code first.");
    }
}