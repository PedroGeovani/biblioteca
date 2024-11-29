import { AuthResponse, UserRole } from "@/models/login.model";
import { getUserToken } from "@/utils/user-storage.utils";
import {NavigationGuardNext, RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric} from "vue-router"


export function guardsTo(to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric, next: NavigationGuardNext): void {
    const isAuth = getUserToken()

    if(to.name !== 'login' && !isAuth ) {
        next("/login")
    }else {
        next()
    }
}


export function checkRole(to: RouteLocationNormalizedGeneric, user: AuthResponse, next: NavigationGuardNext): void | boolean {
    const requiredRoles = to.meta.role as UserRole[]
    const role = user?.role as UserRole

    if(requiredRoles.includes(role)) {
        next()
    }else {
        return false
    }
}