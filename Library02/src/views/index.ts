export class Views {
  static Login(): Promise<any> {
    return import("@/views/Login/index.vue");
  }

  static User(): Promise<any> {
    return import("@/views/Users/index.vue");
  }

  static Register(): Promise<any> {
    return import("@/views/Users/Register/index.vue");
  }

  static Edit(): Promise<any> {
    return import("@/views/Users/Edit/index.vue");
  }
 
  static Categories(): Promise<any> {
    return import("@/views/Category/category.vue");
  }

  static Rent(): Promise<any> {
    return import("@/views/Rent/index.vue");
  }

  static Books(): Promise<any> {
    return import("@/views/Books/index.vue");
  }

  static RegistryBook(): Promise<any> {
    return import("@/views/Books/RegistryBook/index.vue");
  }

  static EditBook(): Promise<any> {
    return import("@/views/Books/EditBook/index.vue");
  }

  static Reserve(): Promise<any> {
    return import("@/views/Reserve/reserve.vue");
  }

  static ReserveCreate(): Promise<any> {
    return import("@/views/Reserve/reserve-create.vue");
  }

  static ReserveDetails(): Promise<any> {
    return import("@/views/Reserve/reserve-details.vue");
  }

  static Stock(): Promise<any> {
    return import("@/views/Stock/index.vue");
  }

  static NotFound(): Promise<any> {
    return import("@/views/NotFound/not-found.vue");
  }
}
