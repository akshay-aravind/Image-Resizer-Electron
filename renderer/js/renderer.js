const form = document.querySelector("#img-form")
const img = document.querySelector("#img")
const outputPath = document.querySelector("#output-path")
const filename = document.querySelector("#filename")
const widthInput = document.querySelector("#width")
const heightInput = document.querySelector("#height")

function loadImage(e) {
  const file = e.target.files[0]
  if (!isFileImage(file)) {
    console.log("Please select an image")
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

function isFileImage(file) {
  const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg"]
  return file && acceptedImageTypes.includes(file["type"])
}

img.addEventListener("change", loadImage)