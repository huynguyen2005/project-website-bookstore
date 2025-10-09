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

//Button search product
const formSearch = document.querySelector('#form-search');
if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        keyword ? url.searchParams.set('keyword', keyword) : url.searchParams.delete('keyword');
        window.location.href = url;
    });
}
//End button search product



//Change categoryLevel2
const categoryLevel1 = document.querySelector('#category-level-1');
const categoryLevel2 = document.querySelector('#category-level-2');
const allOptions = Array.from(categoryLevel2.options);
categoryLevel1.addEventListener('change', () => {
    const valueCategoryLevel1 = categoryLevel1.value;

    categoryLevel2.innerHTML = "";

    const option = document.createElement("option");
    option.textContent = "-- Loại sách --";
    option.value = "";
    categoryLevel2.appendChild(option);

    allOptions.forEach(item => {
        if(!valueCategoryLevel1 || item.getAttribute('data-parent') === valueCategoryLevel1){
            categoryLevel2.appendChild(item);
        }
    });
    categoryLevel2.selectedIndex = 0;
});
//End change categoryLevel2


//Button filter product
const formFilterProduct = document.querySelector('#form-filter-products');
if(formFilterProduct){
    let url = new URL(window.location.href);
    const status = document.querySelector('#status');
    const categoryLevel1 = document.querySelector('#category-level-1');
    const categoryLevel2 = document.querySelector('#category-level-2');
    formFilterProduct.addEventListener("submit", (e) => {
        e.preventDefault();
        status.value ? url.searchParams.set("status", status.value) : url.searchParams.delete("status");
        categoryLevel1.value ? url.searchParams.set("categoryLevel1", categoryLevel1.value) : url.searchParams.delete("categoryLevel1");
        categoryLevel2.value ? url.searchParams.set("categoryLevel2", categoryLevel2.value) : url.searchParams.delete("categoryLevel2");
        window.location.href = url;
    });
}
//End button filter product







