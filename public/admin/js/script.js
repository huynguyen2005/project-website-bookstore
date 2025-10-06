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
const categoryLevel1 = document.querySelector('[category-level-1]');
const categoryLevel2 = document.querySelector('[category-level-2]');
const allOptions = Array.from(categoryLevel2.options);
if(categoryLevel1){
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
}
//End change categoryLevel2



//Button filter product
const formFilterProduct = document.querySelector('#form-filter-products');
if(formFilterProduct){
    let url = new URL(window.location.href);
    const status = document.querySelector('#status');
    const categoryLevel1 = document.querySelector('[category-level-1]');
    const categoryLevel2 = document.querySelector('[category-level-2]');
    formFilterProduct.addEventListener("submit", (e) => {
        e.preventDefault();
        status.value ? url.searchParams.set("status", status.value) : url.searchParams.delete("status");
        categoryLevel1.value ? url.searchParams.set("categoryLevel1", categoryLevel1.value) : url.searchParams.delete("categoryLevel1");
        categoryLevel2.value ? url.searchParams.set("categoryLevel2", categoryLevel2.value) : url.searchParams.delete("categoryLevel2");
        window.location.href = url;
    });
}
//End button filter product



//Check-box
const checkBoxMulti = document.querySelector('[check-box-multi]');
if(checkBoxMulti){
    const checkBoxAll = checkBoxMulti.querySelector('[check-box-all]');
    const checkBoxs = checkBoxMulti.querySelectorAll('input[name="id"]');
    checkBoxAll.addEventListener("click", () => {
        if(checkBoxAll.checked) checkBoxs.forEach(item => item.checked = true);
        else checkBoxs.forEach(item => item.checked = false);
    });
    checkBoxs.forEach(checkBox => {
        checkBox.addEventListener("click", () => {
            const countChecked = checkBoxMulti.querySelectorAll('input[name="id"]:checked').length;
            countChecked === checkBoxs.length ? checkBoxAll.checked = true : checkBoxAll.checked = false;
        });
    });
}
//End check-box



//Change-multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", () => {
        const checkBoxMulti = document.querySelector('[check-box-multi]');
        const boxChecked = checkBoxMulti.querySelectorAll('input[name="id"]:checked');
        if(boxChecked.length > 0){
            const inputContainId = formChangeMulti.querySelector('input[name="ids"]');
            let ids = [];
            boxChecked.forEach(item => {
                ids.push(item.value);
            });
            inputContainId.value = ids.join(", ");
            formChangeMulti.submit();
        }
    });
}
//End change-multi



//Button delete product
const buttonDeleteProduct = document.querySelectorAll('[button-delete-product]');
if(buttonDeleteProduct.length > 0){
    const formDeleteProduct = document.querySelector('#form-delete-product');
    const path = formDeleteProduct.getAttribute('data-path');
    const page = formDeleteProduct.getAttribute('data-page');
    buttonDeleteProduct.forEach(item => {
        item.addEventListener("click", () => {
            const id = item.getAttribute('data-id');
            const action = path + `/${id}?_method=DELETE&page=${page}`;
            console.log(action);
            formDeleteProduct.setAttribute('action', action);
            formDeleteProduct.submit();
        });
    });
}
//End button delete product



//Upload image
const uploadImage = document.querySelector('[upload-image]');
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector('[upload-image-input]');
    const uploadImagePreview = uploadImage.querySelector('[upload-image-preview]');
    const btnClose = uploadImage.querySelector('[btn-close]');

    uploadImageInput.addEventListener('change', (e) => {
        const [file] = e.target.files;
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
            btnClose.textContent = "✕";
        }
    });

    btnClose.addEventListener('click', () => {
        uploadImageInput.value = "";
        uploadImagePreview.src = "";
        btnClose.textContent = "";
    })
}
//End upload image



//Button edit product
const buttonsEditProduct = document.querySelectorAll('[button-edit-product]');
if(buttonsEditProduct.length > 0){
    const formEditProduct = document.querySelector('#form-edit-product');
    const path = formEditProduct.getAttribute('data-path');
    buttonsEditProduct.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute('data-id');
            const action = path + `/${id}`;
            formEditProduct.setAttribute('action', action);
            formEditProduct.submit();
        });
    });
}
//End button edit product



//Button detail product
const buttonsDetailProduct = document.querySelectorAll('[button-detail-product]');
if(buttonsDetailProduct.length > 0){
    const formDetailProduct = document.querySelector('#form-detail-product');
    const path = formDetailProduct.getAttribute('data-path');
    buttonsDetailProduct.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const action = path + `/${id}`;
            formDetailProduct.setAttribute('action', action);
            formDetailProduct.submit();
        });
    });
}
//End button detail product