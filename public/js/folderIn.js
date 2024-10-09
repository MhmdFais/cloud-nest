const fileModal = document.getElementById("fileModal");

const openFileModalBtn = document.getElementById("openFileModal");

// Get close buttons
const closeButtons = document.querySelectorAll(".close");

// Open file modal
openFileModalBtn.onclick = () => {
  fileModal.style.display = "block";
};

// Open file modal
openFileModalBtn.onclick = () => {
  fileModal.style.display = "block";
};

// Close modals
closeButtons.forEach((btn) => {
  btn.onclick = () => {
    fileModal.style.display = "none";
  };
});

// Close modal when clicking outside
window.onclick = (event) => {
  if (event.target === fileModal) {
    fileModal.style.display = "none";
  }
};

function confirmDelete(deleteUrl) {
  // Show the delete modal
  const modal = document.getElementById("deleteModal");
  modal.style.display = "block";

  // Confirm delete action
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  confirmBtn.onclick = function () {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = deleteUrl;
    document.body.appendChild(form);
    form.submit();
    //modal.style.display = "none";
  };

  // Cancel delete action
  const cancelBtn = document.getElementById("cancelDeleteBtn");
  cancelBtn.onclick = function () {
    modal.style.display = "none";
  };
}
