const form = document.querySelector("#img-form")
const img = document.querySelector("#img")
const outputPath = document.querySelector("#output-path")
const filename = document.querySelector("#filename")
const widthInput = document.querySelector("#width")
const heightInput = document.querySelector("#height")

function loadImage(e) {
  const file = e.target.files[0]
  if (!isFileImage(file)) {
    alertError("Please select an image")
    return
  }

  const image = new Image()
  image.src = URL.createObjectURL(file)
  image.onload = function () {
    widthInput.value = this.width
    heightInput.value = this.height
  }

  form.style.display = "block"
  filename.innerText = file.name
  outputPath.innerText = path.join(os.homedir(), "imageresizer")
}

//send image data to main

function sendImage(e) {
  e.preventDefault()

  const width = widthInput.value
  const height = heightInput.value
  const imgPath = img.files[0].path

  if (!img.files[0]) {
    alertError("Please upload an Image")
    return
  }
  if (width === "" || height === "") {
    alertError("Please fill in a height and width")
    return
  }

  //Send to main using ipc Renderer
  ipcRenderer.send("image:resize", {
    imgPath,
    width,
    height,
  })
}

//Catch the image: done event

ipcRenderer.on("image:done", () => {
  alertSucccess(`Image resized to ${widthInput} * ${heightInput}`)
})

//make sure file is image
function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg"]
  return file && acceptedImageTypes.includes(file["type"])
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "red",
      color: "white",
      textAlign: "center",
    },
  })
}

function alertSucccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: "green",
      color: "white",
      textAlign: "center",
    },
  })
}

img.addEventListener("change", loadImage)

form.addEventListener("submit", sendImage)
