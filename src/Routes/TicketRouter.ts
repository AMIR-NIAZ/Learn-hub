import { TicketController } from "../Controllers/TicketController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import { BaseRouter } from "./BaseRouter";

export class TicketRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/create",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(TicketController.Create)
        );
        this.router.get("/user",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(TicketController.getUserTickets)
        );
        this.router.get("/",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(TicketController.getAll)
        );
        this.router.get("/unreplied",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(TicketController.getUnrepliedTickets)
        );
        this.router.delete("/",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(TicketController.deleteTicket)
        );
        this.router.post("/reply/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(TicketController.addTicketReply)
        );
    }
}
