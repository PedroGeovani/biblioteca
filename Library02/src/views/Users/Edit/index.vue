<template>
    <div class="flex justify-between mb-5">
        <h1 class="font-semibold font-inter text-2xl content-center">Editar Usuário</h1>
        <Button icon="pi pi-arrow-right" label="Voltar" iconPos="right" severity="success" text aria-label="back"
            @click="backToUsersView" />
    </div>
    <div>
        <form class="grid grid-rows-6 sm:grid-cols-3 gap-4 mb-10">
            <div class="flex flex-col">
                <label for="username">Nome:</label>
                <InputText id="username" v-model="user?.name" type="text" placeHolder="Digite o nome" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ nameValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userEmail">E-mail:</label>
                <InputText id="userEmail" v-model="user?.email" type="text" placeHolder="Digite o e-mail" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ emailValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userPhone">Telefone:</label>
                <InputText id="userPhone" v-model="user?.phone" type="text" placeHolder="(xx)xxxxx-xxxx" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ phoneValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userRole">Função:</label>
                <Select name="funcao" optionLabel="label" id="userRole" :options="roleOptions" v-model="selectedRole"
                    @change="setSelectedRole" :selected="user.role || selectedRole">
                </Select>
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ userRoleValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userPassword">Senha:</label>
                <InputText disabled="true" id="userPassword" type="password" placeHolder="Digite a senha" />
            </div>
            <div class="flex flex-col">
                <label for="userConfirmPassword">Confirmar Senha:</label>
                <InputText disabled="true" id="userConfirmPassword" type="password" placeHolder="Repita a senha" />
            </div>
        </form>
        <div class="flex sm:justify-end gap-4">
            <Button label="Cancelar" severity="danger"  outlined class="mt-4 w-1/2 lg:w-1/6" @click="backToUsersView" />
            <Button label="Confirmar" @click="validateFields()" severity="success" class="!bg-[#059669] mt-4 w-1/2 lg:w-1/6" />
        </div>
    </div>
</template>
<script lang="ts">
import { UserRole } from "@/models/login.model";
import { defineComponent } from "vue";
import { UserService } from "../users.service";
import { User } from "@/models/user.model";
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";
import { validateEmail, validatePhone } from "@/utils/validator.utils";
import { phoneMask } from "@/utils/mask.utils";
import { getUserToEdit } from "@/utils/user-storage.utils";

export default defineComponent({
    name: "EditUser",
    data() {
        return {
            user: {
                email: "",
                name: "",
                phone: "",
                role: "" as UserRole
            } as User,
            selectedRole: {
                label: "" as UserRole
            },
            roleOptions: [
                {
                    label: "ADMINISTRADOR",
                },
                {
                    label: "ESTUDANTE"
                }
            ]
        }
    },
    validations() {
        return {
            user: {
                name: {
                    required: helpers.withMessage("Campo Obrigatório", required)
                },
                email: {
                    required: helpers.withMessage("Campo obrigatório", required),
                    validateEmail: helpers.withMessage("Email inválido", this.validateEmail)
                },
                role: {
                    required: helpers.withMessage("Selecione a função", required)
                },
                phone: {
                    required: helpers.withMessage("Campo obrigatório", required),
                    validatePhone: helpers.withMessage("Telefone inválido", this.validatePhone)
                }
            }
        }
    },
    computed: {
        service(): UserService {
            return new UserService()
        },
        nameValidateErrorMessage(): string {
            return this.v$?.user?.name?.$errors[0]?.$message
        },
        emailValidateErrorMessage(): string {
            return this.v$?.user?.email?.$errors[0]?.$message
        },
        phoneValidateErrorMessage(): string {
            return this.v$?.user?.phone?.$errors[0]?.$message
        },
        userRoleValidateErrorMessage(): string {
            return this.v$?.user?.role?.$errors[0]?.$message
        }
    },
    methods: {
        getUserData(): void {
            const userData = getUserToEdit()
            this.selectedRole.label = this.translateRoleToPortuguese(userData?.role as string) as UserRole
            this.user = {
                email: userData?.email,
                name: userData?.name,
                phone: userData?.phone,
                role: userData?.role
            }
        },
        translateRoleToPortuguese(value: string): string {
            return value === "ADMINISTRATOR" ? "ADMINISTRADOR" : "ESTUDANTE"
        },
        translateRoleToEnglish(value: string): string {
            return value === "ADMINISTRADOR" ? "ADMINISTRATOR" : "STUDENT"
        },
        validateEmail(value: string): boolean {
            return validateEmail(value)
        },
        validatePhone(value: string): boolean {
            return validatePhone(value)
        },
        phoneMask(value: string): string {
            return phoneMask(value)
        },
        validateFields(): void {
            this.v$.$validate()
            if (!this.v$.$invalid) {
                this.user.phone = this.phoneMask(this.user.phone as string)
                this.editUser(this.$route.params.id as string, this.user)
                this.showSucessToast()
            } else {
                this.showErrorToast()
            }
        },
        editUser(id: string, body: User): void {
            this.service.user.pipe()
                .subscribe({
                    next: (response) => {
                        if (response) this.backToUsersView()
                    }
                })
            this.service.editUser(id, body)
        },
        backToUsersView(): void {
            this.$router.go(-1)
        },
        setSelectedRole(event: any): void {
            this.user.role = this.translateRoleToEnglish(event.value.label) as UserRole
        },
        showSucessToast(): void {
            this.$toast.add({ severity: "success", summary: "Sucesso", detail: "Usuário editado com sucesso.", life: 3000 })
        },
        showErrorToast(): void {
            this.$toast.add({ severity: "error", summary: "Erro", detail: "Preencha todos os campos.", life: 3000 })
        }
    },
    setup() {
        return { v$: useVuelidate() }
    },
    mounted() {
        this.getUserData()
    },
})
</script>

<style>
.p-button-label {
    font-size: 20px;
}
</style>