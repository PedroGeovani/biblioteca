<script lang="ts">
import { defineComponent } from "vue";
import { RentService } from "../rent.service";
import router from "@/router";
import { Rent } from "@/models/rent.model";

export default defineComponent({
    name: "RentDetail",
    data() {
        return {
            idRent: String(router.currentRoute.value.params.idRent),
            rentById: new Rent(),
            rentStartDate: new Date(),
            rentFinalDate: new Date()
        };
    },
    mounted() {
        this.getRentsById(this.getIdByRoute);
    },
    methods: {
        getRentsById(idRent: string): void {
            this.service.rent.subscribe({ next: (response) => {
                this.rentById = response;
                this.rentStartDate = new Date(response.rentDate);
                this.rentFinalDate = new Date(response.rentFinalDate);
            }});
            this.service.findByIdRent(idRent);
        },
        backPage(): void {
            this.$router.push("/rents/1");
        },
    },
    computed: {
        service(): RentService {
            return new RentService();
        },
        getIdByRoute(): string {
            return String(router.currentRoute.value.params.idRent);
        }
    }
});
</script>
<template>
    <main class="font-inter">                    
        <headerSubView :titleHeader="'Detalhe Empréstimo'" @returnButton="$router.push({ path: '/rents/1' })" />
        <div class="border-2 rounded-lg border-gray-300">
            <p class="text-2xl font p-4 ps-9">Reserva</p>
            <div class="flex flex-wrap">
                <div class="flex border-2 rounded-[4px] border-gray-300 p-5 justify-center m-2 lg:ml-8 mb-5">
                    <div>
                        <label for="buttondisplay" class="block mb-2"> Iniciado em: </label>
                        <DatePicker 
                            v-model="rentStartDate" 
                            showIcon fluid 
                            :showOnFocus="false" 
                            class="me-9" 
                            dateFormat="dd/mm/yy"
                            selection-mode="single"
                            disabled
                        />
                    </div>
                    <div>
                        <label for="buttondisplay" class="block mb-2"> Finalizado em: </label>
                        <DatePicker 
                            v-model="rentFinalDate" 
                            showIcon fluid 
                            :showOnFocus="false" 
                            dateFormat="dd/mm/yy"
                            selection-mode="single"
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-center gap-4 lg:flex-row m-2 lg:ml-8">
                <div class="border-2 rounded-[4px] border-gray-300 flex text-xl ps-4 pt-5 pe-8 pb-5">
                    <ul>
                        <li>
                            <div class="flex flex-wrap">
                                <span class=" text-gray-400">Isbn:</span>
                                <span class="ml-2">{{ rentById.book?.isbn }}</span>
                            </div>
                        </li>
                        <li>
                            <div class="flex flex-wrap">
                                <span class=" text-gray-400">Título:</span>
                                <span class="ml-2">{{ rentById.book?.title }}</span>
                            </div>
                        </li>
                        <li>
                            <div class="flex flex-wrap">
                                <span class=" text-gray-400">Autor:</span>
                                <span class="ml-2">{{ rentById.book?.author }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="border-2 rounded-[4px] border-gray-300 flex text-xl ps-4 pt-5 pe-8 pb-5">
                    <ul>
                        <li>
                            <div class="flex flex-wrap">
                                <span class="text-gray-400">E-mail:</span>
                                <span class="ml-2">{{ rentById.user?.email }}</span>
                            </div>
                        </li>
                        <li>
                            <div class="flex flex-wrap">
                                <span class=" text-gray-400">Estudante:</span>
                                <span class="ml-2">{{ rentById.user?.name }}</span>
                            </div> 
                        </li>
                        <li>
                            <div class="flex flex-wrap">
                                <span class=" text-gray-400">Telefone:</span>
                                <span class="ml-2">{{ rentById.user?.phone }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</template>