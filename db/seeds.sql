 INSERT INTO department (name)
 VALUES ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");


 INSERT INTO role (title, salary, department_id)
 VALUES ("Sales Lead", "100000", 1),
        ("Salesperson", "80000", 1),
        ("Lead Engineer", "150000", 2),
        ("Software Engineer", "120000", 2),
        ("Chief Financial Officer", "160000", 3),
        ("Accountant", "125000", 3),
        ("Legal Team Lead", "250000", 4),
        ("Lawyer", "190000", 4);
 

 INSERT INTO employee (first_name, last_name, role_id, manager_id)
 VALUES ("Aerith", "Gainsborough", 7, NULL),
        ("CMOT", "Dibbler", 8, 7),
        ("Tony", "Stark", 3, NULL),
        ("Katie 'Pidge' ", "Holt", 2, 3),
        ("Seto", "Kaiba", 5, NULL),
        ("Skyler", "White", 6, 5),
        ("Miles", "Edgeworth", 1, NULL),
        ("Phoenix", "Wright", 4, 1);