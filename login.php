<!DOCTYPE html>
<html>

<head>
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.4.2/css/all.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;1,100&family=Roboto&display=swap" rel="stylesheet">
    <style>
        /* Gaya popup */
        body {
            overflow: hidden;
        }
    </style>

</head>

<body>
    <div class="containerform">
        <div class="container-form">
            <div class="logo">
                <img src="icon.png" alt="" width=150px>
            </div>
            <div class="formLogin">
                <h2>LOGIN</h2>
                <form id="loginForm" action="proses_login.php" method="post">
                    <div class="formuser">
                        <label for="username"></i></label>
                        <input type="text" name="username" placeholder="Username"><br>

                        <label for="password"></label>
                        <input type="password" name="password" placeholder="Password">
                    </div>

                    <div class="submit">
                        <input type="submit" value="Login">
                    </div>
                </form>
            </div>
        </div>

        <!-- Popup login gagal -->
        <div id="popup" class="popup">
            <div class="popup-content">
                <h2>Login Gagal</h2>
                <p>Username atau password salah. Cek kembali kredensial Anda.</p>
                <button id="closePopup">Tutup</button>
            </div>
        </div>
    </div>


    <script>
        // Tampilkan popup jika login gagal
        <?php
        if (isset($_GET['login_error'])) {
            echo 'document.getElementById("popup").style.display = "block";';
        }
        ?>

        // Tutup popup saat tombol "Tutup" diklik
        document.getElementById("closePopup").addEventListener("click", function() {
            document.getElementById("popup").style.display = "none";
        });
    </script>
</body>

</html>