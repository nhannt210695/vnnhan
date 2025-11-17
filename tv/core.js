/********** VARIABILI GLOBALI & FUNZIONI PER PLAYER / CANALI **********/
/*********************** Author: Bocaletto Luca ***********************/
/*********************** Edit: Thành Nhân *****************************/

let hls; // Biến toàn cầu cho Hls.js
const video = document.getElementById("videoPlayer");
const spinner = document.getElementById("spinner");
const channelsContainer = document.getElementById("channelsContainer");
const fileInput = document.getElementById("m3uFile");
const warningContent = document.getElementById("warningContent");

let channels = []; // Mảng chứa các kênh
let currentSelectedIndex = -1;

function showSpinner(show = true) {
  spinner.style.display = show ? "flex" : "none";
}

function playChannel(streamUrl) {
  console.log("Đang tải luồng: " + streamUrl);
  warningContent.textContent = " Đang tải luồng...";
  showSpinner(true);

  if (hls) {
    hls.destroy();
    hls = null;
  }
  if (Hls.isSupported()) {
    hls = new Hls({ enableWorker: true });
    hls.loadSource(streamUrl);
    hls.attachMedia(video);
    hls.once(Hls.Events.MANIFEST_PARSED, () => {
      video.play().then(() => {
        showSpinner(false);
      }).catch(err => {
        warningContent.textContent = ` Lỗi trong khi phát: ${err}`;
        console.error("Lỗi trong khi phát:", err);
        showSpinner(false);
      });
      if (!video.paused) { // && !video.ended && video.readyState > 2
        console.log("Đang chạy");
        warningContent.textContent = ` Đang phát.`; // Kiểm tra có đang chạy không
      } else {
        console.log("Không chạy");
        // Thì đổi kênh ............................................................................................
      }
    });
    hls.on(Hls.Events.ERROR, (event, data) => {
      var errorType = data.type;
      var errorDetails = data.details;
      var errorFatal = data.fatal;
      console.error(`Lỗi HLS: ${data.details}`);
      warningContent.textContent = ` Lỗi HLS: ${data.details}`;
      let detailsError = "";
      switch (data.details) {
        case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
          detailsError = ": " + "được đưa ra khi việc tải manifest không thành công do lỗi mạng";
          break;
        case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
          detailsError = " : " + "được đưa ra khi tải manifest không thành công do hết thời gian chờ";
          break;
        case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
          detailsError = " : " + "phân tích cú pháp manifest không tìm thấy nội dung phù hợp";
          break;
        case Hls.ErrorDetails.LEVEL_EMPTY_ERROR:
          detailsError = " : " + "được nâng lên khi cấp độ được tải không chứa đoạn nào (áp dụng cho cấp độ và bản âm thanh và phụ đề)";
          break;
        case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
          detailsError = " : " + "được đưa ra khi tải mức không thành công do lỗi mạng";
          break;
        case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
          detailsError = " : " + "được đưa ra khi tải cấp độ không thành công do hết thời gian chờ";
          break;
        case Hls.ErrorDetails.LEVEL_PARSING_ERROR:
          detailsError = " : " + "được đưa ra khi phân tích danh sách phát không thành công hoặc tìm thấy nội dung không hợp lệ (áp dụng cho các cấp độ và bản âm thanh và phụ đề)";
          break;
        case Hls.ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
          detailsError = " : " + "được đưa ra khi danh sách phát âm thanh không tải được do lỗi mạng";
          break;
        case Hls.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT:
          detailsError = " : " + "được đưa ra khi danh sách phát âm thanh tải không thành công do hết thời gian chờ";
          break;
        case Hls.ErrorDetails.SUBTITLE_LOAD_ERROR:
          detailsError = " : " + "được nêu ra khi danh sách phụ đề tải không thành công do lỗi mạng";
          break;
        case Hls.ErrorDetails.SUBTITLE_TRACK_LOAD_TIMEOUT:
          detailsError = " : " + "được đưa ra khi danh sách phụ đề tải không thành công do hết thời gian chờ";
          break;
        case Hls.ErrorDetails.FRAG_LOAD_ERROR:
          detailsError = " : " + "được đưa ra khi việc tải phân đoạn không thành công do lỗi mạng";
          break;
        case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
          detailsError = " : " + "được đưa ra khi tải phân đoạn không thành công do hết thời gian chờ";
          break;
        case Hls.ErrorDetails.KEY_LOAD_ERROR:
          detailsError = " : " + "được đưa ra khi quá trình tải khóa giải mã không thành công do lỗi mạng";
          break;
        case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
          detailsError = " : " + "được đưa ra khi quá trình tải khóa giải mã không thành công do hết thời gian chờ";
          break;
        case Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
          detailsError = " : " + "được đưa ra khi manifest chỉ chứa mức chất lượng với codec không tương thích với MediaSource Engine.";
          break;
        case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
          detailsError = " : " + "được đưa ra khi giải mã đoạn mã không thành công";
          break;
        case Hls.ErrorDetails.FRAG_PARSING_ERROR:
          detailsError = " : " + "được đưa ra khi phân tích cú pháp đoạn mã không thành công";
          break;
        case Hls.ErrorDetails.FRAG_GAP:
          detailsError = " : " + "được đưa ra khi quá trình tải phân đoạn bị bỏ qua vì gặp phải một đoạn có thẻ GAP hoặc một phần có thuộc tính GAP=YES";
          break;
        case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
          detailsError = " : " + "được đưa ra khi MediaSource không thể thêm sourceBuffer mới";
          break;
        case Hls.ErrorDetails.BUFFER_INCOMPATIBLE_CODECS_ERROR:
          detailsError = " : " + "được đưa ra khi không thể tạo MediaSource(s) dựa trên codec(s) của bản nhạc";
          break;
        case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
          detailsError = " : " + "được đưa ra khi ngoại lệ được đưa ra trong khi gọi lệnh thêm bộ đệm";
          break;
        case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
          detailsError = " : " + "được đưa ra khi ngoại lệ được đưa ra trong quá trình thêm bộ đệm";
          break;
        case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
          detailsError = " : " + "được kích hoạt khi quá trình phát lại bị kẹt vì bộ đệm sắp hết dữ liệu";
          break;
        case Hls.ErrorDetails.BUFFER_FULL_ERROR:
          detailsError = " : " + "xảy ra khi không thể thêm dữ liệu vào bộ đệm phương tiện nữa vì bộ đệm đã đầy. Lỗi này được khắc phục bằng cách giảm độ dài bộ đệm tối đa.";
          break;
        case Hls.ErrorDetails.BUFFER_SEEK_OVER_HOLE:
          detailsError = " : " + "được đưa ra sau khi hls.js tìm kiếm qua một lỗ đệm để gỡ kẹt quá trình phát lại";
          break;
        case Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL:
          detailsError = " : " + "được đưa ra khi phát lại bị kẹt mặc dù currentTime nằm trong vùng đệm";
          break;
        case Hls.ErrorDetails.REMUX_ALLOC_ERROR:
          detailsError = " : " + "được đưa ra khi việc phân bổ bộ nhớ không thành công trong quá trình remux";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_NO_KEYS:
          detailsError = " : " + "Lỗi chung của EME";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_NO_ACCESS:
          detailsError = " : " + "EME MediaKeyFunc requestMediaKeySystemAccess(keySystem, supportedConfigurations) không truy cập được vào hệ thống khóa";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_NO_SESSION:
          detailsError = " : " + "MediaKeySession generateRequest(initDataType, initData) không thành công";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_NO_CONFIGURED_LICENSE:
          detailsError = " : " + "Cấu hình trình phát thiếu drmSystems tùy chọn cấp phép hệ thống khóa";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_LICENSE_REQUEST_FAILED:
          detailsError = " : " + "Yêu cầu cấp phép hệ thống khóa không thành công (không thành công ở trạng thái đầu tiên là 4xx hoặc sau 3 lần thử (EMEController MAX_LICENSE_REQUEST_FAILURES))";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED:
          detailsError = " : " + "Yêu cầu chứng chỉ hệ thống khóa không thành công";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED:
          detailsError = " : " + "MediaKeys.setServerCertificate(certificateData) thất bại";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_SESSION_UPDATE_FAILED:
          detailsError = " : " + "MediaKeySession update(licenseResponse|acknowledged) không thành công";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED:
          detailsError = " : " + "Đầu ra mức HDCP bị hạn chế cho phiên khóa";
          break;
        case Hls.ErrorDetails.KEY_SYSTEM_STATUS_INTERNAL_ERROR:
          detailsError = " : " + "trạng thái phiên khóa đã thay đổi thành lỗi nội bộ";
          break;
        case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
          detailsError = " : " + "được nâng lên khi chuyển đổi mức không thành công";
          break;
        case Hls.ErrorDetails.INTERNAL_EXCEPTION:
          detailsError = " : " + "được đưa ra khi có ngoại lệ xảy ra trong trình xử lý sự kiện hls.js nội bộ";
          break;
        case Hls.ErrorDetails.UNKNOWN:
          detailsError = " : " + "Lỗi chưa phân loại";
          break;

        default:
          detailsError = " : " + "chưa xác định";
          break;
      }
      warningContent.textContent += detailsError;
      showSpinner(false);
      
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = streamUrl;
    video.play().then(() => {
      showSpinner(false);
    }).catch(err => {
      warningContent.textContent += ` Lỗi trong khi phát (bản địa): ${err}`;
      console.error("Lỗi trong khi phát (bản địa):", err);
      showSpinner(false);
    });
  } else {
    warningContent.textContent += " Trình duyệt của bạn không hỗ trợ phát trực tuyến HLS.";
    alert("Trình duyệt của bạn không hỗ trợ phát trực tuyến HLS.");
    showSpinner(false);
  }
}

function parseChannelList(content) {
  // Phân tích danh sách kênh
  const lines = content.split("\n");
  channelsContainer.innerHTML = "";
  channels = [];
  currentSelectedIndex = -1;
  let currentTitle = "";
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    if (line.startsWith("#EXTINF")) {
      // Trích xuất tiêu đề từ văn bản sau dấu phẩy (dự phòng "Canale IPTV")
      const match = line.match(/,(.*)$/);
      currentTitle = match ? match[1].trim() : "Canale IPTV";
    } else if (line.startsWith("http")) {
      const streamUrl = line;
      const channelDiv = document.createElement("div");
      channelDiv.className = "channel";
      channelDiv.textContent = currentTitle;
      channelDiv.addEventListener("click", function () {
        playChannel(streamUrl);
        currentSelectedIndex = channels.indexOf(channelDiv);
        updateSelection();
      });
      channelsContainer.appendChild(channelDiv);
      channels.push(channelDiv);
    }
  });
}

// Đặt URL Playlist của bạn ở đây
const PLAYLIST_URL = 'https://cdn.jsdelivr.net/gh/nhannt210695/vnnhan@main/tv.m3u8'; // 'https://vnnhan.com/tv.m3u8'
// Gọi hàm này ngay khi trang web tải xong
window.addEventListener("load", (event) => {
  loadPlayListFromUrl(PLAYLIST_URL);
});

// Tải danh sách từ file trực tuyến
function loadPlayListFromUrl(url) {
  fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Lỗi HTTP! trạng thái: ${response.status}`);
    }
    return response.text();
  })
    .then((content) => {
      parseChannelList(content);
      console.log(content);
    })
    .catch((error) => {
      warningContent.textContent += ` Lỗi khi tải danh sách phát từ đường dẫn: ${url}. Chi tiết: ${error}`;
      console.log(`Lỗi khi tải danh sách phát: ${error}`);
      alert(`Không thể tải danh sách phát từ đường dẫn: ${url}`);
    });
}

// Trình lắng nghe sự kiện cho tệp đầu vào: tệp do người dùng chọn được đọc và phân tích cú pháp
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    parseChannelList(content);
  };
  reader.readAsText(file);
});

function updateSelection() {
  channels.forEach((channel, index) => {
    if (index === currentSelectedIndex) {
      channel.classList.add("selected");
      channel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      channel.classList.remove("selected");
    }
  });
}


/********** EVENTI DA TASTIERA **********/
document.addEventListener("keydown", function (e) {
  // Se l'utente preme "l", simula un click sul file input per ricaricare la lista
  if (e.key.toLowerCase() === "l") {
    e.preventDefault();
    fileInput.click();
    return;
  }

  // Navigazione nella lista dei canali
  if (channels.length > 0) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentSelectedIndex = (currentSelectedIndex + 1) % channels.length;
      updateSelection();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      currentSelectedIndex = (currentSelectedIndex - 1 + channels.length) % channels.length;
      updateSelection();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentSelectedIndex >= 0 && currentSelectedIndex < channels.length) {
        channels[currentSelectedIndex].click();
      }
      return;
    }
  }

  // Controlli del player via tastiera
  if (e.key === " ") { // Space per pausa/ripresa
    e.preventDefault();
    video.paused ? video.play() : video.pause();
  } else if (e.key === "+" || e.key === "=") { // Volume su
    e.preventDefault();
    video.volume = Math.min(video.volume + 0.1, 1);
  } else if (e.key === "-") { // Volume giù
    e.preventDefault();
    video.volume = Math.max(video.volume - 0.1, 0);
  } else if (e.key.toLowerCase() === "m") { // Toggle mute
    e.preventDefault();
    video.muted = !video.muted;
  } else if (e.key.toLowerCase() === "f") { // Fullscreen toggle
    e.preventDefault();
    if (!document.fullscreenElement) {
      video.requestFullscreen ? video.requestFullscreen() : (video.webkitRequestFullscreen && video.webkitRequestFullscreen());
    } else {
      document.exitFullscreen ? document.exitFullscreen() : (document.webkitExitFullscreen && document.webkitExitFullscreen());
    }
  } else if (e.key.toLowerCase() === "p") { // Picture-in-Picture toggle
    e.preventDefault();
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(err => console.error(err));
    } else {
      video.requestPictureInPicture ? video.requestPictureInPicture().catch(err => console.error(err)) : null;
    }
  }
});

/********** SUPPORTO JOYPAD (CONTROLLER/TELECOMANDO) CON DEBOUNCE **********/
const debounceDelay = 250;
// Impostiamo un oggetto per il debounce degli eventi simulati
const debounceTimes = {
  ArrowUp: 0,
  ArrowDown: 0,
  Enter: 0,
  " ": 0,
  m: 0,
  f: 0,
  p: 0,
  l: 0, // Per il file input
  // Volume su e giù li gestiamo con i pulsanti RT e LT
  volUp: 0,
  volDown: 0
};

function simulateKeyEvent(key) {
  const event = new KeyboardEvent("keydown", { key: key, bubbles: true });
  document.dispatchEvent(event);
}

function pollGamepad() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  if (gamepads[0]) {
    const gp = gamepads[0];
    let now = Date.now();
    // D-Pad Up → ArrowUp
    if (gp.buttons[12] && gp.buttons[12].pressed) {
      if (now - debounceTimes["ArrowUp"] > debounceDelay) {
        simulateKeyEvent("ArrowUp");
        debounceTimes["ArrowUp"] = now;
      }
    }
    // D-Pad Down → ArrowDown
    if (gp.buttons[13] && gp.buttons[13].pressed) {
      if (now - debounceTimes["ArrowDown"] > debounceDelay) {
        simulateKeyEvent("ArrowDown");
        debounceTimes["ArrowDown"] = now;
      }
    }
    // A Button (indice 0) → Enter
    if (gp.buttons[0] && gp.buttons[0].pressed) {
      if (now - debounceTimes["Enter"] > debounceDelay) {
        simulateKeyEvent("Enter");
        debounceTimes["Enter"] = now;
      }
    }
    // B Button (indice 1) → Space (pausa/ripresa)
    if (gp.buttons[1] && gp.buttons[1].pressed) {
      if (now - debounceTimes[" "] > debounceDelay) {
        simulateKeyEvent(" ");
        debounceTimes[" "] = now;
      }
    }
    // LT (indice 6) → "-" (Volume giù)
    if (gp.buttons[6] && gp.buttons[6].pressed) {
      if (now - debounceTimes["volDown"] > debounceDelay) {
        simulateKeyEvent("-");
        debounceTimes["volDown"] = now;
      }
    }
    // RT (indice 7) → "+" (Volume su)
    if (gp.buttons[7] && gp.buttons[7].pressed) {
      if (now - debounceTimes["volUp"] > debounceDelay) {
        simulateKeyEvent("+");
        debounceTimes["volUp"] = now;
      }
    }
    // X Button (indice 2) → "m" (Toggle mute)
    if (gp.buttons[2] && gp.buttons[2].pressed) {
      if (now - debounceTimes["m"] > debounceDelay) {
        simulateKeyEvent("m");
        debounceTimes["m"] = now;
      }
    }
    // Y Button (indice 3) → "f" (Fullscreen toggle)
    if (gp.buttons[3] && gp.buttons[3].pressed) {
      if (now - debounceTimes["f"] > debounceDelay) {
        simulateKeyEvent("f");
        debounceTimes["f"] = now;
      }
    }
    // LB (indice 4) → "l" (Per riaprire il file input)
    if (gp.buttons[4] && gp.buttons[4].pressed) {
      if (now - debounceTimes["l"] > debounceDelay) {
        simulateKeyEvent("l");
        debounceTimes["l"] = now;
      }
    }
    // Back Button (indice 8) → "p" (Picture-in-Picture)
    if (gp.buttons[8] && gp.buttons[8].pressed) {
      if (now - debounceTimes["p"] > debounceDelay) {
        simulateKeyEvent("p");
        debounceTimes["p"] = now;
      }
    }
  }
  requestAnimationFrame(pollGamepad);
}

window.addEventListener("gamepadconnected", function (e) {
  warningContent.textContent += ` Đã kết nối Gamepad: ${e.gamepad}`;
  console.log("Đã kết nối Gamepad:", e.gamepad);
});
if (navigator.getGamepads) {
  requestAnimationFrame(pollGamepad);
}

video.addEventListener("playing", () => showSpinner(false));
video.addEventListener("waiting", () => showSpinner(true));
