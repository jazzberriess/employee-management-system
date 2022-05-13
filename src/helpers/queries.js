//database queries
function viewAllDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
        if (err) {
            console.error(err)
        } else {
            console.log(results)
        }
    })
};

module.exports = viewAllDepartments;