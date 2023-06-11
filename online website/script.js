function showTextarea() {
    var selectBox = document.getElementById("jobTitle");
    var textareaWrapper = document.getElementById("textareaWrapper");
    textareaWrapper.style.display =
      selectBox.value === "others" ? "block" : "none";
  }