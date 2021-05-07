const EmailId = document.getElementById('email');
const btnSubmit = document.getElementById('btnSubmit');
let inputLable = document.getElementById('inputLable');
let divPasswd = document.getElementsByClassName('passwd');

let newPass = document.getElementById('passwd');
let confPass = document.getElementById('confPass');

btnSubmit.addEventListener('click', (e) => {
	e.preventDefault();

	const addDivs = () => {
		// var y = document.createElement('div');
		// var newPass = document.createElement('INPUT');
		// newPass.setAttribute('type', 'password');
		// newPass.id = 'newPass';
		// newPass.classList.add('passwd');
		// newPass.classList.add('txtb');
		// var confPass = document.createElement('INPUT');
		// confPass.setAttribute('type', 'password');
		// confPass.id = 'confPass';
		// confPass.classList.add('passwd');
		// confPass.classList.add('txtb');
		// inputLable.appendChild(y).appendChild(newPass);
		// y.appendChild(confPass);

		// btnSubmit.remove();
		// var btnConf = document.createElement('button');
		// btnConf.id = 'btnConf';
		// btnConf.innerText = 'Confirm';
		// y.appendChild(btnConf);

		btnSubmit.addEventListener('click', () => {
			if (newPass.value == confPass.value) {
				var a = { email: EmailId.value, pass: newPass.value };
				async function fetchPass() {
					let x = fetch(`http://localhost:3000/setPass/`, {
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'PATCH',
						body: JSON.stringify(a),
					}).then((data) => {
						return data.json();
						// console.log(data);
					});
					Promise.resolve(x).then((data) => {
						if (data.ok) {
							Swal.fire(
								'Success!',
								'Password Changed Successfully!',
								'success'
							);
							let z = document.querySelectorAll(
								'.swal2-confirm'
							)[0];
							z.addEventListener('click', () => {
								window.location.replace(
									'http://localhost:5500/index.html'
								);
							});
						} 
					});
				}
				fetchPass();
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Password and confirm password do not match',
				});
			}
		});
	};
	async function resolveProm() {
		let a = await fetch(
			`http://localhost:3000/getEmail/q?email=${EmailId.value}`,
			{
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
			}
		).then((response) => {
			return response;
		});

		Promise.resolve(a.json()).then((data) => {
			if (data.result) {
				console.log('object');
				document.getElementById('wrapper').style.display = 'block';
				document.querySelectorAll('.initial')[0].style.height = '500px';
				addDivs();
			} else if (EmailId.value=='') {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Please enter Email',
				});
			}else {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Email does not exists',
				});
			}
		});
		return a;
	}
	resolveProm();
});
