<template>    
        <headerSubView :titleHeader="'Cadastrar Usuário'" @returnButton="backToUsersView()" />
    <div>
        <form class="grid grid-flow-row lg:grid-cols-3 gap-4 mb-10">
            <div class="flex flex-col">
                <label for="username">Nome:</label>
                <InputText id="username" v-model="newUser?.name" type="text" placeholder="Digite o nome" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ nameValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userEmail">E-mail:</label>
                <InputText id="userEmail" v-model="newUser?.email" type="text" placeholder="Digite o e-mail" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ emailValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userPhone">Telefone:</label>
                <InputMask id="userPhone" v-model="newUser?.phone" type="text" placeholder="(xx) xxxxx-xxxx"
                    mask="(99) 99999-9999" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ phoneValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userRole">Função:</label>
                <Select name="funcao" optionLabel="label" id="userRole" :options="roleOptions" v-model="selectedRole"
                    placeholder="Selecione a Função" @change="setSelectedRole" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ userRoleValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userPassword">Senha:</label>
                <InputText id="userPassword" v-model="newUser?.password" type="password" placeholder="Digite a senha" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ passwordValidateErrorMessage }}
                    </span>
                </p>
            </div>
            <div class="flex flex-col">
                <label for="userConfirmPassword">Confirmar Senha:</label>
                <InputText id="userConfirmPassword" v-model="newUser?.confirmPassword" type="password"
                    placeholder="Repita a senha" />
                <p v-if="v$.$errors" class="mt-2">
                    <span class="text-red-900">
                        {{ userConfirmPasswordValidateErrorMessage }}
                    </span>
                </p>
            </div>
        </form>
        <div class="flex sm:flex-row sm:justify-end gap-4">
            <Button label="Cancelar" severity="danger" outlined class="sm:mt-4 w-1/2 lg:w-1/6" @click="backToUsersView" />
            <Button label="Cadastrar" @click="validateFields()" severity="success" class="sm:mt-4 w-1/2 lg:w-1/6 !bg-[#059669]" />
        </div>
    </div>
</template>
<script lang="ts">
import { UserRole } from '@/models/login.model';
import { defineComponent } from 'vue';
import { UserService } from '../users.service';
import { User } from '@/models/user.model';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required, sameAs } from '@vuelidate/validators';
import { validateEmail, validatePhone } from '@/utils/validator.utils';
import { phoneMask } from '@/utils/mask.utils';

export default defineComponent({
    name: 'RegisterUser',
    data() {
        return {
            newUser: {
                email: "",
                password: "",
                confirmPassword: "",
                name: "",
                phone: "",
                role: "" as UserRole
            } as User,
            selectedRole: null,
            roleOptions: [
                {
                    label: "ADMINISTRADOR",
                    role: "ADMINISTRATOR",
                },
                {
                    label: "ESTUDANTE",
                    role: "STUDENT"
                }
            ]
        }
    },
    validations() {
        return {
            newUser: {
                name: {
                    required: helpers.withMessage('Campo Obrigatório', required)
                },
                email: {
                    required: helpers.withMessage('Campo obrigatório', required),
                    validateEmail: helpers.withMessage('Email inválido', this.validateEmail)
                },
                password: {
                    required: helpers.withMessage("Campo obrigatório.", required),
                    minLengthPassword: helpers.withMessage("Senha deve conter no mínimo 6 caracteres", minLength(6))
                },
                confirmPassword: {
                    required: helpers.withMessage("Campo obrigatório", required),
                    sameAsPassword: helpers.withMessage("As senhas devem ser iguais", sameAs(this.newUser.password))
                },
                role: {
                    required: helpers.withMessage("Selecione a função", required)
                },
                phone: {
                    required: helpers.withMessage("Campo obrigatório", required),
                    validatePhone: helpers.withMessage('Telefone inválido', this.validatePhone)
                }
            }
        }
    },
    computed: {
        service(): UserService {
            return new UserService()
        },
        nameValidateErrorMessage(): string {
            return this.v$?.newUser?.name?.$errors[0]?.$message
        },
        emailValidateErrorMessage(): string {
            return this.v$?.newUser?.email?.$errors[0]?.$message
        },
        phoneValidateErrorMessage(): string {
            return this.v$?.newUser?.phone?.$errors[0]?.$message
        },
        userRoleValidateErrorMessage(): string {
            return this.v$?.newUser?.role?.$errors[0]?.$message
        },
        passwordValidateErrorMessage(): string {
            return this.v$?.newUser?.password?.$errors[0]?.$message
        },
        userConfirmPasswordValidateErrorMessage(): string {
            return this.v$?.newUser?.confirmPassword?.$errors[0]?.$message
        }
    },
    methods: {
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
                this.newUser.phone = this.phoneMask(this.newUser.phone as string)
                this.saveUser(this.newUser)
                this.showSucessToast()
            } else {
                this.showErrorToast()
            }
        },
        saveUser(body: User): void {
            this.service.user.pipe()
                .subscribe({
                    next: (response) => {
                        if (response) this.backToUsersView()
                    }
                })
            this.service.registerNewUser(body)
        },
        backToUsersView(): void {
            this.$router.go(-1)
        },
        setSelectedRole(event: any): void {
            this.newUser.role = event.value.role
        },
        showSucessToast(): void {
            this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário salvo com sucesso.', life: 3000 })
        },
        showErrorToast(): void {
            this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos.', life: 3000 })
        }
    },
    setup() {
        return { v$: useVuelidate() }
    },
})
</script>

<style>
.p-button-label {
    font-size: 20px;
}
</style>