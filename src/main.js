import { createApp } from 'vue'
import App from './App.vue'

import { library } from "@fortawesome/fontawesome-svg-core";
import { faGrip, faList, faMagnifyingGlass, faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faGrip, faList, faMagnifyingGlass, faAngleRight, faAngleLeft);

createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount("#app");
