//Button pagination
const buttonsPagination = document.querySelectorAll('[button-pagination]');
if(buttonsPagination.length > 0){
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('button-pagination');
            url.searchParams.set("page", page);
            window.location.href = url;
        });
    });
}
//End button pagination 


//Button-change-status
const buttonsStatus = document.querySelectorAll('[button-change-status]');
if(buttonsStatus.length > 0){
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');
    const page = formChangeStatus.getAttribute('data-page');
    buttonsStatus.forEach(item => {
        item.addEventListener("click", () => {
            const id = item.getAttribute('data-id');
            const status = item.getAttribute('data-status');
            const newStatus = status === "active" ? "inactive" : "active";
            const action = path + `/${id}/${newStatus}?_method=PATCH&page=${page}`;
            formChangeStatus.setAttribute("action", action);
            formChangeStatus.submit();
        })
    });
}
//End button-change-status


//Button search product
const buttonSearchProduct = document.querySelector('[button-search-product]');
if(buttonSearchProduct){
    let url = new URL(window.location.href);
    buttonSearchProduct.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        keyword ? url.searchParams.set('keyword', keyword) : url.searchParams.delete('keyword');
        window.location.href = url;
    });
}
//End button search product