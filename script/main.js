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
            <li :class="['task', { 'task--completed': task.isCompleted }]" v-for="(task, index) in tasks">
                <div class="text-wrapper">
                    <h2 class="task__name">{{ task.name }}</h2>
                    <p class="task__description">{{ task.description }}</p>
                </div>
                <div class="controls-wrapper">
                    <button 
                        class="task__btn"
                        v-if="!task.isCompleted" 
                        @click="task.isCompleted = true"
                    >Завершить</button>
                    <button 
                        class="task__btn"
                        v-if="task.isCompleted" 
                        @click="task.isCompleted = false"
                    >Восстановить</button>
                    <button class="task__btn" @click="removeTask(index)">Удалить</button>
                </div>
            </li>
        </ol>
    `,
    methods: {
        removeTask(index) {
            this.tasks.splice(index, 1);
        }
    }
});

Vue.component("errors", {
    props: ["errors"],
    template: `
        <ol>
            <li v-for="error in errors">{{ error }}</li>
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
        },
        showErrors(errors) {
            this.errors = errors;
        },
    }
});