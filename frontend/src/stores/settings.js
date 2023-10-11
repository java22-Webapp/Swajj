import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
    const settings = ref({
        kidsMode: false,
        english: false,
        rounds: 15,
        time: 15
    });

    function setSettings(newSettings) {
        this.settings = { ...newSettings };
    }

    return { settings, setSettings }
})
