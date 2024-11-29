<template>
    <div class="flex flex-1">
        <div class="bg-[#059669] w-[50vw] hidden md:flex">
            <img src="../../assets/imageLogin.svg" alt="">
        </div>
        <div class="flex flex-col gap-3 justify-center h-screen w-screen md:w-[50vw] items-center">
            <div>
                <div class="max-w-[420px] flex flex-col gap-3 mb-3">
                    <h2 class="text-2xl font-semibold ml-7">Bem vindo!</h2>
                    <p class="font-light ml-7 ">Faça o login para reservar e emprestar livros de uma forma simples e
                        fácil.
                    </p>
                </div>
                <card class="mx-2 max-w-[429px]">
                    <template #content>
                        <div class="flex flex-col gap-5">
                            <div>
                                <p class="mb-2 font-normal">Usuário</p>
                                <InputText @keydown.enter="validateFields" type="text" v-model="body.username"
                                    placeHolder="email" class="w-full" />
                                <p v-if="v$.$errors" class="mt-2">
                                    <span class="text-red-900">
                                        {{ usernameValidate }}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p class="mb-2 font-normal">Senha</p>
                                <InputText @keydown.enter="validateFields" type="password" v-model="body.password"
                                    placeHolder="senha" class="w-full" />
                                <p v-if="v$.$errors" class="mt-2">
                                    <span class="text-red-900">
                                        {{ passwordValidate }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex gap-4 mt-5 flex-col items-center">
                            <Button label="Fazer login" type="submit" class="w-full" @click="validateFields" />
                            <p class="font-normal underline">Não consegue acessar? Fale com um atendente</p>
                        </div>
                    </template>
                </card>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
import useVuelidate from "@vuelidate/core";
import { LoginService } from "./login.service";
import { defineComponent } from "vue";
import LocalStorage from "@/utils/local-storage.utils";
import { helpers, required } from "@vuelidate/validators";
import { validateEmail } from "@/utils/validator.utils";
import { AuthRequest, AuthResponse, UserRole } from "@/models/login.model";

export default defineComponent({
    data() {
        return {
            body: {
                username: "",
                password: ""
            }
        }
    },
    validations() {
        return {
            body: {
                username: {
                    required: helpers.withMessage("Campo obrigatório", required),
                    validateEmail: helpers.withMessage("Email invalido", this.validateEmail)
                },
                password: {
                    required: helpers.withMessage("Campo obrigatório", required)
                }
            }
        }
    },
    computed: {
        loginService(): LoginService {
            return new LoginService()
        },
        localStorage(): LocalStorage<AuthResponse> {
            return new LocalStorage()
        },
        usernameValidate(): string {
            return this.v$?.body?.username?.$errors[0]?.$message
        },
        passwordValidate(): string {
            return this.v$?.body?.password?.$errors[0]?.$message
        }
    },
    methods: {
        validateEmail(value: string): boolean {
            return validateEmail(value)
        },
        validateFields(): void {
            this.v$.$validate()
            if (!this.v$.$invalid) {
                this.login(this.body)
            }
        },
        login(userLogin: AuthRequest): void {
            this.loginService.loginSubject.pipe().subscribe({
                next: (response: any) => {
                    if (response) this.setTokenLocalStorage(response as AuthResponse)
                    if (response.role === UserRole.ADMINISTRADOR) {
                        this.$router.push("/")
                    } else {
                        this.$router.push("/books")
                    }
                }
            })
            this.loginService.loginRest(userLogin)
        },
        setTokenLocalStorage(userLogin: AuthResponse): void {
            this.localStorage.setItem("user", userLogin)
        }
    },
    setup() {
        return { v$: useVuelidate() }
    }
})
</script>
