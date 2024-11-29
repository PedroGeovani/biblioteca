import { User } from "@/models/user.model";
import api from "../api-Config/rxjs-config";

export class UserRest {
  getAllUsers(params?: {}) {
    return api.get("/user", params);
  }

  registerNewUser(body: User) {
    return api.post("/user", body);
  }

  deleteUser(id: string) {
    return api.deleteR(`/user/${id}`);
  }

  editUser(id: string, body: User) {
    return api.put(`/user/${id}`, body);
  }
}
