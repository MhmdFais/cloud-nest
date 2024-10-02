import loginController from "../controllers/login";

const authenticate = loginController.isAuthenticated;

export default { authenticate };
