var EmailId = document.getElementById('mail');
var newPass = document.getElementById('newPass');
var confPass = document.getElementById('confPass');
var btnRegister = document.getElementById('btnRegister');

btnRegister.addEventListener('click', (e) => {
	e.preventDefault();
	// console.log(EmailId.value);
	// console.log(newPass.value);
	// console.log(confPass.value);

	if (!newPass.value || !confPass.value) {
		// alert('All feilds required');
		Swal.fire({
			title: 'oops...',
			icon: 'info',
			html: 'All feilds are required!',
			showCloseButton: true,
			showCancelButton: false,
			focusConfirm: false,
			confirmButtonText: 'Confirm',
		});
	} else if (newPass.value != confPass.value) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Password and Confirm Password do not match',
		});
	} else {
		var a = { email: EmailId.value, password: newPass.value };
		async function registerUser() {
			let x = await fetch(`http://localhost:3000/users/`, {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify(a),
			}).then((data) => {
				return data.json();
				// console.log(data);
			});
			Promise.resolve(x).then((data) => {

				if (data.result) {

					// ALERT HERE
					Swal.fire(
						'Success!',
						'Registered Successfully!',
						'success'
					);
					let z = document.querySelectorAll('.swal2-confirm')[0];
					z.addEventListener('click', () => {
						window.location.replace('http://localhost:5500/index.html');
					})
				} else {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Something went wrong!',
					});
				}
			});
		}
		registerUser();
	}
});
