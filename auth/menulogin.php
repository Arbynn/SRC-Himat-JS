<?php
session_start();
include 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $query = mysqli_query($con, "SELECT * FROM admin WHERE username='$username' AND password='$password'");
    $user = mysqli_fetch_assoc($query);

    if ($user) {
        $_SESSION['admin'] = $user;
        header("Location: produkadmin.php");
        exit;
    } else {
        $error = "Username atau password salah.";
    }
}
?>
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="bootstrap-5.0.0-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link rel="stylesheet" href="menulogin.css">

    <title>Form Login</title>
  </head>
  <body>
    <div class="container">
        <div class="card login-form">
        <div class="card-body">
          <h2 class="card-title">Login</h2>
          <h6 class="card-subtitle text-muted mb-5 fw-bold">Please login to use this site!</h6>
          <!-- <div class="d-grid mt-5 mb-5">
            <button type="submit" class="btn-1 btn-light btn-gmail w-100"><img src="image/google.png" alt="Gmail" class="img-style">   Sign up with Gmail</button>
          </div> -->


          <form method="POST">
            <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
            <div class="mb-4">
              <label for="username">Username*</label>
              <input type="text" class="form-control" id="username" name="username" placeholder="Username" required>
            </div>
            <div class="mb-3">
              <label for="password">Password*</label>
              <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
            </div>
            <div class="d-grid gap-2 mt-5">
                <button type="submit" class="btn btn-success btn-login w-100">Login</button>
            </div>
        </form>
        </div>
      </div>
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <!-- <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script> -->
  </body>
</html>