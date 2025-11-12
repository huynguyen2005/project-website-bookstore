const inputsQuantity = document.querySelectorAll("input[name='quantity']");
console.log(inputsQuantity.length)
if(inputsQuantity.length > 0){
    inputsQuantity.forEach(input => {
        input.addEventListener("input", (e) => {
            const bookId = input.getAttribute("item-id");
            const quantity = input.value;
            window.location.href = `/cart/update/${bookId}/${quantity}`;
        });
    });
}