const filterBook = document.querySelector(".filter-sidebar");
if(filterBook){
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
  const qtyBox = document.querySelector(".qty-box");

  if (qtyBox) {
    const minusBtn = qtyBox.querySelector("button[aria-label='minus']");
    const plusBtn = qtyBox.querySelector("button[aria-label='plus']");
    const input = qtyBox.querySelector(".qty-input");
    const stock = parseInt(input.dataset.stock) || 1;

    minusBtn.addEventListener("click", () => {
      let current = parseInt(input.value) || 1;
      if (current > 1) input.value = current - 1;
    });

    plusBtn.addEventListener("click", () => {
      let current = parseInt(input.value) || 1;
      if (current < stock) input.value = current + 1;
    });

    input.addEventListener("input", () => {
      let value = parseInt(input.value) || 1;
      if (value > stock) value = stock;
      if (value < 1) value = 1;
      input.value = value;
    });
  }

  const mainImg = document.querySelector(".img-main");
  const thumbs = document.querySelectorAll(".thumb-item");

  if (mainImg && thumbs.length > 0) {
    thumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        mainImg.src = thumb.src;
        thumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });
  }
});


document.querySelectorAll(".price-new, .price-old").forEach(el => {
  let n = parseInt(el.innerText.replace(/\D/g, ""));
  if (!isNaN(n)) {
    el.innerText = n.toLocaleString("vi-VN") + "₫";
  }
});