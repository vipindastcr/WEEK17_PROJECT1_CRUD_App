import express from 'express';
import employeeController from '../controller/employeeController';
const router= express.Router();

router.get("/", employeeController.renderAdminHome);
router.post("/", employeeController.login);
router.get("/adminhome", employeeController.renderAdminDashboard);
router.get("/logout", employeeController.logout);
router.get("/adminhome/createuser", employeeController.renderCreateUser);
router.get("/employee", employeeController.getAllEmployee);
router.get("/employee/:id", employeeController.getEmployee);
// router.post("/employee", employeeController.createEmployee);
router.post("/employee", employeeController.createEmployee, (req, res) => {
    res.redirect("/adminhome"); 
})
router.post('/adminhome/employee/:id', employeeController.updateEmployee);
router.delete("/employee/:id", employeeController.deleteEmployee);
router.get('/adminhome/edituser', employeeController.editUserLoad);
router.get('/adminhome/deleteuser', employeeController.deleteUser);

export default router