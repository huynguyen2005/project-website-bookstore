const filterBook = document.querySelector(".filter-sidebar");
if (filterBook) {
  let url = new URL(window.location.href);
  const btn = filterBook.querySelector("[btn-submit]");

  //Load lại trang
  const params = url.searchParams;
  params.forEach((value, key) => {
    const inputs = filterBook.querySelectorAll(`input[name=${key}]`);
    inputs.forEach(input => input.checked = (input.value === value));
  });

  btn.addEventListener("click", () => {
    const inputs = filterBook.querySelectorAll("input:checked");
    // Xoá các tham số cũ
    url.searchParams.delete("author");
    url.searchParams.delete("coverType");
    url.searchParams.delete("price");
    inputs.forEach(input => {
      const key = input.getAttribute("name");
      const value = input.value;
      url.searchParams.append(key, value);
    });
    window.location.href = url;
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const qtyBoxes = document.querySelectorAll(".qty-box");

  qtyBoxes.forEach(qtyBox => {
    const minusBtn = qtyBox.querySelector("[aria-label='minus']");
    const plusBtn = qtyBox.querySelector("[aria-label='plus']");
    const input = qtyBox.querySelector(".qty-input");

    if (!input || !minusBtn || !plusBtn) return;

    const maxStock = parseInt(input.getAttribute("max")) || 1;

    minusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let current = parseInt(input.value) || 1;
      if (current > 1) {
        input.value = current - 1;

        //kích hoạt thủ công một sự kiện input trên phần tử input bằng JavaScript
        input.dispatchEvent(new Event("input"));
      }
    });

    plusBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let current = parseInt(input.value) || 1;
      if (current < maxStock) {
        input.value = current + 1;
        input.dispatchEvent(new Event("input"));
      }
    });

    input.addEventListener("input", () => {
      let value = parseInt(input.value) || 1;
      if (value > maxStock) value = maxStock;
      if (value < 1) value = 1;
      input.value = value;
    });
  });
});



document.querySelectorAll(".price-new, .price-old").forEach(el => {
  let n = parseInt(el.innerText.replace(/\D/g, ""));
  if (!isNaN(n)) {
    el.innerText = n.toLocaleString("vi-VN") + "₫";
  }
});


const btnReset = document.querySelector("[btn-reset]");
if (btnReset) {
  let url = new URL(window.location.href);
  btnReset.addEventListener("click", () => {
    url.search = "";
    window.location.href = url;
  });
}



//Show alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector('[close-alert]')

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

}
//End show alert

