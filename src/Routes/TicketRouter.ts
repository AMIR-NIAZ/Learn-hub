import { TicketController } from "../Controllers/TicketController";
import { Role } from "../Enums/RoleEnum";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import { BaseRouter } from "./BaseRouter";

export class TicketRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/create",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.USER}`)),
            this.handleErrors(TicketController.Create)
        );
        this.router.get("/user",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.USER}`)),
            this.handleErrors(TicketController.getUserTickets)
        );
        this.router.get("/",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(TicketController.getAll)
        );
        this.router.get("/unreplied",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(TicketController.getUnrepliedTickets)
        );
        this.router.delete("/",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(TicketController.deleteTicket)
        );
        this.router.post("/reply/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(TicketController.addTicketReply)
        );
    }
}
