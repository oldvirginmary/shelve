"use strict"

Vue.component("task-form", {
    data() {
        return {
            name: "",
            description: "",
            errors: [],
        }
    },
    template: `
        <form class="task-form" @submit.prevent="checkForm">
            <input v-model="name" type="text" placeholder="Название"/>
            <textarea v-model="description" class="task-form__desc" placeholder="Описание"></textarea>
            <button class="task-form__submit-btn">Создать</button>
        </form>
    `,
    methods: {
        checkForm() {
            this.errors = [];

            if (!this.name || !this.description) {
                this.errors.push("Все поля обязательны для заполнения!");
                this.__printErrors();
            } else {
                this.__printTask();
                this.__printErrors();
            }
        },
        __printTask() {
            this.$emit("add-task", {
                name: this.name,
                description: this.description,
                isCompleted: false,
            });

            [this.name, this.description] = "";
        },
        __printErrors() {
            this.$emit("show-errors", this.errors);
        },
    }
});

Vue.component("tasks", {
    props: ["tasks"],
    template: `
        <ol class="tasks">
            <li 
                :class="['task', { 'task--completed': task.isCompleted }]" 
                v-for="(task, index) in tasks" 
                :key="index"
            >
                <div class="text-wrapper">
                    <h2 class="task__name">{{ task.name }}</h2>
                    <p class="task__description">{{ task.description }}</p>
                </div>
                <div class="controls-wrapper">
                    <button 
                        class="task__btn"
                        v-if="!task.isCompleted" 
                        @click="toggleTaskStatus(task)"
                    >Завершить</button>
                    <button 
                        class="task__btn"
                        v-if="task.isCompleted" 
                        @click="toggleTaskStatus(task)"
                    >Восстановить</button>
                    <button class="task__btn" @click="removeTask(index)">Удалить</button>
                </div>
            </li>
        </ol>
    `,
    methods: {
        removeTask(index) {
            this.$emit("remove-task", index);
        },
        toggleTaskStatus(task) {
            this.$emit("toggle-task-status", task);
        }
    }
});

Vue.component("errors", {
    props: ["errors"],
    template: `
        <ol>
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ol>
    `
});

let app = new Vue({
    el: "#app",
    data: {
        tasks: [],
        errors: [],
    },
    methods: {
        addTask(task) {
            this.tasks.push(task);
            this.__updateStorage();
        },
        toggleTaskStatus(task) {
            task.isCompleted = !task.isCompleted;
            this.__updateStorage();
        },
        removeTask(index) {
            this.tasks.splice(index, 1);
            this.__updateStorage();
        },
        __updateStorage() {
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        showErrors(errors) {
            this.errors = errors;
        },
    },
    mounted() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    }
});