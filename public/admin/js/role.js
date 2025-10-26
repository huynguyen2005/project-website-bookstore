//Permissions
const formPermission = document.querySelector('[form-permissions]');
const permissionTable = document.querySelector('[permission-table]');

if (formPermission) {
    const inputPermissions = document.querySelector("[input-permissions]");
    formPermission.addEventListener("submit", () => {
        const rows = permissionTable.querySelectorAll('tr');
        let containValue = [];
        rows.forEach(row => {
            const dataRow = row.getAttribute("data-name");
            if (dataRow === "id") {
                const cols = row.querySelectorAll('input');
                cols.forEach(col => {
                    containValue.push({ "id": col.value, permissions: [] });
                });
            }
            else if (dataRow) {
                const cols = row.querySelectorAll('input[type="checkbox"]');
                cols.forEach((col, indexCol) => {
                    if (col.checked) {
                        containValue[indexCol].permissions.push(dataRow);
                    }
                });
            }
        });
        inputPermissions.value = JSON.stringify(containValue);
    });
}
//End permissions


//Permissions default
const dataRoles = document.querySelector("[data-role]");
if (dataRoles) {
    const data = JSON.parse(dataRoles.getAttribute('data-role'));
    data.forEach((item, index) => {
        const permissions = item.permissions;
        permissions.forEach(permission => {
            const row = permissionTable.querySelector(`[data-name=${permission}]`);
            const checkBox = row.querySelectorAll('input[type="checkbox"]');
            checkBox[index].checked = true;
        });
    });
}
//End permissions default


//Checkbox all
const checkBoxAll = document.querySelector("[checkbox-all]");
if (checkBoxAll) {
    const inputsCheckBoxAll = checkBoxAll.querySelectorAll('input[type="checkbox"]');
    inputsCheckBoxAll.forEach((input, index) => {
        input.addEventListener("change", () => {
            if (input.checked) {
                const rows = permissionTable.querySelectorAll('tr[data-name]');
                rows.forEach(row => {
                    const cols = row.querySelectorAll('input[type="checkbox"]');
                    if (cols[index]) {
                        cols[index].checked = true;
                    }
                });
            }else{
                const rows = permissionTable.querySelectorAll('tr[data-name]');
                rows.forEach(row => {
                    const cols = row.querySelectorAll('input[type="checkbox"]');
                    if (cols[index]) {
                        cols[index].checked = false;
                    }
                });
            }
        });
    });
}
//End checkbox all
