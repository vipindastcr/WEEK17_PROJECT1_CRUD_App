import express, { Request, Response } from "express";
import { EmployeeModel } from "../db/employee";

const credential = {
    email: "admin@gmail.com",
    password: "admin@123"
};

interface Employee {
    getAllEmployee(request: Request, response: Response): Promise<Response>;
    getEmployee(request: Request, response: Response): Promise<Response>;
    createEmployee(request: Request, response: Response): Promise<Response>;
    updateEmployee(request: Request, response: Response): Promise<Response>;
    deleteEmployee(request: Request, response: Response): Promise<Response>;
}

class EmployeeController implements Employee {
    async getAllEmployee(request: Request, response: Response): Promise<Response> {
        try {
            const employees = await EmployeeModel.find();
            return response.status(200).json({ data: employees });
        } catch (error) {
            return response.sendStatus(400);
        }
    }

    async getEmployee(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const employee = await EmployeeModel.findById(id);
            return response.status(200).json({ data: employee });
        } catch (error) {
            return response.sendStatus(400);
        }
    }

    async createEmployee(request: Request, response: Response): Promise<Response |any> {
        try {
            const { name, email, mobile, dob, doj, password ,isAdmin=false} = request.body;
    
            const employee = new EmployeeModel({
                name,
                email,
                mobile,
                dob,
                doj,
                password,
                isAdmin,
            });
    
            await employee.save();

            response.redirect("/adminhome");
            
        } catch (error) {
            console.error(error);
            response.status(400).json({ message: "Error creating employee" });
        }
    }
    

    async updateEmployee(request: Request, response: Response): Promise<Response | any> {
        try {
            const { id } = request.params;
            const { name, email, mobile, dob, doj } = request.body;
    
            const employee = await EmployeeModel.findById(id);
            if (employee) {
                employee.name = name;
                employee.email = email;
                employee.mobile = mobile;

                if (dob) {
                    const parsedDob = new Date(dob);
                    if (!isNaN(parsedDob.getTime())) {
                        employee.dob = parsedDob;
                    } else {
                        return response.status(400).json({ message: "Invalid Date of Birth" });
                    }
                }
    
                if (doj) {
                    const parsedDoj = new Date(doj);
                    if (!isNaN(parsedDoj.getTime())) {
                        employee.doj = parsedDoj;
                    } else {
                        return response.status(400).json({ message: "Invalid Date of Joining" });
                    }
                }
    
                await employee.save();
                return response.redirect("/adminhome");
            }
            return response.status(404).json({ message: "Employee not found" });
        } catch (error) {
            console.error("Error details:", error);
            return response.status(400).json({ message: "Error updating employee" });
        }
    }
    


     editUserLoad = async (req: Request, res: Response): Promise<void> => {
        try {
            const uid: string | undefined = req.query.userid as string;
    
            if (uid) {
                const user = await EmployeeModel.findById(uid);
    
                if (user) {
                    res.render('adminuseredit', { edituser: user });
                } else {
                    res.status(404).send('User not found');
                }
            } else {
                res.status(400).send('User ID is required');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while loading user details');
        }
    }


     deleteUser = async (req: Request, res: Response): Promise<Response|any> => {
        try {
            const userId = req.query.userid as string; 
            
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
    
            const user = await EmployeeModel.findByIdAndDelete(userId); 
    
            if (user) {
                return res.redirect('/adminhome'); 
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    };

    


    
    

    async deleteEmployee(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            await EmployeeModel.findByIdAndDelete(id);
            return response.status(200).json({ message: "Employee deleted" });
        } catch (error) {
            return response.sendStatus(400);
        }
    }

    async renderAdminHome(req: Request, res: Response) {
        try {
            return res.render("login", { message: null, errmessage: null });
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
    
        if (email === credential.email && password === credential.password) {
           
            return res.redirect('/adminhome');
        } else {
            return res.status(401).render('login', { message: null, errmessage: 'Invalid email or password' });
        }
    }
    

    async renderAdminDashboard(req: Request, res: Response) {
        try {
            const employees = await EmployeeModel.find({ isAdmin: 0 });
            return res.render("adminhome", { name: credential.email, user: employees });
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }

    async renderCreateUser(req: Request, res: Response) {
        try {
            return res.render("adminusercreate");
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }

    async logout(req: Request, res: Response) {
        res.redirect("/");
    }
}

export default new EmployeeController();
