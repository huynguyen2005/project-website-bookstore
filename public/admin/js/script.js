//Button pagination
const buttonsPagination = document.querySelectorAll('[button-pagination]');
if (buttonsPagination.length > 0) {
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
if (buttonsStatus.length > 0) {
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');
    const page = formChangeStatus.getAttribute('data-page');
    let curentPage = "";
    if (page) {
        curentPage = `&page=${page}`;
    }
    buttonsStatus.forEach(item => {
        item.addEventListener("click", () => {
            const id = item.getAttribute('data-id');
            const status = item.getAttribute('data-status');
            const newStatus = status === "active" ? "inactive" : "active";
            const action = path + `/${id}/${newStatus}?_method=PATCH${curentPage}`;
            formChangeStatus.setAttribute("action", action);
            formChangeStatus.submit();
        })
    });
}
//End button-change-status


//Button search item
const formSearch = document.querySelector('[form-search]');
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        keyword ? url.searchParams.set('keyword', keyword) : url.searchParams.delete('keyword');
        window.location.href = url;
    });
}
//End button search item



//Button filter item
const formFilter = document.querySelector('[form-filter]');
if (formFilter) {
    const url = new URL(window.location.href);

    formFilter.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = formFilter.querySelectorAll('select[name]');

        inputs.forEach(input => {
            const name = input.name;
            const value = input.value.trim();

            if (value) url.searchParams.set(name, value);
            else url.searchParams.delete(name);
        });

        const sortSelect = document.querySelector('[sort-select]');
        if (sortSelect && sortSelect.value) {
            const [sortKey, sortValue] = sortSelect.value.split('-');
            url.searchParams.set('sortKey', sortKey);
            url.searchParams.set('sortValue', sortValue);
        }

        window.location.href = url;
    });
}
//End button filter item



//Check-box
const checkBoxMulti = document.querySelector('[check-box-multi]');
if (checkBoxMulti) {
    const checkBoxAll = checkBoxMulti.querySelector('[check-box-all]');
    const checkBoxs = checkBoxMulti.querySelectorAll('input[name="id"]');
    checkBoxAll.addEventListener("click", () => {
        if (checkBoxAll.checked) checkBoxs.forEach(item => item.checked = true);
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
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", () => {
        const checkBoxMulti = document.querySelector('[check-box-multi]');
        const boxChecked = checkBoxMulti.querySelectorAll('input[name="id"]:checked');
        if (boxChecked.length > 0) {
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



//Button delete item
const buttonDelete = document.querySelectorAll('[button-delete]');
if (buttonDelete.length > 0) {
    const formDelete = document.querySelector('[form-delete]');
    const path = formDelete.getAttribute('data-path');
    const page = formDelete.getAttribute('data-page');
    let curentPage = "";
    if (page) {
        curentPage = `&page=${page}`;
    }
    buttonDelete.forEach(item => {
        item.addEventListener("click", () => {
            if(!confirm("Bạn chắc chắn muốn xóa không?")) return;
            const id = item.getAttribute('data-id');
            const action = path + `/${id}?_method=DELETE${curentPage}`;
            formDelete.setAttribute('action', action);
            formDelete.submit();
        });
    });
}
//End button delete item


//Upload image
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector('[upload-image-input]');
    const uploadImagePreview = uploadImage.querySelector('[upload-image-preview]');
    const btnClose = uploadImage.querySelector('[btn-close]');

    uploadImageInput.addEventListener('change', (e) => {
        const [file] = e.target.files;
        if (file) {
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

//Upload images
const uploadImages = document.querySelector('[upload-images]');
if (uploadImages) {
    const uploadImagesInput = uploadImages.querySelector('[upload-images-input]');
    const previewBoxImages = uploadImages.querySelector('[preview-box]');
    uploadImagesInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        previewBoxImages.innerHTML = '';
        files.forEach(file => {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.classList.add('image-preview');
            previewBoxImages.appendChild(img);
        });
    });
}
//End upload images

//Button edit item
const buttonsEdit = document.querySelectorAll('[button-edit]');
if (buttonsEdit.length > 0) {
    const formEdit = document.querySelector('[form-edit]');
    const path = formEdit.getAttribute('data-path');
    buttonsEdit.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute('data-id');
            const action = path + `/${id}`;
            formEdit.setAttribute('action', action);
            formEdit.submit();
        });
    });
}
//End button edit item



//Button detail item
const buttonsDetail = document.querySelectorAll('[button-detail]');
if (buttonsDetail.length > 0) {
    const formDetail = document.querySelector('[form-detail]');
    const path = formDetail.getAttribute('data-path');
    buttonsDetail.forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const action = path + `/${id}`;
            formDetail.setAttribute('action', action);
            formDetail.submit();
        });
    });
}
//End button detail item


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




//function check confirm password
var check = function() {
  if (document.getElementById('password').value == document.getElementById('confirmPassword').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'Passwords match';
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'Passwords do not match';
  }
}
//end function check confirm password