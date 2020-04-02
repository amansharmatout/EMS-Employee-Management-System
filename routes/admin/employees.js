var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var Company = require('../../models/company');
var Department = require('../../models/department');
var Employee = require('../../models/employee');

// INDEX - list all employees
router.get('/homeadmin/employees', function(req, res) {
	Employee.find({}, function(err, allEmployees) {
		if (err) {
			console.log(err);
		} else {
			res.render('admin/employees/index', { employees: allEmployees });
		}
	});
});

// NEW - show a new employees form
router.get('/homeadmin/employees/new', function(req, res) {
	Department.find({}, function(err, allDepartment) {
		if (err) {
			console.log(err);
		} else {
			res.render('admin/employees/new', { departments: allDepartment });
		}
	});
});

// CREATE - create a new employee
router.post('/homeadmin/employees', function(req, res) {
	Employee.create(req.body.employee, function(err, newlyCreated) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			console.log(newlyCreated);
			var pwd = '2020' + newlyCreated.passport_no;
			var pwdUpdate = { password: pwd };
			Employee.findByIdAndUpdate(newlyCreated._id, pwdUpdate, function(err, updated) {
				if (err) {
					console.log(err);
					res.redirect('back');
				} else {
					var newUser = new User({
						username: newlyCreated.employee_id,
						user_email: newlyCreated.email,
						user_role: newlyCreated.designation,
						company_name: newlyCreated.company
					});

					User.register(newUser, pwd, function(err, user) {
						if (err) {
							console.log(err);
							return res.redirect('back');
						}

						res.redirect('/homeadmin/employees');
					});
				}
			});
		}
	});
});

// SHOW - show info about one specific employee
router.get('/homeadmin/employees/:id', function(req, res) {
	Employee.findById(req.params.id, function(err, foundEmployee) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.render('admin/employees/show', { emp: foundEmployee });
		}
	});
});

// EDIT - show edit form of one employee
router.get('/homeadmin/employees/:id/edit', function(req, res) {
	Employee.findById(req.params.id, function(err, foundEmployee) {
		if (err || !foundEmployee) {
			console.log(err);
			res.redirect('back');
		} else {
			Department.find({}, function(err, allDepartments) {
				if (err) {
					console.log(err);
					res.redirect('back');
				} else {
					res.render('admin/employees/edit', { emp: foundEmployee, departments: allDepartments });
				}
			});
		}
	});
});

// UPDATE - update a particular employee
router.put('/homeadmin/employees/:id', function(req, res) {
	Employee.findByIdAndUpdate(req.params.id, req.body.employee, function(err, updatedEmployee) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.redirect('/homeadmin/employees/' + req.params.id);
		}
	});
});

// DELETE - delete a particular employee
router.delete('/homeadmin/employees/:id', function(req, res) {
	Employee.findByIdAndRemove(req.params.id, function(err, deletedEmployee) {
		if (err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.redirect('/homeadmin/employees');
		}
	});
});

module.exports = router;