const submitButton = document.getElementById('submitButton');
const form = document.getElementById('uploadForm');
const errorMessages = document.getElementById('errorMessages');
const acceptCheckbox = document.getElementById('acceptCheckbox');

acceptCheckbox.addEventListener('change', () => {
  submitButton.disabled = !acceptCheckbox.checked;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  errorMessages.innerHTML = '';

  // Validate file sizes and formats
  const photoFile = document.getElementById('photo').files[0];
  const marksheet10File = document.getElementById('marksheet10').files[0];
  const marksheet12File = document.getElementById('marksheet12').files[0];
  const ugCertificateFile = document.getElementById('ugCertificate').files[0];
  const pgCertificateFile = document.getElementById('pgCertificate').files[0];
  const identityProofFile = document.getElementById('identityProof').files[0];
  const signatureFile = document.getElementById('signature').files[0];

  const maxSize = 300 * 1024; // 300KB
  const photoMaxSize = 200 * 1024; // 200KB

  if (photoFile && (photoFile.size > photoMaxSize || !/\.(jpe?g)$/i.test(photoFile.name))) {
    errorMessages.innerHTML += 'Invalid Passport Size Photo format or size.<br>';
  }

  if (marksheet10File && (marksheet10File.size > maxSize || marksheet10File.type !== 'application/pdf')) {
    errorMessages.innerHTML += 'Invalid 10th Class Marksheet file format or size.<br>';
  }

  if (marksheet12File && (marksheet12File.size > maxSize || marksheet12File.type !== 'application/pdf')) {
    errorMessages.innerHTML += 'Invalid 12th Class Marksheet file format or size.<br>';
  }

  if (ugCertificateFile && (ugCertificateFile.size > maxSize || ugCertificateFile.type !== 'application/pdf')) {
    errorMessages.innerHTML += 'Invalid UG Degree Certificate file format or size.<br>';
  }

  if (pgCertificateFile && (pgCertificateFile.size > maxSize || pgCertificateFile.type !== 'application/pdf')) {
    errorMessages.innerHTML += 'Invalid PG Degree Certificate file format or size.<br>';
  }

  if (identityProofFile && (identityProofFile.size > photoMaxSize || !/\.(jpe?g)$/i.test(identityProofFile.name))) {
    errorMessages.innerHTML += 'Invalid Identity Proof file format or size.<br>';
  }

  if (signatureFile && (signatureFile.size > photoMaxSize || !/\.(jpe?g)$/i.test(signatureFile.name))) {
    errorMessages.innerHTML += 'Invalid Signature file format or size.<br>';
  }

  if (errorMessages.innerHTML === '') {
    // All files are valid, perform the upload or submit the form
    form.submit();
  }
  if (!acceptCheckbox.checked) {
    errorMessages.innerHTML = 'Please accept the Terms and Conditions.';
  } else {
    // Perform form submission or further processing here
    console.log('Form submitted!');
  }
});