const API_URL = 'http://localhost:5000/api/produks';
const AUTH_API_URL = 'http://localhost:5000/api/auth';

const container = document.getElementById("daftar-produk");
const loadingText = document.getElementById("loading");
const formLogin = document.getElementById("form-login"); // Ambil elemen form login
const logoutButton = document.getElementById("logout-button"); // Ambil tombol logout
const authSection = document.getElementById("auth-section");
let formProduk = document.getElementById("form-produk");

let semuaProduk = [];

function getToken() {
    return localStorage.getItem('token');
}

// Fungsi untuk memeriksa status login dan memperbarui UI
// function checkLoginStatus() {
//     const token = getToken();
//     if (token) {
//         // Jika ada token, user dianggap sudah login
//         if (formLogin) formLogin.style.display = 'none'; // Sembunyikan form login
//         if (logoutButton) logoutButton.style.display = 'block'; // Tampilkan tombol logout
//         if (formProduk) formProduk.style.display = 'block'; // Tampilkan form tambah/edit film
//         // window.location.href = '/index.html';
//     } else {
//         // Jika tidak ada token, user belum login
//         if (formLogin) formLogin.style.display = 'block'; // Tampilkan form login
//         if (logoutButton) logoutButton.style.display = 'none'; // Sembunyikan tombol logout
//         if (formProduk) formProduk.style.display = 'none'; // Sembunyikan form tambah/edit film
//     }
//     tampilkanDaftarProduk();
// }

function checkLoginStatus() {
  const token = getToken();
  if (!token) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "../auth/login.html";
  }
}

// function checkLoginStatus() {
//     const token = getToken();
//     const formLogin = document.getElementById("form-login");
//     const logoutButton = document.getElementById("logout-button");
//     const formProduk = document.getElementById("form-produk");

//     if (token) {
//         if (formLogin) formLogin.style.display = 'none';
//         if (logoutButton) logoutButton.style.display = 'block';
//         if (formProduk) formProduk.style.display = 'block';
//     } else {
//         if (formLogin) formLogin.style.display = 'block';
//         if (logoutButton) logoutButton.style.display = 'none';
//         if (formProduk) formProduk.style.display = 'none';
//     }

//     // Tetap tampilkan produk untuk semua user
//     tampilkanDaftarProduk();
// }

// Handler untuk form login 
formLogin.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    loginUser(username, password);
});

function loginUser(username, password) {
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            alert("Login berhasil!");
            checkLoginStatus();
            tampilkanDaftarProduk();
        } else {
            alert("Login gagal!");
        }
    })
    .catch(err => {
        console.error("Login error:", err);
    });
}

// function logout() {
logoutButton?.addEventListener('click', function() {
        localStorage.removeItem('token');
        alert("Logout berhasil!");
        window.location.href = "../index.html";
});

//Produk
function tampilkanDaftarProduk() {
    loadingText.style.display = 'block';

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            console.log("Data produk:", data);
            semuaProduk = data;

            const container = document.getElementById("tabel-produk-admin");
            container.innerHTML = `
                <table class="table">
                    <thead class="text-center align-middle">
                        <tr>
                            <th>ID Produk</th>
                            <th>Gambar</th>
                            <th>Nama Produk</th>
                            <th>Deskripsi</th>
                            <th>Harga</th>
                            <th>Kategori</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="isi-tabel-produk"></tbody>
                </table>
            `;

            const tbody = document.getElementById("isi-tabel-produk");

            data.forEach(produk => {
                const row = document.createElement("tr");
                row.classList.add("text-center", "align-middle");

                row.innerHTML = `
                    <td>${produk._id}</td>
                    <td><img src="${produk.gambar}" width="100" height="100" alt="${produk.namaproduk}"></td>
                    <td>${produk.namaproduk}</td>
                    <td>${produk.deskripsi}</td>
                    <td>Rp ${produk.harga}</td>
                    <td>${produk.kategori}</td>
                    <td>

                        <button class="btn btn-danger btn-sm" onclick="hapusProduk('${produk._id}')">Hapus</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Gagal ambil produk', err);
        })
        .finally(() => loadingText.style.display = 'none');
}


// // tampilkanDaftarFilm();
// <img src="${produk.gambar}" alt="${produk.namaproduk}">
//                     <h3>${produk.namaproduk}</h3>
//                     <p>${produk.deskripsi}</p>
//                     <p>${produk.harga}</p>
//                     <small>Kategori: ${produk.kategori}</small>
//                     <br>
//                     <button onclick="editProduk('${produk._id}')">Edit</button>
//                     <button onclick="hapusProduk('${produk._id}')">Hapus</button>


//tambah
function defaultSubmit(event) {
    event.preventDefault();
    const token = getToken();
    if (!token) {
        alert("Anda harus login untuk menambah produk!");
        return;
    }

    const produkBaru = {
        namaproduk: document.getElementById("namaproduk").value,
        deskripsi: document.getElementById("deskripsi").value,
        harga: parseInt(document.getElementById("harga").value),
        kategori: document.getElementById("kategori").value,
        gambar: document.getElementById("gambar").value
    };
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Tambahkan token
        },
        body: JSON.stringify(produkBaru)
        
    })
    .then(res => {
        if (!res.ok) {
            if (res.status === 401) throw new Error("Tidak terautentikasi. Silakan login kembali.");
            if (res.status === 403) throw new Error("Tidak memiliki izin.");
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(() => {
        alert("Produk berhasil ditambah");
        tampilkanDaftarProduk?.();
        document.getElementById("formProduk").reset();
    })
    
    .catch(error => {
        console.error('Error adding produk:', error);
        alert("Gagal menambah produk: " + error.message);
        if (error.message.includes("Tidak terautentikasi")) {
            localStorage.removeItem('token');
            checkLoginStatus();
        }
    });
}

// Panggil fungsi tampilkanDaftarFilm saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus(); // Periksa status login saat halaman dimuat
    formProduk.onsubmit = defaultSubmit; // Atur default submit handler
});
// function defaultSubmit(event) {
//     event.preventDefault();
//     const token = getToken();
//     if (!token) {
//         alert("Anda harus login untuk menambah film!");
//         return;
//     }

//     const filmBaru = {
//         judul: document.getElementById("judul").value,
//         deskripsi: document.getElementById("deskripsi").value,
//         kategori: document.getElementById("kategori").value,
//         gambar: document.getElementById("gambar").value
//     };
//     fetch(API_URL, { 
//         method: 'POST', 
//         headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(filmBaru) 
//     })
//     .then(res => {
//         if (res.ok) {
//             tampilkanDaftarFilm();
//             formFilm.reset();
//         } else {
//             alert("Gagal menambah film. Cek autentikasi.");
//         }
//     });
    // .then(res => res.json())
    // .then(() => {
    //     tampilkanDaftarFilm();
    //     formFilm.reset();
    // })
    // .catch(error => console.error('Error adding film:', error));
// }


document.addEventListener('DOMContentLoaded', () => {
  tampilkanDaftarProduk();
});


// function tampilkanDaftarProduk() {
//     const token = getToken();
//     if (!token) {
//         container.innerHTML = "<p>Silakan login untuk melihat daftar produk.</p>";
//         return;
//     }

//     loadingText.style.display = 'block';
//     fetch(API_URL, {
//         headers: {
//             'Authorization': `Bearer ${token}` // Tambahkan token
//         }
//     })
//     .then(res => {
//         if (!res.ok) {
//             if (res.status === 401) throw new Error("Tidak terautentikasi. Silakan login kembali.");
//             if (res.status === 403) throw new Error("Tidak memiliki izin.");
//             throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json();
//     })
//     .then(data => {
//         semuaProduk = data;
//         container.innerHTML = "";
//         if (data.length === 0) {
//             container.innerHTML = "<p>Belum ada produk ditambahkan.</p>";
//         } else {
//             data.forEach(produk => {
//                 const produkDiv = document.createElement("div");
//                 produkDiv.classList.add("produk-card");
//                 produkDiv.innerHTML = `
//                     <img src="${produk.gambar}" alt="${produk.namaproduk}">
//                     <h3>${produk.namaproduk}</h3>
//                     <p>${produk.deskripsi}</p>
//                     <p>${produk.harga}</p>
//                     <small>Kategori: ${produk.kategori}</small>
//                     <br>
//                     <button onclick="editProduk('${produk._id}')">Edit</button>
//                     <button onclick="hapusProduk('${produk._id}')">Hapus</button>
//                 `;
//                 container.appendChild(produkDiv);
//             });
//         }
//     })
//     .catch(error => {
//         console.error('Error fetching produks:', error);
//         container.innerHTML = `<p style="color: red;">Gagal memuat produk: ${error.message}. Pastikan server backend berjalan!</p>`;
//         if (error.message.includes("Tidak terautentikasi")) {
//             localStorage.removeItem('token');
//             checkLoginStatus();
//         }
//     })
//     .finally(() => loadingText.style.display = 'none');
// }

//hapus
// function hapusFilm(id) {
//     fetch(`${API_URL}/${id}`, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//     .then(res => {
//         if (res.ok) {
//             tampilkanDaftarFilm();
//             formFilm.reset();
//         } else {
//             alert("Gagal menghapus film. Cek autentikasi.");
//         }
//     });
// }
function hapusProduk(id) {
    const token = getToken();
    if (!token) {
        alert("Anda harus login dulu!");
        return;
    }
    const konfirmasi = confirm("Yakin ingin menghapus produk ini?");
    if (!konfirmasi) return;
    
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) {
            if (res.status === 401) throw new Error("Tidak terautentikasi. Silakan login kembali.");
            if (res.status === 403) throw new Error("Tidak memiliki izin.");
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(() => {
        alert("Produk berhasil dihapus.")
        tampilkanDaftarProduk();
    })
    .catch(error => {
        console.error('Error deleting produk:', error);
        alert("Gagal menghapus produk: " + error.message);
        if (error.message.includes("Tidak terautentikasi")) {
            localStorage.removeItem('token');
            checkLoginStatus();
        }
    });
}

//edit
// function editFilm(id) {
// const film = semuaFilm.find(f => f._id === id);
// if (!film) return alert("Film tidak ditemukan!");
// document.getElementById("judul").value = film.judul;
// document.getElementById("deskripsi").value = film.deskripsi;
// document.getElementById("kategori").value = film.kategori;
// document.getElementById("gambar").value = film.gambar;
// formFilm.onsubmit = function (event) {
// event.preventDefault();
// const filmUpdate = {
// judul: document.getElementById("judul").value,
// deskripsi:

// document.getElementById("deskripsi").value,

// kategori: document.getElementById("kategori").value,
// gambar: document.getElementById("gambar").value
// };
// fetch(`${API_URL}/${id}`, {
// method: 'PUT',
// headers: { 'Content-Type': 'application/json' },
// body: JSON.stringify(filmUpdate)
// })
// .then(res => res.json())
// .then(() => {
// tampilkanDaftarFilm();
// formFilm.reset();
// formFilm.onsubmit = defaultSubmit;
// });
// };
// }

// function editFilm(id) {
//     const film = semuaFilm.find(f => f._id === id);
//     if (!film) {
//         return alert("Film tidak ditemukan!");
//     }
//     document.getElementById("judul").value = film.judul;
//     document.getElementById("deskripsi").value = film.deskripsi;
//     document.getElementById("kategori").value = film.kategori;
//     document.getElementById("gambar").value = film.gambar;

//     const originalOnSubmit = formFilm.onsubmit; // Simpan handler default sebelum diganti

//     formFilm.onsubmit = function (event) {
//         event.preventDefault();

//         const token = getToken();
//         if (!token) {
//             alert("Anda harus login untuk mengedit film!");
//             return;
//         }

//         const filmUpdate = {
//             judul: document.getElementById("judul").value,
//             deskripsi: document.getElementById("deskripsi").value,
//             kategori: document.getElementById("kategori").value,
//             gambar: document.getElementById("gambar").value
//         };
//         fetch(`${API_URL}/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}` // Tambahkan token 
//             },
//             body: JSON.stringify(filmUpdate)
//         })
//         .then(res => {
//             if (!res.ok) {
//                 if (res.status === 401) throw new Error("Tidak terautentikasi. Silakan login kembali.");
//                 if (res.status === 403) throw new Error("Tidak memiliki izin.");
//                 throw new Error(`HTTP error! status: ${res.status}`);
//             }
//             return res.json();
//         })
//         .then(() => {
//             tampilkanDaftarFilm();
//             formFilm.reset();
//             formFilm.onsubmit = originalOnSubmit; // Kembalikan ke handler default
//         })
//         .catch(error => {
//             console.error('Error updating film:', error);
//             alert("Gagal mengupdate film: " + error.message);
//             if (error.message.includes("Tidak terautentikasi")) {
//                 localStorage.removeItem('token');
//                 checkLoginStatus();
//             }
//         });
//     };
// }

