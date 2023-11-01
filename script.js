document.addEventListener("DOMContentLoaded", () => {
    const recordBtn = document.getElementById("record");
    const modal = document.getElementById("modal");
    const closeBtn = document.getElementById("close-icon");

    recordBtn.addEventListener("click", function () {
        modal.classList.add("show");
    });

    closeBtn.addEventListener("click", function () {
        modal.classList.remove("show");
    });
});
