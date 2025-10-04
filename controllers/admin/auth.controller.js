module.exports.showLogin = (req, res) => {
  res.render("admin/pages/login/login"); // file login.pug
};

module.exports.login = (req, res) => {
  const { username, password } = req.body;

  // Tạm kiểm tra đơn giản
  if (username === "admin" && password === "123456") {
    return res.redirect("/admin/dashboard");
  }

  res.render("admin/pages/login/login", { error: "Sai tài khoản hoặc mật khẩu" });
};

// Hiển thị form đăng ký
module.exports.showRegister = (req, res) => {
  res.render("admin/pages/register/register"); // file register.pug
};

// Xử lý đăng ký
module.exports.register = (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Kiểm tra dữ liệu tạm (ví dụ)
  if (!firstname || !lastname || !email || !password) {
    return res.render("admin/pages/register/register", {
      error: "Vui lòng điền đầy đủ thông tin!",
    });
  }

  // TODO: Thêm phần lưu vào database (sẽ làm sau)
  console.log("Tài khoản mới:", { firstname, lastname, email, password });

  // Tạm thời chuyển hướng về trang đăng nhập sau khi đăng ký thành công
  res.redirect("/admin/auth/login");
};

module.exports.showForgot = (req, res) => {
  res.render("admin/pages/forgot/forgot");
};

module.exports.forgot = (req, res) => {
  const { email } = req.body;

  // Giả lập xử lý gửi email
  if (email === "admin@gmail.com") {
    return res.render("admin/pages/forgot/forgot", { success: "Mật khẩu đã được gửi đến email của bạn." });
  }

  res.render("admin/pages/forgot/forgot", { error: "Email không tồn tại trong hệ thống." });
};
