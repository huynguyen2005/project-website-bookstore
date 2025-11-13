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

    // Submit form filter
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

        window.location.href = url.toString();
    });

    // Giữ option đã chọn khi reload
    const setSelectedOption = (paramName) => {
        const current = url.searchParams.get(paramName);
        if (current) {
            const select = formFilter.querySelector(`select[name="${paramName}"]`);
            if (!select) return;
            const option = select.querySelector(`option[value="${current}"]`);
            if (option) option.selected = true;
        }
    };
    setSelectedOption('status');
    setSelectedOption('book_category_id');
    setSelectedOption('cover_type_id');
    setSelectedOption('role_id');

    const sortKey = url.searchParams.get('sortKey');
    const sortValue = url.searchParams.get('sortValue');
    if (sortKey && sortValue) {
        const value = `${sortKey}-${sortValue}`;
        const sortSelect = document.querySelector('[sort-select]');
        const option = sortSelect.querySelector(`option[value="${value}"]`);
        if (option) option.selected = true;
    }
}
//End button filter item


//Clear
const btnClear = document.querySelector('[btn-clear-filter]');
btnClear.addEventListener('click', (e) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.search = ""; // xoá toàn bộ query string
    window.location.href = url.toString();
});
//End clear

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
            if (!confirm("Bạn chắc chắn muốn xóa không?")) return;
            const id = item.getAttribute('data-id');
            const action = path + `/${id}?_method=DELETE${curentPage}`;
            formDelete.setAttribute('action', action);
            formDelete.submit();
        });
    });
}
//End button delete item

//Sửa upload image (Cop nguyên đoạn code này rồi thay vào)
//Upload image - ảnh đại diện
function previewSingleImage(event) {
    const container = document.getElementById('preview-thumbnail');
    if (!container) return;

    container.innerHTML = ''; // Xóa ảnh cũ

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('image-container');

        const img = document.createElement('img');
        img.src = e.target.result;

        const btnRemove = document.createElement('button');
        btnRemove.classList.add('btn-remove');
        btnRemove.textContent = '✕';
        btnRemove.addEventListener('click', () => {
            wrapper.remove();
            event.target.value = ''; // Reset input file
        });

        wrapper.appendChild(img);
        wrapper.appendChild(btnRemove);
        container.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
}


//Sửa upload images ( Cop nguyên đoạn code này rồi thay vào)
// Thêm  nhiều ảnh chi tiết
function previewMultipleImages(event) {
    const container = document.getElementById('preview-container');
    if (!container) return;

    container.innerHTML = ''; // Xóa ảnh cũ
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = e => {
            // Tạo khối ảnh + nút xoá
            const wrapper = document.createElement('div');
            wrapper.classList.add('image-container');

            const img = document.createElement('img');
            img.src = e.target.result;

            const btnRemove = document.createElement('button');
            btnRemove.classList.add('btn-remove');
            btnRemove.textContent = '✕';
            btnRemove.addEventListener('click', () => {
                wrapper.remove(); // Xoá khối ảnh ra khỏi giao diện
            });

            wrapper.appendChild(img);
            wrapper.appendChild(btnRemove);
            container.appendChild(wrapper);
        };
        reader.readAsDataURL(file);
    });

    event.target.value = '';
}


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
document.addEventListener('DOMContentLoaded', () => {
    const alerts = document.querySelectorAll('[show-alert]');
    if (!alerts.length) return;

    alerts.forEach(alert => {
        const timeout = parseInt(alert.dataset.timeout) || 2000;

        // tự ẩn sau timeout
        const hideTimeout = setTimeout(() => {
            hideAlert(alert);
        }, timeout);

        // click vào nút đóng
        const btnClose = alert.querySelector('.alert-close');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                clearTimeout(hideTimeout); // hủy timeout
                hideAlert(alert);
            });
        }
    });

    function hideAlert(alert) {
        alert.classList.add('alert-hidden');
        // dùng transitionend để remove
        alert.addEventListener('transitionend', () => alert.remove());
    }
});
//End-Show alert


//function check confirm password
var check = function () {
    if (document.getElementById('password').value == document.getElementById('confirmPassword').value) {
        document.getElementById('message').style.color = 'green';
        document.getElementById('message').innerHTML = 'Passwords match';
    } else {
        document.getElementById('message').style.color = 'red';
        document.getElementById('message').innerHTML = 'Passwords do not match';
    }
}
//end function check confirm password

//image thong tin cá nhân
document.querySelectorAll('[upload-image-input]').forEach(input => {
    input.addEventListener('change', function (event) {
        const preview = document.querySelector('[upload-image-preview]');
        preview.src = ""; // xóa ảnh cũ
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
        }
    });
});
//end-image thong tin cá nhân


//select-change-status
const selectStatus = document.querySelectorAll('[select-change-status]');
if (selectStatus.length > 0) {
    const formChangeSelectStatus = document.querySelector('#form-change-select-status');
    const path = formChangeSelectStatus.getAttribute('data-path');
    selectStatus.forEach(item => {
        item.addEventListener("change", () => {
            const id = item.getAttribute('data-id');
            const status = item.value;
            const action = path + `/${id}/${status}?_method=PATCH`;
            formChangeSelectStatus.setAttribute("action", action);
            formChangeSelectStatus.submit();
        })
    });
}
//End select-change-status