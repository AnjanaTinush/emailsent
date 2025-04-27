import express from 'express';
import { addEmployee, login } from '../controllers/employee.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/add', addEmployee);




export default router;