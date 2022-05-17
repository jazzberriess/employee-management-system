 INSERT INTO department (id, name)
 VALUES (1,"Sales"),
        (2, "Engineering"),
        (3, "Finance"),
        (4, "Legal");


 INSERT INTO role (id, title, salary, department_id)
 VALUES (1, "Sales Lead", "100000", 1),
        (2, "Salesperson", "80000", 1),
        (3, "Lead Engineer", "150000", 2),
        (4, "Software Engineer", "120000", 2),
        (5, "Chief Financial Officer", "160000", 3),
        (6, "Accountant", "125000", 3),
        (7, "Legal Team Lead", "250000", 4),
        (8, "Lawyer", "190000", 4);
 

 INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
 VALUES (1, "Aerith", "Gainsborough", 1, NULL),
        (2, "Cmot", "Dibbler", 2, 1),
        (3, "Tony", "Stark", 3, NULL),
        (4, "Katie 'Pidge'", "Holt", 4, 3),
        (5, "Seto", "Kaiba", 5, NULL),
        (6, "Skyler", "White", 6, 5),
        (7, "Miles", "Edgeworth", 7, NULL),
        (8, "Phoenix", "Wright", 8, 7);