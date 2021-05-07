// Var declarations
var EmailId = document.getElementById('mail');
var Password = document.getElementById('pass');
var btn = document.getElementById('btnSubmit');

// JQuery code
$('.txtb input').on('focus', function () {
	$(this).addClass('focus');
});

$('.txtb input').on('blur', function () {
	if ($(this).val() == '') $(this).removeClass('focus');
});

// setTimeout for checking if input has text or not
setTimeout(() => {
	if (EmailId.value.length > 0) {
		EmailId.classList.add('focus');
	}
	if (Password.value.length > 0) {
		Password.classList.add('focus');
	}
}, 60);

// Button click event
btn.addEventListener('click', (e) => {

	// Prevent loading/refreshing page
	e.preventDefault();

	// Check if values are null
	if (EmailId.value == '' || Password.value == '') {
		
		// Alert 
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Email or password cannot be blank',
		});
	} else {

		// Async function that fetches email from API-endpoint
		async function resolveProm() {
			let a = await fetch(
				`http://localhost:3000/verify/q?email=${EmailId.value}&password=${Password.value}`
			);
			return a;
		}

		let x = resolveProm();

		// Using promise for 'cors' object parsing
		Promise.resolve(x).then((data) => {
			// console.log(data.url)

			// Redirected if all data is correct 
			if (data.redirected) {
				window.location.replace(data.url);
			} else {

				// Else invalid mail or password
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Invalid email or password',
				});
			}
		});
	}
});
