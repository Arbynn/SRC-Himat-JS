const API_URL = 'http://localhost:5000/api/produks';

function getToken() {
  return localStorage.getItem('token');
}

let semuaProduk = [];
// Tampilkan produk
function tampilkanDaftarProduk() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        semuaProduk = data;
      const utama = document.getElementById("produk-utama");
      const rumah = document.getElementById("produk-rumah-tangga");

      utama.innerHTML = "";
      rumah.innerHTML = "";

      data.forEach(produk => {
        const card = document.createElement("div");
        card.classList.add("col-sm-6", "col-lg-3", "mb-4");

        

        const btnKeranjang = `
              <button class="btn btn-outline-warning w-100 btn-keranjang" data-id="${produk._id}">
                                        Keranjang
                                    </button>
                                    `;
        card.innerHTML = `
          <div class="card">
            <img src="${produk.gambar}" class="card-img-top" alt="${produk.namaproduk}">
            <div class="card-body">
              <h5 class="card-title text-warning text-center"><strong>${produk.namaproduk}</strong></h5>
              <p class="text-center">${produk.deskripsi}</p>
              <h4 class="text-center text-warning">Rp ${produk.harga?.toLocaleString()}</h4>
              
              ${btnKeranjang}
              

            </div>
          </div>
        `;

        if (produk.kategori.toLowerCase().includes("rumah tangga")) {
          rumah.appendChild(card);
        } else {
          utama.appendChild(card);
        }
        // Tambahkan event listener untuk tombol keranjang
        

      });
      setTimeout(() => {
        document.querySelectorAll('.btn-keranjang').forEach(button => {
            button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const produk = semuaProduk.find(p => p._id === id);
            if (produk) {
                tambahKeKeranjang(produk);
            } else {
                console.warn("Produk tidak ditemukan untuk id: ", id);
            }
            });
        });
        }, 0);

    });
    
}

// Tambah produk
document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  const formProduk = document.getElementById("form-produk");
  const logoutBtn = document.getElementById("logout-button");
  const form = document.getElementById("form-tambah");

  // Show/hide fitur berdasarkan login
  if (token) {
    if (formProduk) formProduk.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
  }

  // Handle submit tambah
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {
        namaproduk: document.getElementById("namaproduk").value,
        deskripsi: document.getElementById("deskripsi").value,
        kategori: document.getElementById("kategori").value,
        gambar: document.getElementById("gambar").value,
        harga: parseInt(document.getElementById("harga").value)
      };

      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(() => {
          alert("Produk berhasil ditambah!");
          tampilkanDaftarProduk();
          form.reset();
        });
    });
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      alert("Logout berhasil");
      location.reload();
    });
  }

  tampilkanDaftarProduk();
});

function hapusProduk(id) {
  const token = getToken();
  if (!token) return alert("Harus login untuk menghapus");

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.ok) {
        alert("Produk dihapus");
        tampilkanDaftarProduk();
      } else {
        alert("Gagal menghapus");
      }
    });
}

//tambah keranjang
function tambahKeKeranjang(produk) {
  let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

  const item = keranjang.find(p => p._id === produk._id);
  if (item) {
    item.jumlah = (item.jumlah || 1) + 1;
  } else {
    produk.jumlah = 1;
    keranjang.push(produk);
  }

  localStorage.setItem('keranjang', JSON.stringify(keranjang));
  alert("Produk dimasukkan ke keranjang!");
}


