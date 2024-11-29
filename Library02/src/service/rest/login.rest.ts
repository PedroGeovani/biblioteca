import { AuthRequest } from "@/models/login.model";
import api from "@/service/api-Config/rxjs-config";

export class LoginRest {
  login(body: AuthRequest) {
    return api.post("/authenticate", body);
  }
}
